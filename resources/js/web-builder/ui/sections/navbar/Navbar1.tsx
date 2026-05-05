import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";

type Props = {
  content?: any;
  website?: any;
  editing?: boolean;
  updateWebsite?: (fn: any) => void;
};

export default function Navbar1({ content = {}, website, editing = false, updateWebsite }: Props) {
  const { trial, templateId, websiteId, slug } = usePage().props as any;
  const [menuOpen, setMenuOpen] = useState(false);

  // Pages always come from website.data.pages — never hardcoded
  const pages = website?.data?.pages ?? [];

  /* ── Base route (same logic used everywhere) ── */
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

  /* ── Page CRUD ── */
  const addPage = () => {
    if (!updateWebsite) return;
    const newSlug = `page-${Date.now()}`;
    updateWebsite((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        pages: [...(prev.data.pages || []), { pageId: Date.now(), slug: newSlug, title: "New Page", sections: [] }],
      },
    }));
    router.visit(`${getBaseRoute()}/${newSlug}`, { preserveState: true, preserveScroll: true });
  };

  const deletePage = (pageId: number, pageSlug: string) => {
    if (!updateWebsite) return;
    updateWebsite((prev: any) => {
      const all = prev?.data?.pages ?? [];
      if (all.length <= 1) { alert("At least one page required"); return prev; }
      const updated = all.filter((p: any) => p.pageId !== pageId);
      if (slug === pageSlug) {
        setTimeout(() => router.visit(`${getBaseRoute()}/${updated[0].slug}`, { preserveState: true }), 0);
      }
      return { ...prev, data: { ...prev.data, pages: updated } };
    });
  };

  const updateTitle = (pageId: number, value: string) => {
    if (!updateWebsite) return;
    updateWebsite((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        pages: (prev.data.pages || []).map((p: any) => p.pageId === pageId ? { ...p, title: value } : p),
      },
    }));
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #f3f4f6",
      padding: "0 clamp(20px,5vw,64px)",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
    }}>
      {/* Logo */}
      <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.04em", color: "#0f0f11" }}>
        {content?.logo || website?.name || "Brand"}
      </div>

      {/* Pages as nav links */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {pages.map((p: any) => (
          <div key={p.pageId} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {editing ? (
              <>
                <input
                  value={p.title}
                  onChange={(e) => updateTitle(p.pageId, e.target.value)}
                  style={{ fontSize: 14, fontWeight: 500, color: "#374151", background: "none", border: "1px dashed #d1d5db", borderRadius: 6, padding: "4px 8px", outline: "none", width: 80 }}
                />
                <button onClick={() => deletePage(p.pageId, p.slug)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>✕</button>
              </>
            ) : (
              <button
                onClick={() => goToPage(p.slug)}
                style={{ fontSize: 14, fontWeight: 500, color: slug === p.slug ? "#6366f1" : "#374151", background: "none", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8 }}
              >
                {p.title}
              </button>
            )}
          </div>
        ))}
        {editing && (
          <button onClick={addPage} style={{ fontSize: 13, color: "#9ca3af", background: "none", border: "1px dashed #d1d5db", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
            + Page
          </button>
        )}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 10 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer" }}>{content?.link_label || "Sign in"}</button>
        <button style={{ background: "#0f0f11", color: "#fff", borderRadius: 8, padding: "8px 18px", cursor: "pointer", border: "none" }}>{content?.cta || "Get Started"}</button>
      </div>
    </nav>
  );
}

export const defaultContent = {
  logo: "Brand",
  link_label: "Sign in",
  cta: "Get Started",
};