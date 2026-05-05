// App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import type { WebsiteInstance } from "./domains/builder/core/types";
import { TemplateList } from "./domains/builder/pages/TemplateList";
import { PageRenderer } from "./domains/builder/renderer/PageRenderer";
import Login from "./Login";

// --- Home Page (Template List) ---
const Home = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<WebsiteInstance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all templates from backend
  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const [userTemplate, setUserTemplate] = useState<WebsiteInstance | null>(null);

  const handleSelectTemplate = async (tpl: WebsiteInstance) => {
    try {
      const res = await fetch(`/api/templates/${tpl.id}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({}),
      });
  
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
      const data = await res.json();
      setUserTemplate(data.template);
    } catch (err) {
      console.error('Clone failed', err);
    }
  };

  if (loading) return <p>Loading templates...</p>;

  return <TemplateList templates={templates} onSelect={handleSelectTemplate} />;
};

// --- Template Editor Page ---
const TemplateEditor = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteInstance | null>(null);
  const [editing, setEditing] = useState(false);
  const [currentPageSlug, setCurrentPageSlug] = useState("home");

  // Load template from location state (passed from Home) or fetch user template
  useEffect(() => {
    const stored = window.history.state?.usr?.template as WebsiteInstance;
    if (stored) {
      setSelectedTemplate(stored);
    } else {
      // fallback: fetch user's template from backend
      fetch("/api/user-template")
        .then((res) => res.json())
        .then((data) => setSelectedTemplate(data))
        .catch((err) => console.error(err));
    }
  }, []);

  if (!selectedTemplate) return <p>Loading template...</p>;

  const currentPage = selectedTemplate.pages.find((p: { slug: string; }) => p.slug === currentPageSlug);
  if (!currentPage) return <p>Page not found.</p>;

  const updateSectionContent = (sectionId: string, newContent: Record<string, any>) => {
    const updatedPages = selectedTemplate.pages.map((page: { sections: { id: string; content: any; }[]; }) => ({
      ...page,
      sections: page.sections.map((section: { id: string; content: any; }) =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, ...newContent } }
          : section
      ),
    }));

    setSelectedTemplate({ ...selectedTemplate, pages: updatedPages });
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    const updatedPages = selectedTemplate.pages.map((page: { slug: string; sections: any; }) => {
      if (page.slug !== currentPageSlug) return page;
      const sections = [...page.sections];
      const [moved] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, moved);
      return { ...page, sections };
    });
    setSelectedTemplate({ ...selectedTemplate, pages: updatedPages });
  };

  const saveTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      await fetch(`/api/user-template/${selectedTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTemplate),
      });
      alert("Template saved!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div style={{ padding: 10, background: "#f0f0f0" }}>
        <button onClick={() => navigate("/")}>Back to Template List</button>
      </div>

      {/* Edit / Save Buttons */}
      <div style={{ padding: 10, display: "flex", gap: 10 }}>
        <button onClick={() => setEditing(!editing)}>
          {editing ? "Preview Mode" : "Edit Mode"}
        </button>
        <button onClick={saveTemplate} disabled={!editing}>
          Save Template
        </button>
      </div>

      {/* Page Selector */}
      <div style={{ padding: 10 }}>
        {selectedTemplate.pages.map((page: { id: React.Key | null | undefined; slug: React.SetStateAction<string>; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
          <button
            key={page.id}
            onClick={() => setCurrentPageSlug(page.slug)}
            style={{
              marginRight: 5,
              background: page.slug === currentPageSlug ? "#4f46e5" : "#eee",
              color: page.slug === currentPageSlug ? "#fff" : "#000",
            }}
          >
            {page.name}
          </button>
        ))}
      </div>

      {/* Render Page */}
      <PageRenderer
        website={selectedTemplate}
        page={currentPage}
        updateSectionContent={updateSectionContent}
        reorderSections={reorderSections}
        editing={editing}
      />
    </div>
  );
};

// --- Main App ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor" element={<TemplateEditor />} />
      </Routes>
    </Router>
  );
}

export default App;