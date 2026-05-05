import { router, usePage } from "@inertiajs/react";

type Props = {
  content?: { title?: string };
  website?: any;
  editing?: boolean;
  updateWebsite?: (site: any) => void;
};

export default function Navbar({
  content,
  website,
  editing = false,
  updateWebsite,
}: Props) {
  const { trial, templateId, websiteId, slug } = usePage().props as any;

  const getBaseRoute = () => {
    if (trial) return `/template/${templateId}/editor`;
    if (websiteId) return `/builder/${websiteId}`;
    return `/template/${templateId}`;
  };

  const goToPage = (pageSlug: string) => {
    router.visit(`${getBaseRoute()}/${pageSlug}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // ✅ ADD PAGE
  const addPage = () => {
    if (!updateWebsite) return;
  
    const newSlug = `page-${Date.now()}`;
  
    const newPage = {
      pageId: Date.now(),
      slug: newSlug,
      title: "New Page",
      sections: [
        {
          id: Date.now().toString(),
          type: "hero",
          content: {
            heading: "New Page",
            subheading: "Start editing...",
          },
        },
      ],
    };
  
    updateWebsite((prev: any) => {
      const pages = prev?.data?.pages ?? [];
  
      const updatedPages = [...pages, newPage];
  
      return {
        ...prev,
        data: {
          ...prev.data,
          pages: updatedPages,
        },
      };
    });
  
    router.visit(`${getBaseRoute()}/${newSlug}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // ✅ DELETE PAGE
  const deletePage = (pageId: number, pageSlug: string) => {
    if (!updateWebsite) return;
  
    updateWebsite((prev: any) => {
      const pages = prev?.data?.pages ?? [];
  
      if (pages.length <= 1) {
        alert("At least one page required");
        return prev;
      }
  
      const updatedPages = pages.filter(
        (p: any) => p.pageId !== pageId
      );
  
      // redirect BEFORE return (safe capture)
      if (slug === pageSlug) {
        const nextPage = updatedPages[0];
  
        setTimeout(() => {
          router.visit(`${getBaseRoute()}/${nextPage.slug}`, {
            preserveState: true,
            preserveScroll: true,
          });
        }, 0);
      }
  
      return {
        ...prev,
        data: {
          ...prev.data,
          pages: updatedPages,
        },
      };
    });
  };

  // ✅ UPDATE TITLE
  const updateTitle = (pageId: number, value: string) => {
    if (!updateWebsite) return;
  
    updateWebsite((prev: any) => {
      const pages = prev?.data?.pages ?? [];
  
      const updatedPages = pages.map((p: any) =>
        p.pageId === pageId
          ? { ...p, title: value ?? "" }
          : p
      );
  
      return {
        ...prev,
        data: {
          ...prev.data,
          pages: updatedPages,
        },
      };
    });
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between" }}>
      {/* LOGO */}
      <div>{content?.title || website?.name || "My Site"}</div>

      {/* NAV LINKS */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {website?.pages?.map((p: any) => {
          const isActive = slug === p.slug;

          return (
            <div
              key={p.pageId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                border: isActive ? "1px solid #4f46e5" : "1px solid #ddd",
                padding: "4px 6px",
                borderRadius: 6,
              }}
            >
              {/* TITLE */}
              {editing ? (
                <input
                  value={p.title}
                  onChange={(e) =>
                    updateTitle(p.pageId, e.target.value)
                  }
                  style={{
                    border: "none",
                    outline: "none",
                    width: 80,
                  }}
                />
              ) : (
                <button onClick={() => goToPage(p.slug)}>
                  {p.title}
                </button>
              )}

              {/* ❌ DELETE BUTTON */}
              {editing && (
                <button
                  onClick={() => deletePage(p.pageId, p.slug)}
                  style={{
                    color: "red",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                  title="Delete Page"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}

        {/* ➕ ADD */}
        {editing && (
          <button
            onClick={addPage}
            style={{
              padding: "4px 10px",
              border: "1px dashed #999",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            +
          </button>
        )}
      </div>
    </nav>
  );
}