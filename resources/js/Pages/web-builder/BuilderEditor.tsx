import { usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { PageRenderer } from "@/web-builder/core/renderer/PageRenderer";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { uploadPendingMedia } from "@/web-builder/core/utils/uploadPendingMedia";
import { cleanSiteForStorage } from "@/web-builder/core/utils/cleanSiteForStorage";
import { Spinner } from "@/Components/Spinner";
import { injectTemplateCss } from "@/web-builder/core/utils/injectTemplateCss";
import axios from "axios";
import {
    FiSave, FiRotateCcw, FiRepeat, FiEye, FiEdit2,
    FiLayers, FiSliders, FiX, FiSearch, FiPlus,
    FiRefreshCcw,
} from "react-icons/fi";
import {
    sectionRegistry,
    getDefaultNavbarType,
    getDefaultFooterType,
} from "@/web-builder/core/registry/sectionRegistry";
import SidebarRight from "@/web-builder/editor-ui/SidebarRight";
import EditorContext from "@/web-builder/core/editor/EditorContext";
import "@/web-builder/builder.css";
import { generateCss } from "@/web-builder/core/utils/generateCss";

/* ── CONSTANTS ── */
const TRIAL_KEY   = "trial_builder_data";
const EXPIRY_KEY  = "trial_builder_expiry";
const EXPIRY_TIME = 5 * 60 * 1000;

/* ── CATEGORY MAP (for Section Library UI only) ── */
const CATEGORY_MAP: Record<string, string> = {
    hero: "Hero", navbar: "Navigation", nav: "Navigation", header: "Navigation",
    feature: "Features", features: "Features", pricing: "Pricing",
    testimonial: "Testimonials", testimonials: "Testimonials",
    cta: "CTA", contact: "Contact", footer: "Footer",
    gallery: "Gallery", team: "Team", blog: "Blog",
    faq: "FAQ", stats: "Stats", content: "Content", text: "Content", about: "Content",
};

const CATEGORY_ICONS: Record<string, string> = {
    All: "⊞", Hero: "✦", Navigation: "☰", Features: "◈", Pricing: "◇",
    Testimonials: "❝", CTA: "⚡", Contact: "✉", Footer: "▤",
    Gallery: "▦", Team: "◉", Blog: "✎", FAQ: "?", Stats: "▲", Content: "¶",
};

const getCategory = (type: string): string => {
    const lower = type.toLowerCase();
    for (const key of Object.keys(CATEGORY_MAP)) {
        if (lower.includes(key)) return CATEGORY_MAP[key];
    }
    return "Content";
};

/* ── HELPERS ── */
const normalizePages = (data: any) => {
    const raw = data?.pages ? data : data?.data?.pages ? data.data : data;
    return {
        layout: raw?.layout || {},
        pages: Array.isArray(raw?.pages) ? raw.pages : [],
    };
};

const normalizeCssVars = (vars: any) =>
    vars && !Array.isArray(vars) ? vars : {};

/*
  ensureLayout — MUST be called AFTER the module finishes loading,
  NOT inside useState() initializer.
  Called in a useEffect on mount instead.
*/
const ensureLayout = (data: any): any => {
    const layout = data?.layout || {};
    const navbarType = layout.navbar?.type || getDefaultNavbarType() || "";
    const footerType = layout.footer?.type || getDefaultFooterType() || "";

    const needsNavbar = !layout.navbar && navbarType;
    const needsFooter = !layout.footer && footerType;

    if (!needsNavbar && !needsFooter) return data; // nothing to patch

    return {
        ...data,
        layout: {
            ...layout,
            ...(needsNavbar && {
                navbar: {
                    type: navbarType,
                    content: sectionRegistry[navbarType]?.defaultContent ?? {},
                },
            }),
            ...(needsFooter && {
                footer: {
                    type: footerType,
                    content: sectionRegistry[footerType]?.defaultContent ?? {},
                },
            }),
        },
    };
};

/* ── ICON BUTTON ── */
function IconButton({
    onClick, icon, label, disabled = false, active = false, variant = "default",
}: {
    onClick: () => void; icon: React.ReactNode; label: string;
    disabled?: boolean; active?: boolean; variant?: "default" | "primary";
}) {
    const base = "flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed outline-none focus:outline-none cursor-pointer";
    const cls = variant === "primary"
        ? `${base} bg-indigo-500 hover:bg-indigo-400 text-white shadow-sm`
        : active
        ? `${base} bg-white/[0.13] text-white ring-1 ring-white/20`
        : `${base} text-white/55 hover:text-white hover:bg-white/[0.08]`;

    return (
        <div className="relative group">
            <button onClick={onClick} disabled={disabled} className={cls}>{icon}</button>
            <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap bg-[#0c0e1a] text-white/75 border border-white/[0.07] shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-100 z-[200]">
                {label}
                <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0c0e1a] border-l border-t border-white/[0.07] rotate-45" />
            </div>
        </div>
    );
}

function Divider() {
    return <div className="w-px h-4 bg-white/[0.07] mx-0.5" />;
}

/* ── SECTION LIBRARY MODAL ── */
function SectionLibraryModal({
    open, onClose, onAdd, mode = "section",
}: {
    open: boolean;
    onClose: () => void;
    onAdd: (type: string) => void;
    mode?: "section" | "navbar" | "footer";
}) {
    const isLayout = mode === "navbar" || mode === "footer";

    const allTypes = Object.keys(sectionRegistry).filter((type) => {
        const cat = sectionRegistry[type].category;
        if (mode === "navbar") return cat === "navigation";
        if (mode === "footer") return cat === "footer";
        return cat !== "navigation" && cat !== "footer" && cat !== "layout";
    });

    const defaultTab = mode === "navbar" ? "Navigation" : mode === "footer" ? "Footer" : "All";
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [search, setSearch]       = useState("");

    useEffect(() => {
        setActiveTab(mode === "navbar" ? "Navigation" : mode === "footer" ? "Footer" : "All");
        setSearch("");
    }, [mode, open]);

    const categories = isLayout
        ? [defaultTab]
        : ["All", ...Array.from(new Set(allTypes.map(getCategory))).sort()];

    const filtered = allTypes.filter((type) => {
        const matchesTab = activeTab === "All" || getCategory(type) === activeTab;
        const matchesSearch = !search || type.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    if (!open) return null;

    const title    = mode === "navbar" ? "Replace Navbar" : mode === "footer" ? "Replace Footer" : "Section Library";
    const subtitle = isLayout ? `${allTypes.length} ${mode} variants` : `${allTypes.length} sections · click to add`;

    return (
        <>
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
            <div
                className="fixed left-0 top-0 bottom-0 z-[110] flex flex-col"
                style={{
                    width: 340,
                    background: "linear-gradient(180deg,#161929 0%,#11131e 100%)",
                    borderRight: "1px solid rgba(255,255,255,0.055)",
                    boxShadow: "10px 0 40px rgba(0,0,0,0.55)",
                    animation: "slideInLeft 0.22s cubic-bezier(.4,0,.2,1)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.055] shrink-0">
                    <div>
                        <p className="text-white font-semibold text-[13px] tracking-wide">{title}</p>
                        <p className="text-white/35 text-[11px] mt-0.5">{subtitle}</p>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-white/35 hover:text-white hover:bg-white/[0.07] transition-colors cursor-pointer">
                        <FiX size={13} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-3 py-2.5 shrink-0">
                    <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.07] rounded-lg px-3 py-1.5 focus-within:border-indigo-500/40 transition-colors">
                        <FiSearch size={11} className="text-white/25 shrink-0" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Search ${isLayout ? mode : "sections"}…`}
                            className="bg-transparent text-white/65 text-[12px] flex-1 outline-none placeholder:text-white/20"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="text-white/25 hover:text-white/50 cursor-pointer">
                                <FiX size={10} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category tabs — hidden in layout-replace mode */}
                {!isLayout && (
                    <div className="px-3 pb-2.5 shrink-0">
                        <div className="flex gap-1 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md cursor-pointer text-[11px] font-medium whitespace-nowrap shrink-0 border transition-all duration-150 ${
                                        activeTab === cat
                                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
                                            : "text-white/35 hover:text-white/60 hover:bg-white/[0.05] border-transparent"
                                    }`}
                                >
                                    <span className="text-[10px] leading-none">{CATEGORY_ICONS[cat] || "◆"}</span>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Grid */}
                <div className="flex-1 overflow-y-auto px-3 pb-4">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2 text-white/20">
                            <span className="text-2xl">◈</span>
                            <p className="text-[11px]">No sections found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {filtered.map((type) => {
                                const config   = sectionRegistry[type];
                                const label    = config?.label || type.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                                const category = getCategory(type);
                                return (
                                    <button
                                        key={type}
                                        onClick={() => { onAdd(type); onClose(); }}
                                        className="group relative flex flex-col items-start gap-2 p-2.5 bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.055] hover:border-indigo-500/35 rounded-xl text-left cursor-pointer transition-all duration-150"
                                    >
                                        <div
                                            className="w-full rounded-lg flex items-center justify-center"
                                            style={{
                                                height: 52,
                                                background: "linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.04))",
                                                border: "1px solid rgba(255,255,255,0.04)",
                                            }}
                                        >
                                            <div className="w-full h-[52px] rounded-md overflow-hidden border border-white/10">
    <img
        src={config.preview}
        alt={label}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.src = "/web-builder/sections/fallback.png";
        }}
    />
</div>
                                        </div>
                                        <div className="w-full px-0.5">
                                            <p className="text-white/75 text-[11px] font-medium leading-tight truncate group-hover:text-white transition-colors">{label}</p>
                                            <p className="text-white/25 text-[10px] mt-0.5">{category}</p>
                                        </div>
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-150 shadow-md">
                                            <FiPlus size={9} className="text-white" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes slideInLeft {
                    from { transform: translateX(-20px); opacity: 0; }
                    to   { transform: translateX(0);     opacity: 1; }
                }
            `}</style>
        </>
    );
}

/* ── SETTINGS MODAL ── */
function SettingsModal({
    open, onClose, site, setSite,
}: {
    open: boolean; onClose: () => void; site: any; setSite: (s: any) => void;
}) {
    if (!open) return null;
    return (
        <>
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
            <div
                className="fixed right-0 top-0 bottom-0 z-[110] flex flex-col"
                style={{
                    width: 320,
                    background: "linear-gradient(180deg,#161929 0%,#11131e 100%)",
                    borderLeft: "1px solid rgba(255,255,255,0.055)",
                    boxShadow: "-10px 0 40px rgba(0,0,0,0.55)",
                    animation: "slideInRight 0.22s cubic-bezier(.4,0,.2,1)",
                }}
            >
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.055] shrink-0">
                    <div>
                        <p className="text-white font-semibold text-[13px] tracking-wide">Site Settings</p>
                        <p className="text-white/35 text-[11px] mt-0.5">Styles, colors & layout</p>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-white/35 hover:text-white hover:bg-white/[0.07] transition-colors cursor-pointer">
                        <FiX size={13} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <SidebarRight site={site} setSite={setSite} active={true} toggle={onClose} />
                </div>
            </div>
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(20px); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
            `}</style>
        </>
    );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function BuilderEditor() {
    const { website, websiteId, templateId, slug, trial, auth } =
        usePage().props as any;
        
console.log("templateid",templateId)
console.log("websiteid",websiteId)

    const isAdmin = auth?.user?.is_admin === 1;

    const [editing,       setEditing]       = useState(false);
    const [loading,       setLoading]       = useState(false);
    const [sectionLibOpen, setSectionLibOpen] = useState(false);
    const [settingsOpen,  setSettingsOpen]  = useState(false);
    const [libraryMode,   setLibraryMode]   = useState<"section" | "navbar" | "footer">("section");
    const [insertIndex,   setInsertIndex]   = useState<number>(-1);

    const isBuilder = window.location.pathname.startsWith("/builder");
    const isTemplate = window.location.pathname.startsWith("/template");


    /* AXIOS */
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    if (token) axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
    axios.defaults.headers.common["X-Inertia"] = "true";

    /* ─────────────────────────────────────────
       INIT SITE
       normalizePages only — do NOT call
       ensureLayout here because the registry
       may not be fully populated yet in SSR /
       first-pass rendering.
    ───────────────────────────────────────── */
    const [site, setSite] = useState(() => {
        const normalizedData = normalizePages(website?.data);
        let base = {
            name:    website?.name || "",
            data:    normalizedData,
            css:     website?.css  || "",
            cssVars: normalizeCssVars(website?.cssVars),
        };
        if (trial) {
            const stored = localStorage.getItem(TRIAL_KEY);
            if (stored) {
                const parsed      = JSON.parse(stored);
                const trialData   = normalizePages(parsed?.data);
                base = { ...base, ...parsed, data: trialData, css: parsed?.css ?? base.css, cssVars: normalizeCssVars(parsed?.cssVars) };
            }
        }
        return base;
    });

    const prevSite   = useRef(site);
    const undoStack  = useRef<any[]>([]);
    const redoStack  = useRef<any[]>([]);

    const pages    = site?.data?.pages || [];
    const params = new URLSearchParams(window.location.search);
const currentSlug = params.get("page") || slug || "home";

const page =
  pages.find((p: any) => p.slug === currentSlug) ||
  pages[0] ||
  null;
    const safePage = page || { sections: [] };

    /* ─────────────────────────────────────────
       PATCH LAYOUT AFTER MOUNT
       By this point the registry module has
       fully executed and sectionRegistry is
       populated, so getDefaultNavbarType()
       returns the correct value.
    ───────────────────────────────────────── */
    useEffect(() => {
        const patched = ensureLayout(site.data);
        if (patched === site.data) return; // nothing changed
        // silent patch — don't push to undo stack
        const next = { ...site, data: patched };
        prevSite.current = next;
        setSite(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount

    /* TRIAL EXPIRY */
    useEffect(() => {
        const expiry = localStorage.getItem(EXPIRY_KEY);
        if (expiry && Date.now() > Number(expiry)) {
            localStorage.removeItem(TRIAL_KEY);
            localStorage.removeItem(EXPIRY_KEY);
        }
    }, []);

    /* CSS */
    useEffect(() => {
        if (site?.css) injectTemplateCss(site.css);
    }, [site.css]);

    useEffect(() => {
        const root = document.getElementById("template-root");
        if (!root) return;
        const css = generateCss(normalizeCssVars(site.cssVars));
        let styleTag = document.getElementById("dynamic-css");
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "dynamic-css";
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = css;
    }, [site.cssVars]);

    /* UPDATE */
    const updateSite = useCallback((newSite: any) => {
        const final = typeof newSite === "function" ? newSite(prevSite.current) : newSite;
        undoStack.current.push(prevSite.current);
        redoStack.current = [];
        prevSite.current  = final;
        setSite(final);
    }, []);

    /* UNDO / REDO */
    const undo = () => {
        if (!undoStack.current.length) return;
        const prev = undoStack.current.pop();
        redoStack.current.push(site);
        setSite(prev);
        prevSite.current = prev;
    };

    const redo = () => {
        if (!redoStack.current.length) return;
        const next = redoStack.current.pop();
        undoStack.current.push(site);
        setSite(next);
        prevSite.current = next;
    };

    const generateId = () =>
        `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    /* ─────────────────────────────────────────
       HANDLE ADD FROM LIBRARY
    ───────────────────────────────────────── */
    const handleAddFromLibrary = (type: string) => {
        const config = sectionRegistry[type];
        const cat    = config?.category;

        if (cat === "navigation") {
            updateSite((prev: any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    layout: {
                        ...prev.data.layout,
                        navbar: { type, content: structuredClone(config?.defaultContent ?? {}) },
                    },
                },
            }));
        } else if (cat === "footer") {
            updateSite((prev: any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    layout: {
                        ...prev.data.layout,
                        footer: { type, content: structuredClone(config?.defaultContent ?? {}) },
                    },
                },
            }));
        } else {
            const newSection = {
                id:      generateId(),
                type,
                content: structuredClone(config?.defaultContent ?? {}),
            };
            updateSite((prev: any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    pages: (prev.data.pages || []).map((p: any) => {
                        if (p.slug !== slug) return p;
                        const sections = [...(p.sections || [])];
                        if (insertIndex < 0 || insertIndex >= sections.length) {
                            sections.push(newSection);
                        } else {
                            sections.splice(insertIndex, 0, newSection);
                        }
                        return { ...p, sections };
                    }),
                },
            }));
        }

        setSectionLibOpen(false);
        setInsertIndex(-1);
        setLibraryMode("section");
    };

    /* DUPLICATE */
    const duplicateSection = useCallback(
        (sectionId: string, pageSlug: string) => {
            updateSite((prev: any) => {
                const updatedPages = prev.data.pages.map((p: any) => {
                    if (p.slug !== pageSlug) return p;
                    const sections = [...(p.sections || [])];
                    const index    = sections.findIndex((s: any) => s.id === sectionId);
                    if (index === -1) return p;
                    const cloned   = { ...structuredClone(sections[index]), id: generateId() };
                    sections.splice(index + 1, 0, cloned);
                    return { ...p, sections };
                });
                return { ...prev, data: { ...prev.data, pages: updatedPages } };
            });
        },
        [updateSite]
    );


    const resetToTemplate = async () => {
        if (!confirm("Reset to template defaults?")) return;
    
        try {
            setLoading(true);
    
            if (isBuilder) {
                // WEBSITE RESET
                const res = await axios.post(`/builder/${websiteId}/reset`, {}, {
                    headers: {
                      "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                    },
                  });
    
                const fresh = res.data.website;
    
                setSite({
                    name: fresh.name,
                    data: ensureLayout(normalizePages(fresh.data)),
                    css: fresh.css,
                    cssVars: normalizeCssVars(fresh.cssVars),
                });
    
            } else if (isTemplate) {
             
                // TEMPLATE TRIAL RESET
                const res = await axios.get(`/api/templates/${templateId}`);
                const template = res.data;
                console.log(template)
                setSite({
                    name: template.name,
                    data: ensureLayout(normalizePages(template.data)),
                    css: template.css,
                    cssVars: normalizeCssVars(template.cssVars),
                });
            }
    
            undoStack.current = [];
            redoStack.current = [];
    
        } catch (err) {
            console.error(err);
            alert("Reset failed");
        } finally {
            setLoading(false);
        }
    };

    /* SAVE */
    const saveSite = async () => {
        try {
            setLoading(true);
            const cleaned = trial ? cleanSiteForStorage(site) : await uploadPendingMedia(site);

            if (trial && !isAdmin) {
                localStorage.setItem(TRIAL_KEY, JSON.stringify(cleaned));
                localStorage.setItem(EXPIRY_KEY, (Date.now() + EXPIRY_TIME).toString());
                alert("Saved (trial)");
                return;
            }

            const saveUrl = isAdmin ? `/builder/${templateId}/save` : `/builder/${websiteId}/save`;
            await router.post(saveUrl, {
                type:    isAdmin ? "template" : "website",
                data:    cleaned,
                css:     site.css,
                cssVars: normalizeCssVars(site.cssVars),
            });
            alert(isAdmin ? "Template saved!" : "Website saved!");
        } finally {
            setLoading(false);
        }
    };

    /* ── LIBRARY OPENERS ── */
    const openSectionLibrary = () => {
        setLibraryMode("section");
        setInsertIndex(-1);
        setSettingsOpen(false);
        setSectionLibOpen(true);
    };

    const openReplaceLayout = (slot: "navbar" | "footer") => {
        setLibraryMode(slot);
        setInsertIndex(-1);
        setSettingsOpen(false);
        setSectionLibOpen(true);
    };

    /* ════════════════════════════════════════
       RENDER
    ════════════════════════════════════════ */
    return (
        <AuthenticatedLayout>
            <div className="flex flex-col h-screen">

                {/* ── TOP BAR ── */}
                <header
                    style={{ background: "#1a1d2b", borderBottom: "1px solid rgba(255,255,255,0.055)", height: 44 }}
                    className="flex items-center justify-between px-3 gap-3 shrink-0"
                >
                    {/* Left */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span
                            className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                            style={{ background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)" }}
                        >
                            B
                        </span>
                        <div className="w-px h-4 bg-white/[0.07] shrink-0" />
                        <input
                            value={site.name}
                            onChange={(e) => setSite({ ...site, name: e.target.value })}
                            className="bg-transparent text-white/70 text-[13px] font-medium border-b border-transparent hover:border-white/15 focus:border-indigo-400/50 focus:outline-none py-0.5 px-0 min-w-0 max-w-[150px] transition-colors duration-150 placeholder:text-white/20"
                            placeholder="Untitled"
                        />
                    </div>

                    {/* Center */}
                    <div className="flex items-center gap-0.5">
                        <IconButton onClick={openSectionLibrary} icon={<FiLayers size={14} />} label="Section Library" active={sectionLibOpen && libraryMode === "section"} />
                        <Divider />
                        <IconButton onClick={undo} icon={<FiRotateCcw size={13} />} label="Undo" disabled={undoStack.current.length === 0} />
                        <IconButton onClick={redo} icon={<FiRepeat size={13} />}    label="Redo" disabled={redoStack.current.length === 0} />
                        <Divider />
                        <IconButton
                            onClick={() => setEditing(!editing)}
                            icon={editing ? <FiEye size={14} /> : <FiEdit2 size={14} />}
                            label={editing ? "Preview Mode" : "Edit Mode"}
                            active={editing}
                        />
                        <Divider />
                        <IconButton
                            onClick={() => { setSettingsOpen(!settingsOpen); setSectionLibOpen(false); }}
                            icon={<FiSliders size={14} />}
                            label="Site Settings"
                            active={settingsOpen}
                        />
                        <Divider />
                        <IconButton
    onClick={resetToTemplate}
    icon={<FiRefreshCcw size={13} />}
    label="Reset to Template"
    variant="default"
/>
                        <IconButton onClick={saveSite} icon={<FiSave size={14} />} label="Save" variant="primary" disabled={loading} />
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                        <span className={`text-[10px] font-semibold tracking-[0.07em] uppercase px-2 py-0.5 rounded-md border transition-all duration-200 ${editing ? "bg-indigo-500/15 text-indigo-300 border-indigo-400/25" : "bg-white/[0.04] text-white/25 border-white/[0.06]"}`}>
                            {editing ? "Editing" : "Preview"}
                        </span>
                        {trial   && <span className="text-[10px] font-semibold tracking-[0.07em] uppercase px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20">Trial</span>}
                        {isAdmin && <span className="text-[10px] font-semibold tracking-[0.07em] uppercase px-2 py-0.5 rounded-md bg-rose-400/10 text-rose-300 border border-rose-400/20">Admin</span>}
                    </div>
                </header>

                {/* ── CANVAS ── */}
                <div id="template-root" className="template-root flex-1 overflow-auto">
                    <EditorContext.Provider
                        value={{
                            editing,
                            updateSection: (id: string | number, newContent: any) => {
                                const updatedPages = (site.data.pages || []).map((p: any) =>
                                    p.slug !== slug ? p : {
                                        ...p,
                                        sections: (p.sections || []).map((s: any) =>
                                            s.id === id
                                                ? { ...s, content: typeof newContent === "function" ? newContent(s.content) : newContent }
                                                : s
                                        ),
                                    }
                                );
                                updateSite({ ...site, data: { ...site.data, pages: updatedPages } });
                            },
                            site,
                            setSite: updateSite,
                        }}
                    >
                        <PageRenderer
                            website={site}
                            page={safePage}
                            editing={editing}
                            updateWebsite={updateSite}
                            duplicateSection={duplicateSection}
                            onInsertAt={(index: number) => {
                                setInsertIndex(index);
                                setLibraryMode("section");
                                setSectionLibOpen(true);
                            }}
                            onReplaceLayout={openReplaceLayout}
                        />
                    </EditorContext.Provider>
                </div>
            </div>

            {/* ── MODALS ── */}
            <SectionLibraryModal
                open={sectionLibOpen}
                onClose={() => { setSectionLibOpen(false); setInsertIndex(-1); setLibraryMode("section"); }}
                onAdd={handleAddFromLibrary}
                mode={libraryMode}
            />

            <SettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                site={site}
                setSite={updateSite}
            />

            {loading && (
                <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-white/[0.07] shadow-2xl" style={{ background: "#1a1d2b" }}>
                        <Spinner text="Saving…" color="#818cf8" vertical />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}