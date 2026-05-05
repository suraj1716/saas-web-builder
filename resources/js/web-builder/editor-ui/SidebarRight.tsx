import { useState, useRef } from "react";
import { themePresets } from "../core/theme/themePresets";
import {
    FiDroplet,
    FiType,
    FiMaximize,
    FiSliders,
    FiCode,
    FiCheck,
    FiCopy,
    FiLayout,
} from "react-icons/fi";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type TabId = "colors" | "typography" | "spacing" | "ui" | "css";

type Props = {
    site: any;
    setSite: (site: any) => void;
    active: boolean;
    toggle: () => void;
};

/* ─────────────────────────────────────────
   THEME PRESET SWATCHES
───────────────────────────────────────── */
const PRESET_META: Record<string, { label: string; swatches: string[]; desc: string }> = {
    light: {
        label: "Light",
        swatches: ["#4f46e5", "#ffffff", "#111827"],
        desc: "Clean & minimal",
    },
    dark: {
        label: "Dark",
        swatches: ["#6366f1", "#0f172a", "#f8fafc"],
        desc: "Night mode",
    },
    business: {
        label: "Business",
        swatches: ["#0ea5e9", "#f0f9ff", "#0c4a6e"],
        desc: "Professional",
    },
};

/* ─────────────────────────────────────────
   TABS CONFIG
───────────────────────────────────────── */
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "colors",     label: "Colors",  icon: <FiDroplet size={12} /> },
    { id: "typography", label: "Type",    icon: <FiType size={12} /> },
    { id: "spacing",    label: "Space",   icon: <FiMaximize size={12} /> },
    { id: "ui",         label: "UI",      icon: <FiSliders size={12} /> },
    { id: "css",        label: "CSS",     icon: <FiCode size={12} /> },
];

/* ─────────────────────────────────────────
   FONT OPTIONS
───────────────────────────────────────── */
const FONT_OPTIONS = [
    { label: "Inter",            value: '"Inter", sans-serif' },
    { label: "DM Sans",          value: '"DM Sans", sans-serif' },
    { label: "DM Serif Display", value: '"DM Serif Display", serif' },
    { label: "Playfair Display", value: '"Playfair Display", serif' },
    { label: "Geist",            value: '"Geist", sans-serif' },
    { label: "Manrope",          value: '"Manrope", sans-serif' },
    { label: "Sora",             value: '"Sora", sans-serif' },
    { label: "Space Grotesk",    value: '"Space Grotesk", sans-serif' },
    { label: "Lora",             value: '"Lora", serif' },
    { label: "Georgia",          value: "Georgia, serif" },
];

/* ─────────────────────────────────────────
   SHARED SUB-COMPONENTS
───────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-white/25 mb-2 mt-1">
            {children}
        </p>
    );
}

function Divider() {
    return <div className="my-3 border-t border-white/[0.05]" />;
}

/* ─────────────────────────────────────────
   COLOR ROW
───────────────────────────────────────── */
function ColorRow({
    label,
    varName,
    defaultColor,
    site,
    updateVar,
}: {
    label: string;
    varName: string;
    defaultColor: string;
    site: any;
    updateVar: (k: string, v: string) => void;
}) {
    const value = site.cssVars?.[varName] || defaultColor;
    const [copied, setCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const copy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
    };

    return (
        <div className="flex items-center gap-2.5 py-1.5 group">
            {/* Swatch */}
            <div className="relative shrink-0">
                <div
                    className="w-7 h-7 rounded-md border border-white/[0.12] shadow-sm cursor-pointer"
                    style={{ background: value }}
                    onClick={() => inputRef.current?.click()}
                />
                <input
                    ref={inputRef}
                    type="color"
                    value={value}
                    onChange={(e) => updateVar(varName, e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    tabIndex={-1}
                />
            </div>

            {/* Label */}
            <span className="text-[11px] text-white/50 flex-1 leading-none">{label}</span>

            {/* Hex input */}
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-md px-2 py-1 focus-within:border-indigo-400/40 transition-colors">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => updateVar(varName, e.target.value)}
                    className="bg-transparent text-white/65 text-[11px] font-mono w-[72px] outline-none"
                    spellCheck={false}
                />
            </div>

            {/* Copy */}
            <button
                onClick={copy}
                className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-white/50 opacity-0 group-hover:opacity-100 transition-all"
            >
                {copied ? <FiCheck size={11} className="text-emerald-400" /> : <FiCopy size={11} />}
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────
   RANGE ROW
───────────────────────────────────────── */
function RangeRow({
    label,
    varName,
    min = 0,
    max = 100,
    step = 1,
    unit = "px",
    defaultValue = 16,
    site,
    updateVar,
}: {
    label: string;
    varName: string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    defaultValue?: number;
    site: any;
    updateVar: (k: string, v: string) => void;
}) {
    const raw = site.cssVars?.[varName];
    const numeric = raw ? parseFloat(raw) : defaultValue;
    const pct = Math.min(100, Math.max(0, ((numeric - min) / (max - min)) * 100));

    return (
        <div className="py-2">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-white/50">{label}</span>
                <span className="text-[11px] font-mono text-white/40 tabular-nums">
                    {numeric}
                    <span className="text-white/20">{unit}</span>
                </span>
            </div>
            <div className="relative h-4 flex items-center">
                <div className="absolute w-full h-[3px] rounded-full bg-white/[0.07]" />
                <div className="absolute h-[3px] rounded-full bg-indigo-500/60" style={{ width: `${pct}%` }} />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={numeric}
                    onChange={(e) => updateVar(varName, `${e.target.value}${unit}`)}
                    className="absolute w-full opacity-0 cursor-pointer h-4"
                    style={{ zIndex: 1 }}
                />
                <div
                    className="absolute w-3 h-3 rounded-full bg-white border-2 border-indigo-400 shadow-md pointer-events-none transition-transform"
                    style={{ left: `calc(${pct}% - 6px)` }}
                />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   FONT SELECT ROW
───────────────────────────────────────── */
function FontRow({
    label,
    varName,
    defaultFont,
    site,
    updateVar,
}: {
    label: string;
    varName: string;
    defaultFont: string;
    site: any;
    updateVar: (k: string, v: string) => void;
}) {
    const value = site.cssVars?.[varName] || defaultFont;

    return (
        <div className="py-1.5">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-white/50">{label}</span>
            </div>
            <select
                value={value}
                onChange={(e) => updateVar(varName, e.target.value)}
                className="
                    w-full bg-white/[0.04] border border-white/[0.07]
                    rounded-md px-2.5 py-1.5
                    text-[11px] text-white/65
                    outline-none cursor-pointer
                    focus:border-indigo-400/40
                    transition-colors appearance-none
                "
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    paddingRight: 28,
                }}
            >
                {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value} style={{ background: "#1e1e2e", color: "#fff" }}>
                        {f.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

/* ─────────────────────────────────────────
   SHADOW PREVIEW ROW
───────────────────────────────────────── */
function ShadowPreviewRow({
    label,
    varName,
    value,
    onClick,
}: {
    label: string;
    varName: string;
    value: string;
    onClick: () => void;
}) {
    return (
        <div className="flex items-center gap-2.5 py-1.5 group cursor-pointer" onClick={onClick}>
            <div
                className="w-8 h-8 rounded-md bg-white/[0.08] shrink-0"
                style={{ boxShadow: value }}
            />
            <span className="text-[11px] text-white/50 flex-1">{label}</span>
            <span className="text-[10px] font-mono text-white/20 truncate max-w-[120px]">{value}</span>
        </div>
    );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function SidebarRight({ site, setSite, active, toggle }: Props) {
    const [tab, setTab] = useState<TabId>("colors");

    const updateVar = (key: string, value: string) => {
        setSite({ ...site, cssVars: { ...(site.cssVars || {}), [key]: value } });
    };

    const applyPreset = (presetName: string) => {
        const preset = themePresets[presetName];
        setSite({ ...site, cssVars: { ...(site.cssVars || {}), ...preset } });
    };

    /* ── helpers ── */
    const v = (varName: string, fallback: string) =>
        site.cssVars?.[varName] || fallback;

    /* ── TAB CONTENT ── */
    const renderTab = () => {
        switch (tab) {

            /* ══════════════════════════════════════
               COLORS
            ══════════════════════════════════════ */
            case "colors":
                return (
                    <div>
                        <SectionLabel>Brand</SectionLabel>
                        <ColorRow label="Primary"   varName="--color-primary"   defaultColor="#4f46e5" site={site} updateVar={updateVar} />
                        <ColorRow label="Secondary" varName="--color-secondary" defaultColor="#06b6d4" site={site} updateVar={updateVar} />

                        <Divider />

                        <SectionLabel>Surfaces</SectionLabel>
                        <ColorRow label="Background" varName="--color-bg"      defaultColor="#ffffff" site={site} updateVar={updateVar} />
                        <ColorRow label="Surface"    varName="--color-surface"  defaultColor="#f9fafb" site={site} updateVar={updateVar} />

                        <Divider />

                        <SectionLabel>Text & Border</SectionLabel>
                        <ColorRow label="Text"       varName="--color-text"       defaultColor="#111827" site={site} updateVar={updateVar} />
                        <ColorRow label="Text Light" varName="--color-text-light" defaultColor="#6b7280" site={site} updateVar={updateVar} />
                        <ColorRow label="Muted"      varName="--color-muted"      defaultColor="#9ca3af" site={site} updateVar={updateVar} />
                        <ColorRow label="Border"     varName="--color-border"     defaultColor="#e5e7eb" site={site} updateVar={updateVar} />
                    </div>
                );

            /* ══════════════════════════════════════
               TYPOGRAPHY
            ══════════════════════════════════════ */
            case "typography":
                return (
                    <div>
                        <SectionLabel>Fonts</SectionLabel>
                        <FontRow label="Heading font" varName="--font-heading" defaultFont='"Inter", sans-serif' site={site} updateVar={updateVar} />
                        <FontRow label="Body font"    varName="--font-body"    defaultFont='"Inter", sans-serif' site={site} updateVar={updateVar} />

                        <Divider />

                        <SectionLabel>Heading sizes</SectionLabel>
                        <RangeRow label="H1 — Hero"    varName="--text-h1" min={24} max={96}  defaultValue={48} site={site} updateVar={updateVar} />
                        <RangeRow label="H2 — Section" varName="--text-h2" min={20} max={72}  defaultValue={36} site={site} updateVar={updateVar} />
                        <RangeRow label="H3 — Sub"     varName="--text-h3" min={16} max={48}  defaultValue={24} site={site} updateVar={updateVar} />

                        <Divider />

                        <SectionLabel>Body</SectionLabel>
                        <RangeRow label="Body text"   varName="--text-body"   min={12} max={22} defaultValue={16} site={site} updateVar={updateVar} />
                        <RangeRow label="Button text" varName="--text-button" min={11} max={20} defaultValue={14} site={site} updateVar={updateVar} />

                        <Divider />

                        <SectionLabel>Line height</SectionLabel>
                        <RangeRow
                            label="Line height"
                            varName="--line-height"
                            min={1}
                            max={2.5}
                            step={0.05}
                            unit=""
                            defaultValue={1.6}
                            site={site}
                            updateVar={updateVar}
                        />
                    </div>
                );

            /* ══════════════════════════════════════
               SPACING
            ══════════════════════════════════════ */
            case "spacing":
                return (
                    <div>
                        <SectionLabel>Layout</SectionLabel>
                        <RangeRow label="Section padding" varName="--section-padding" min={20}  max={200}  defaultValue={80}   site={site} updateVar={updateVar} />
                        <RangeRow label="Container width" varName="--container-width" min={600} max={1800} defaultValue={1200} unit="px" step={10} site={site} updateVar={updateVar} />
                        <RangeRow label="Grid gap"        varName="--gap"             min={0}   max={80}   defaultValue={24}   site={site} updateVar={updateVar} />

                        <Divider />

                        <SectionLabel>Spacing scale</SectionLabel>
                        <RangeRow label="Space SM" varName="--space-sm" min={4}  max={40}  defaultValue={12} site={site} updateVar={updateVar} />
                        <RangeRow label="Space MD" varName="--space-md" min={8}  max={60}  defaultValue={20} site={site} updateVar={updateVar} />
                        <RangeRow label="Space LG" varName="--space-lg" min={16} max={120} defaultValue={40} site={site} updateVar={updateVar} />

                        <Divider />

                        <SectionLabel>Hero</SectionLabel>
                        <RangeRow label="Hero height" varName="--hero-height" min={200} max={900} defaultValue={500} site={site} updateVar={updateVar} />
                    </div>
                );

            /* ══════════════════════════════════════
               UI
            ══════════════════════════════════════ */
            case "ui":
                return (
                    <div>
                        {/* ── Border radius ── */}
                        <SectionLabel>Border radius</SectionLabel>

                        {/* Visual preview */}
                        <div className="flex gap-2 mb-4 mt-1">
                            {[
                                { varName: "--radius-sm", label: "SM", def: 6  },
                                { varName: "--radius-md", label: "MD", def: 10 },
                                { varName: "--radius-lg", label: "LG", def: 16 },
                            ].map(({ varName, label, def }) => {
                                const r = parseInt(site.cssVars?.[varName] || def);
                                return (
                                    <div key={varName} className="flex-1 flex flex-col items-center gap-1.5">
                                        <div
                                            className="w-10 h-10 border-2 border-indigo-400/40 bg-indigo-500/10"
                                            style={{ borderRadius: r }}
                                        />
                                        <span className="text-[10px] text-white/30">{label} · {r}px</span>
                                    </div>
                                );
                            })}
                        </div>

                        <RangeRow label="Radius SM" varName="--radius-sm" min={0} max={24}  defaultValue={6}  site={site} updateVar={updateVar} />
                        <RangeRow label="Radius MD" varName="--radius-md" min={0} max={40}  defaultValue={10} site={site} updateVar={updateVar} />
                        <RangeRow label="Radius LG" varName="--radius-lg" min={0} max={60}  defaultValue={16} site={site} updateVar={updateVar} />

                        <Divider />

                        {/* ── Shadows ── */}
                        <SectionLabel>Shadows</SectionLabel>

                        {/* Live shadow previews */}
                        <div className="mb-2">
                            {[
                                { label: "Shadow SM", varName: "--shadow-sm", fallback: "0 1px 2px rgba(0,0,0,0.05)" },
                                { label: "Shadow MD", varName: "--shadow-md", fallback: "0 4px 12px rgba(0,0,0,0.1)" },
                                { label: "Shadow LG", varName: "--shadow-lg", fallback: "0 10px 25px rgba(0,0,0,0.15)" },
                            ].map(({ label, varName, fallback }) => (
                                <ShadowPreviewRow
                                    key={varName}
                                    label={label}
                                    varName={varName}
                                    value={v(varName, fallback)}
                                    onClick={() => {}} /* future: open shadow editor */
                                />
                            ))}
                        </div>

                        {/* Shadow strength sliders — control the alpha of each shadow */}
                        <SectionLabel>Shadow strength</SectionLabel>
                        <RangeRow
                            label="SM opacity"
                            varName="--shadow-sm-opacity"
                            min={0} max={30} step={1} unit="%"
                            defaultValue={5}
                            site={site}
                            updateVar={(k, val) => {
                                const pct = parseInt(val) / 100;
                                updateVar("--shadow-sm", `0 1px 2px rgba(0,0,0,${pct.toFixed(2)})`);
                            }}
                        />
                        <RangeRow
                            label="MD opacity"
                            varName="--shadow-md-opacity"
                            min={0} max={40} step={1} unit="%"
                            defaultValue={10}
                            site={site}
                            updateVar={(k, val) => {
                                const pct = parseInt(val) / 100;
                                updateVar("--shadow-md", `0 4px 12px rgba(0,0,0,${pct.toFixed(2)})`);
                            }}
                        />
                        <RangeRow
                            label="LG opacity"
                            varName="--shadow-lg-opacity"
                            min={0} max={50} step={1} unit="%"
                            defaultValue={15}
                            site={site}
                            updateVar={(k, val) => {
                                const pct = parseInt(val) / 100;
                                updateVar("--shadow-lg", `0 10px 25px rgba(0,0,0,${pct.toFixed(2)})`);
                            }}
                        />
                    </div>
                );

            /* ══════════════════════════════════════
               CSS
            ══════════════════════════════════════ */
            case "css":
                return (
                    <div className="flex flex-col gap-2">
                        <SectionLabel>Custom CSS</SectionLabel>
                        <p className="text-[10px] text-white/25 leading-relaxed mb-1">
                            Injected globally into the template. Use CSS variables like{" "}
                            <code className="text-indigo-300/60 font-mono">--color-primary</code> for theming.
                        </p>
                        <textarea
                            value={site.css || ""}
                            onChange={(e) => setSite({ ...site, css: e.target.value })}
                            spellCheck={false}
                            placeholder="/* your custom CSS */"
                            className="
                                w-full h-64 resize-none rounded-xl
                                bg-black/30 border border-white/[0.07]
                                text-[11px] font-mono text-emerald-300/80
                                p-3 leading-relaxed outline-none
                                placeholder:text-white/15
                                focus:border-indigo-400/30 transition-colors
                            "
                            style={{ tabSize: 2 }}
                        />

                        {/* Quick-insert snippets */}
                        <SectionLabel>Quick insert</SectionLabel>
                        <div className="flex flex-col gap-1">
                            {[
                                { label: "Gradient bg",    snippet: "background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));" },
                                { label: "Glass card",     snippet: "background: rgba(255,255,255,0.08);\nbackdrop-filter: blur(12px);\nborder: 1px solid rgba(255,255,255,0.12);" },
                                { label: "Text gradient",  snippet: "background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;" },
                                { label: "Hide scrollbar", snippet: "::-webkit-scrollbar { display: none; }" },
                            ].map(({ label, snippet }) => (
                                <button
                                    key={label}
                                    onClick={() => setSite({ ...site, css: (site.css || "") + "\n" + snippet })}
                                    className="
                                        text-left px-2.5 py-1.5 rounded-md
                                        text-[11px] text-white/40 hover:text-white/70
                                        bg-white/[0.03] hover:bg-white/[0.06]
                                        border border-white/[0.05]
                                        transition-all
                                    "
                                >
                                    + {label}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    /* ── RENDER ── */
    return (
        <div className="flex flex-col h-full">

            {/* ── THEME PRESETS ── */}
            <div className="px-4 pt-4 pb-3 border-b border-white/[0.05] shrink-0">
                <SectionLabel>Theme presets</SectionLabel>
                <div className="flex gap-2">
                    {Object.entries(PRESET_META).map(([key, meta]) => (
                        <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className="
                                flex-1 flex flex-col items-center gap-1.5 py-2 px-1
                                rounded-xl border border-white/[0.06] bg-white/[0.025]
                                hover:bg-white/[0.06] hover:border-indigo-400/30
                                transition-all duration-150 cursor-pointer group
                            "
                        >
                            <div className="flex gap-0.5">
                                {meta.swatches.map((color, i) => (
                                    <div
                                        key={i}
                                        className="w-3 h-3 rounded-full border border-black/20 shadow-sm"
                                        style={{ background: color }}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] font-medium text-white/45 group-hover:text-white/70 transition-colors">
                                {meta.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── TABS ── */}
            <div className="px-3 py-2.5 border-b border-white/[0.05] shrink-0">
                <div className="flex gap-1">
                    {TABS.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`
                                flex items-center gap-1.5 flex-1 justify-center py-1.5 rounded-lg
                                text-[11px] font-medium cursor-pointer
                                border transition-all duration-150
                                ${tab === id
                                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
                                    : "text-white/30 hover:text-white/55 hover:bg-white/[0.04] border-transparent"
                                }
                            `}
                        >
                            {icon}
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── TAB CONTENT ── */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
                {renderTab()}
            </div>
        </div>
    );
}