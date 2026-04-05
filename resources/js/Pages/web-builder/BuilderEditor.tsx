import { usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { PageRenderer } from "@/web-builder/renderer/PageRenderer";
import "@/templates/templateStyles.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { uploadPendingMedia } from "@/web-builder/utils/uploadPendingMedia";
import { cleanSiteForStorage } from "@/web-builder/utils/cleanSiteForStorage";
import { Spinner } from "@/Components/Spinner";
import { injectTemplateCss } from "@/web-builder/utils/injectTemplateCss";
import axios from "axios";
import {
    FiSave,
    FiRotateCcw,
    FiRepeat,
} from "react-icons/fi";

import { sectionRegistry } from "@/web-builder/sections/sectionRegistry";
import PreviewSidebar from "@/web-builder/sections/PreviewSections";
import CompactDesignPanel from "@/web-builder/design/DesignPanel";

const TRIAL_KEY = "trial_builder_data";
const EXPIRY_KEY = "trial_builder_expiry";
const EXPIRY_TIME = 30 * 60 * 1000;

export default function BuilderEditor() {
    const { website, websiteId, templateId, slug, trial } = usePage()
        .props as any;

    // ===== CSRF =====
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    if (token) axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
    axios.defaults.headers.common["X-Inertia"] = "true";


    useEffect(() => {
        if (website?.css) {
          injectTemplateCss(website.css);
        }
      }, [website]);

    // ===== LOAD TRIAL =====
    const loadTrialData = () => {
        const expiry = localStorage.getItem(EXPIRY_KEY);
        if (expiry && Date.now() > Number(expiry)) {
            localStorage.removeItem(TRIAL_KEY);
            localStorage.removeItem(EXPIRY_KEY);
            return website;
        }
        const stored = localStorage.getItem(TRIAL_KEY);
        if (stored) return { ...website, ...JSON.parse(stored) };
        return website;
    };
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [site, setSite] = useState(() => (trial ? loadTrialData() : website));

    const prevSite = useRef(site);
    const undoStack = useRef<any[]>([]);
    const redoStack = useRef<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [editing, setEditing] = useState(false);
    const [activePanel, setActivePanel] = useState<"design" | "none">("none");

    // ===== PAGE =====
    const siteData = site.data || site;
    const cssClass = siteData.cssClass || "";
    const page =
        (siteData.pages || []).find((p: any) => p.slug === slug) ||
        siteData.pages[0];

    // ===== UPDATE SITE =====
    const updateSite = (newSite: any) => {
        undoStack.current.push(prevSite.current);
        redoStack.current = [];
        prevSite.current = newSite;
        setSite(newSite);
    };

    // ===== ADD SECTION =====
    const addSection = (type: string) => {
        const config = sectionRegistry[type];

        const newSection = {
            id: Date.now().toString(),
            type,
            content: config?.defaultContent || {},
        };

        const updated = {
            ...site,
            data: {
                ...siteData,
                pages: siteData.pages.map((p: any) =>
                    p.slug === slug
                        ? {
                              ...p,
                              sections: [...(p.sections || []), newSection],
                          }
                        : p
                ),
            },
        };

        updateSite(updated);
    };

    // ===== UNDO / REDO =====
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

    // ===== SAVE =====
    const saveSite = async () => {
        try {
            setLoading(true);

            const cleaned = trial
                ? cleanSiteForStorage(site)
                : await uploadPendingMedia(site);

            if (trial) {
                localStorage.setItem(TRIAL_KEY, JSON.stringify(cleaned));
                localStorage.setItem(
                    EXPIRY_KEY,
                    (Date.now() + EXPIRY_TIME).toString()
                );
                alert("Saved (trial)");
            } else {
                await router.post(`/builder/${websiteId}/save`, {
                    data: cleaned,
                });
                alert("Saved!");
            }
        } finally {
            setLoading(false);
        }
    };

    // ===== BUY =====
    const buyTemplate = async () => {
        setLoading(true);
        await router.post(`/templates/${templateId}/purchase`, {
            data: site,
        });
        localStorage.removeItem(TRIAL_KEY);
        localStorage.removeItem(EXPIRY_KEY);
        setLoading(false);
    };

    const groupedSections = Object.values(sectionRegistry).reduce(
        (acc: any, sec: any) => {
            if (!acc[sec.category]) acc[sec.category] = [];
            acc[sec.category].push(sec);
            return acc;
        },
        {}
    );

    console.log("SITE DATA:", site);
    console.log("CURRENT SLUG:", slug);
    console.log("PAGES:", siteData.pages);

    return (
        <AuthenticatedLayout>
            <div className="flex h-screen">
                {/* LEFT SIDEBAR */}
                {editing && (
                    <PreviewSidebar
                        addSection={addSection}
                        active={sidebarOpen}
                        toggle={() => setSidebarOpen(!sidebarOpen)}
                    />
                )}

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col ">
                    {/* COMPACT TOP TOOLBAR */}
                    <div className="flex items-center justify-between p-2 bg-orange-400 border-b border-gray-300 gap-2">
                        {/* Site name */}
                        <input
                            value={site.name}
                            onChange={(e) =>
                                setSite({ ...site, name: e.target.value })
                            }
                            className="border px-2 py-1 rounded text-sm w-48" // fixed width
                        />

                        {/* RIGHT DESIGN PANEL */}

                        <CompactDesignPanel site={site} setSite={updateSite} />

                        {/* Tools dropdowns */}
                        <div className="flex items-center gap-1">
                            {/* Edit/Preview toggle */}
                            <button
                                className="btn text-sm px-2 py-1"
                                onClick={() => setEditing(!editing)}
                            >
                                {editing ? "Preview" : "Edit"}
                            </button>

                            {/* Undo/Redo */}
                            <button
                                className="btn text-sm px-2 py-1"
                                onClick={undo}
                            >
                                <FiRotateCcw />
                            </button>
                            <button
                                className="btn text-sm px-2 py-1"
                                onClick={redo}
                            >
                                <FiRepeat />
                            </button>

                            {/* Save */}
                            <button
                                className="btn text-sm px-2 py-1"
                                onClick={saveSite}
                            >
                                <FiSave />
                            </button>

                            {/* Buy if trial */}
                            {trial && (
                                <button
                                    onClick={buyTemplate}
                                    className="btn text-sm px-2 py-1 bg-green-500 text-white"
                                >
                                    Buy
                                </button>
                            )}
                        </div>
                    </div>

                    {/* CANVAS */}
                    <div className="flex-1 bg-gray-50 p-2 overflow-auto">
                        
                        <PageRenderer
                            website={siteData}
                            page={page}
                            editing={editing}
                            updateWebsite={updateSite}
                        />
                    </div>
                </div>
            </div>

            {/* LOADING SPINNER */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <Spinner text="Processing..." color="#fff" vertical />
                </div>
            )}
        </AuthenticatedLayout>
    );
}
