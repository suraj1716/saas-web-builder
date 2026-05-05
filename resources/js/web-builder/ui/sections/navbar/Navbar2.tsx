/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  NAVBAR CONTRACT — every navbar component MUST follow this  ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * 1. Accept these exact props: content, website, editing, updateWebsite
 * 2. Get pages from:  website?.data?.pages ?? []   ← NEVER hardcode
 * 3. Navigate with:   router.visit(`${getBaseRoute()}/${page.slug}`)
 * 4. getBaseRoute() must use usePage().props: trial, templateId, websiteId
 *
 * This file is Navbar2 as a reference implementation.
 * Copy this pattern for any new navbar design.
 */

import React from "react";
import { router, usePage } from "@inertiajs/react";

type Props = {
  content?: any;
  website?: any;
  editing?: boolean;
  updateWebsite?: (fn: any) => void;
};

export default function Navbar2({ content = {}, website, editing = false, updateWebsite }: Props) {
  // ── REQUIRED: always read from Inertia page props ──
  const { trial, templateId, websiteId, slug } = usePage().props as any;

  // ── REQUIRED: pages always from website.data.pages ──
  const pages = website?.data?.pages ?? [];

  // ── REQUIRED: base route helper (same in every navbar + footer) ──
  const getBaseRoute = () => {
    if (trial) return `/template/${templateId}/editor`;
    if (websiteId) return `/builder/${websiteId}`;
    return `/template/${templateId}`;
  };

  // ── REQUIRED: navigation function ──
  const goToPage = (pageSlug: string) => {
    router.visit(`${getBaseRoute()}/${pageSlug}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // ── REQUIRED: add/delete/rename pages ──
  const addPage = () => {
    if (!updateWebsite) return;
    const newSlug = `page-${Date.now()}`;
    updateWebsite((prev: any) => ({
      ...prev,
      data: { ...prev.data, pages: [...(prev.data.pages || []), { pageId: Date.now(), slug: newSlug, title: "New Page", sections: [] }] },
    }));
    router.visit(`${getBaseRoute()}/${newSlug}`, { preserveState: true });
  };

  const deletePage = (pageId: number, pageSlug: string) => {
    if (!updateWebsite) return;
    updateWebsite((prev: any) => {
      const all = prev?.data?.pages ?? [];
      if (all.length <= 1) { alert("At least one page required"); return prev; }
      const updated = all.filter((p: any) => p.pageId !== pageId);
      if (slug === pageSlug) setTimeout(() => router.visit(`${getBaseRoute()}/${updated[0].slug}`, { preserveState: true }), 0);
      return { ...prev, data: { ...prev.data, pages: updated } };
    });
  };

  const updateTitle = (pageId: number, value: string) => {
    if (!updateWebsite) return;
    updateWebsite((prev: any) => ({
      ...prev,
      data: { ...prev.data, pages: (prev.data.pages || []).map((p: any) => p.pageId === pageId ? { ...p, title: value } : p) },
    }));
  };

  /* ════════════════════════════════════════════
     YOUR DESIGN GOES HERE — everything above
     stays the same across all navbar variants.
     Only the JSX below changes per design.
  ════════════════════════════════════════════ */
  return (
    <nav style={{
      background: "#0f0f11", padding: "0 clamp(20px,5vw,64px)",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
    }}>
      {/* Logo */}
      <span style={{ fontWeight: 900, fontSize: 20, color: "#fff", letterSpacing: "-0.04em" }}>
        {content?.logo || website?.name || "Brand"}
      </span>

      {/* ── Pages as nav links — always from website.data.pages ── */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {pages.map((p: any) => (
          <div key={p.pageId} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {editing ? (
              <>
                <input
                  value={p.title}
                  onChange={e => updateTitle(p.pageId, e.target.value)}
                  style={{ fontSize: 14, color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 8px", outline: "none", width: 90 }}
                />
                <button onClick={() => deletePage(p.pageId, p.slug)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>✕</button>
              </>
            ) : (
              <button
                onClick={() => goToPage(p.slug)}
                style={{ fontSize: 14, color: slug === p.slug ? "#fff" : "rgba(255,255,255,0.5)", background: slug === p.slug ? "rgba(255,255,255,0.08)" : "none", border: "none", cursor: "pointer", padding: "6px 14px", borderRadius: 8, transition: "all 0.15s" }}
              >
                {p.title}
              </button>
            )}
          </div>
        ))}
        {editing && (
          <button onClick={addPage} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
            + Page
          </button>
        )}
      </div>

      {/* CTA */}
      <button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
        {content?.cta || "Get Started"}
      </button>
    </nav>
  );
}

export const defaultContent = {
  logo: "Brand",
  cta: "Get Started",
};