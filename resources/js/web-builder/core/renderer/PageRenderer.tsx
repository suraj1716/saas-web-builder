import React, { useState } from "react";
import {
  sectionRegistry,
  getDefaultNavbarType,
  getDefaultFooterType,
} from "../registry/sectionRegistry";
import { withEditor } from "@/web-builder/core/editor/withEditor";
import {
  FiCopy,
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiPlus,
  FiMenu,
  FiRefreshCw,
} from "react-icons/fi";
import { withFooterEditor } from "../editor/Withfootereditor";

/* ─────────────────────────────────────────
   TOOLBAR BUTTON
───────────────────────────────────────── */
function ToolBtn({
  onClick,
  icon,
  label,
  danger = false,
}: {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <div className="relative group/btn">
      <button
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        className={`flex items-center justify-center w-7 h-7 rounded-md text-[12px] transition-all duration-100 cursor-pointer ${
          danger
            ? "text-red-400 hover:bg-red-500/20 hover:text-red-300"
            : "text-white/60 hover:bg-white/[0.12] hover:text-white"
        }`}
      >
        {icon}
      </button>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap bg-[#0c0e1a] text-white/70 border border-white/[0.07] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-100 z-50">
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ADD STRIP — between sections
───────────────────────────────────────── */
function AddStrip({ onAdd }: { onAdd: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: 28, zIndex: 10 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] transition-all duration-150"
        style={{ background: hovered ? "rgba(99,102,241,0.5)" : "transparent" }}
      />
      <button
        onClick={onAdd}
        className={`relative flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide cursor-pointer border transition-all duration-150 ${
          hovered
            ? "bg-indigo-500 border-indigo-400 text-white shadow-md shadow-indigo-900/40 scale-100 opacity-100"
            : "bg-transparent border-transparent text-transparent scale-95 opacity-0"
        }`}
      >
        <FiPlus size={9} /> Add section
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────── */
function SectionWrapper({
  children, index, total, onDuplicate, onDelete, onMoveUp, onMoveDown, sectionType, onReset,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  sectionType: string;
  onReset: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative group/section"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover border */}
      <div
        className="absolute inset-0 pointer-events-none rounded-sm transition-all duration-150 z-[5]"
        style={{
          boxShadow: hovered
            ? "inset 0 0 0 1.5px rgba(99,102,241,0.5)"
            : "inset 0 0 0 1.5px transparent",
        }}
      />

      {/* Floating toolbar */}
      <div
        className="absolute top-2 right-2 z-[30] flex items-center gap-0.5 px-1.5 py-1 rounded-lg border border-white/[0.08] shadow-xl transition-all duration-150"
        style={{
          background: "rgba(22,25,41,0.92)",
          backdropFilter: "blur(8px)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(-4px)",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <span className="text-[9px] font-semibold tracking-widest uppercase text-white/25 px-1.5 pr-2 border-r border-white/[0.08] mr-0.5">
          {sectionType}
        </span>
        {index > 0 && <ToolBtn onClick={onMoveUp} icon={<FiChevronUp size={13} />} label="Move up" />}
        {index < total - 1 && <ToolBtn onClick={onMoveDown} icon={<FiChevronDown size={13} />} label="Move down" />}
        {(index > 0 || index < total - 1) && <div className="w-px h-4 bg-white/[0.07] mx-0.5" />}
        <ToolBtn onClick={onDuplicate} icon={<FiCopy size={12} />} label="Duplicate" />
        <ToolBtn onClick={onDelete} icon={<FiTrash2 size={12} />} label="Delete" danger />
        <ToolBtn onClick={onReset} icon={<FiRefreshCw size={12} />} label="Reset" />
      </div>

      {/* Drag handle */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-[25] flex items-center justify-center w-5 transition-all duration-150"
        style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? "auto" : "none" }}
      >
        <FiMenu size={13} className="text-indigo-400/60 cursor-grab" />
      </div>

      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LAYOUT WRAP — orange replace bar for
   Navbar / Footer in edit mode
   
   Now also shows a Reset button for footer.
───────────────────────────────────────── */
function LayoutWrap({
  children,
  slot,
  type,
  onReplace,
  onReset,
}: {
  children: React.ReactNode;
  slot: string;
  type: string;
  onReplace: () => void;
  onReset?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Orange hover border */}
      <div
        className="absolute inset-0 pointer-events-none z-[5] transition-all duration-150"
        style={{
          boxShadow: hovered
            ? "inset 0 0 0 1.5px rgba(251,146,60,0.5)"
            : "inset 0 0 0 1.5px transparent",
        }}
      />

      {/* Replace toolbar */}
      <div
        className="absolute top-2 right-2 z-[30] flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/[0.07] shadow-xl transition-all duration-150"
        style={{
          background: "rgba(22,25,41,0.92)",
          backdropFilter: "blur(8px)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(-4px)",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <span className="text-[9px] font-semibold tracking-widest uppercase text-orange-400/70 pr-2 border-r border-white/[0.07]">
          {slot} · {type}
        </span>
        <button
          onClick={onReplace}
          className="flex items-center gap-1 text-[10px] font-semibold text-white/55 hover:text-white px-1 py-0.5 rounded hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <FiPlus size={10} /> Replace
        </button>
        {onReset && (
          <>
            <div className="w-px h-3.5 bg-white/[0.07]" />
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[10px] font-semibold text-white/40 hover:text-white px-1 py-0.5 rounded hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <FiRefreshCw size={9} /> Reset
            </button>
          </>
        )}
      </div>

      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE RENDERER
───────────────────────────────────────── */
export const PageRenderer = ({
  website,
  page,
  editing,
  updateWebsite,
  duplicateSection,
  onInsertAt,
  onReplaceLayout,
}: {
  website: any;
  page: any;
  editing: boolean;
  updateWebsite: (fn: any) => void;
  duplicateSection: (id: string, slug: string) => void;
  onInsertAt?: (index: number) => void;
  onReplaceLayout?: (slot: "navbar" | "footer") => void;
}) => {
  if (!page)
    return (
      <div className="flex items-center justify-center h-40 text-white/20 text-sm">
        Loading…
      </div>
    );
console.log('website',website)
  const sections = Array.isArray(page?.sections) ? page.sections : [];

  /* ── reset a body section to its default content ── */
  const resetSection = (sectionId: string) => {
    const section = sections.find((s: any) => s.id === sectionId);
    if (!section) return;
    const config = sectionRegistry[section.type];
    if (!config) return;
    sync(
      sections.map((s: any) =>
        s.id === sectionId
          ? { ...s, content: { ...(config.defaultContent || {}) } }
          : s
      )
    );
  };

  /* ── reset footer content to defaultContent ── */
  const resetFooterContent = () => {
    const config = sectionRegistry[footerType];
    if (!config) return;
    updateWebsite((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        layout: {
          ...prev.data?.layout,
          footer: {
            ...prev.data?.layout?.footer,
            content: { ...(config.defaultContent || {}) },
          },
        },
      },
    }));
  };

  /* ── sync sections ── */
  const sync = (updatedSections: any[]) => {
    updateWebsite((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        pages: (prev.data?.pages || []).map((p: any) =>
          p.slug === page.slug ? { ...p, sections: updatedSections } : p
        ),
      },
    }));
  };

  const deleteSection = (index: number) =>
    sync(sections.filter((_: any, i: number) => i !== index));

  const move = (from: number, to: number) => {
    const updated = [...sections];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    sync(updated);
  };

  /* ── resolve navbar + footer ── */
  const layout = website?.data?.layout || {};

  const navbarType: string = layout?.navbar?.type || getDefaultNavbarType() || "";
  const footerType: string = layout?.footer?.type || getDefaultFooterType() || "";

  const NavbarComponent = navbarType ? sectionRegistry[navbarType]?.component ?? null : null;
  const FooterComponent = footerType ? sectionRegistry[footerType]?.component ?? null : null;

  const navbarContent =
    layout?.navbar?.content ?? sectionRegistry[navbarType]?.defaultContent ?? {};
  const footerContent =
    layout?.footer?.content ?? sectionRegistry[footerType]?.defaultContent ?? {};

  /*
   * KEY CHANGE: wrap FooterComponent with withFooterEditor when editing.
   * This gives every data-block / data-edit inside the footer the same
   * ↑ ↓  +  ×  toolbar that body sections get from withEditor.
   */
  const EditableFooter = editing && FooterComponent
    ? withFooterEditor(FooterComponent)
    : FooterComponent;

  /* ── empty state ── */
  const EmptyState = () => (
    <div
      className="flex flex-col items-center justify-center gap-3 py-28 mx-auto"
      style={{ maxWidth: 480 }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          border: "1.5px dashed rgba(99,102,241,0.35)",
          background: "rgba(99,102,241,0.04)",
        }}
      >
        <FiPlus size={22} className="text-indigo-400/40" />
      </div>
      <div className="text-center">
        <p className="text-white/30 text-sm font-medium">No sections yet</p>
        <p className="text-white/15 text-[11px] mt-1">
          Open the Section Library to add your first section
        </p>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <div className="min-h-full">

      {/* ══ NAVBAR ══ */}
      {NavbarComponent && (
        editing ? (
          <LayoutWrap
            slot="Navbar"
            type={navbarType}
            onReplace={() => onReplaceLayout?.("navbar")}
          >
            <NavbarComponent
              content={navbarContent}
              website={website}
              editing={editing}
              updateWebsite={updateWebsite}
            />
          </LayoutWrap>
        ) : (
          <NavbarComponent
            content={navbarContent}
            website={website}
            editing={editing}
            updateWebsite={updateWebsite}
          />
        )
      )}

      {/* ══ SECTIONS ══ */}
      <div className="relative">
        {editing && sections.length === 0 && <EmptyState />}

        {editing && sections.length > 0 && (
          <AddStrip onAdd={() => onInsertAt?.(0)} />
        )}

        {sections.map((section: any, index: number) => {
          const config = sectionRegistry?.[section.type];
          if (!config) return null;

          if (
            config.category === "navigation" ||
            config.category === "footer" ||
            config.category === "layout"
          )
            return null;

          // AFTER
const Component = config.component;

const SELF_EDITING_TYPES = ["contact", "form"];
const isSelfEditing = SELF_EDITING_TYPES.includes(section.type);

const Wrapped = (editing && !isSelfEditing) ? withEditor(Component) : Component;

          return (
            <React.Fragment key={section.id}>
              {editing ? (
                <SectionWrapper
                  index={index}
                  total={sections.length}
                  sectionType={section.type}
                  onDuplicate={() => duplicateSection(section.id, page.slug)}
                  onDelete={() => deleteSection(index)}
                  onMoveUp={() => move(index, index - 1)}
                  onMoveDown={() => move(index, index + 1)}
                  onReset={() => resetSection(section.id)}
                >
  
<Wrapped
  content={section.content}
  sectionId={section.id}
  editing={editing}
  updateContent={
    isSelfEditing
      ? (newContent: any) =>
          sync(
            sections.map((s: any) =>
              s.id === section.id ? { ...s, content: newContent } : s
            )
          )
      : undefined
  }
/>
                </SectionWrapper>
              ) : (
                <Wrapped content={section.content} sectionId={section.id} />
              )}

              {editing && <AddStrip onAdd={() => onInsertAt?.(index + 1)} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* ══ FOOTER ══
          When editing:  LayoutWrap (orange border + Replace/Reset buttons)
                         wraps withFooterEditor(FooterComponent)
                         which injects ↑ ↓ + × on every data-block inside
          When not editing: plain FooterComponent
      ══════════════════════════════════════════════════════════════════ */}
     {FooterComponent && (
  editing ? (
    EditableFooter ? (
      <LayoutWrap
        slot="Footer"
        type={footerType}
        onReplace={() => onReplaceLayout?.("footer")}
        onReset={resetFooterContent}
      >
        <EditableFooter
          content={footerContent}
          website={website}
          editing={editing}
          updateWebsite={updateWebsite}
        />
      </LayoutWrap>
    ) : null
  ) : (
    <FooterComponent
      content={footerContent}
      website={website}
      editing={false}
    />
  )
)}
    </div>
  );
};