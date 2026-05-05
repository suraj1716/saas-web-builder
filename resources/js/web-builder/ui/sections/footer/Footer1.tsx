import React from "react";
import { router, usePage } from "@inertiajs/react";

type Props = {
    content: any;
    editing?: boolean;
    website?: any;
};

const defaultColumns = [
    {
        heading: "Product",
        links: [
            { label: "Features", pageSlug: "features" },
            { label: "Pricing", pageSlug: "pricing" },
            { label: "Changelog", pageSlug: "changelog" },
            { label: "Roadmap", pageSlug: "roadmap" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About", pageSlug: "about" },
            { label: "Blog", pageSlug: "blog" },
            { label: "Careers", pageSlug: "careers" },
            { label: "Press", pageSlug: "press" },
        ],
    },
    {
        heading: "Legal",
        links: [
            { label: "Privacy", pageSlug: "privacy" },
            { label: "Terms", pageSlug: "terms" },
            { label: "Cookie Policy", pageSlug: "cookie-policy" },
            { label: "GDPR", pageSlug: "gdpr" },
        ],
    },
];

export const defaultContent = {
    logo: "Brand",
    tagline: "Building the future of the web, one site at a time.",
    copyright: "© 2026 Brand Inc. All rights reserved.",
    made_with: "Made with ♥ by our team",
    columns: defaultColumns,
    background_color: "#0f0f11",
    layout: [
        "logo",
        "tagline",
        "column_0",
        "column_1",
        "column_2",
        "copyright",
        "made_with",
    ],
};

const Footer1: React.FC<Props> = ({ content, editing, website }) => {
    // ── Same base-route logic as Navbar1 ──
    const { trial, templateId, websiteId } = usePage().props as any;

    const getBaseRoute = () => {
        if (trial) return `/template/${templateId}/editor`;
        if (websiteId) return `/builder/${websiteId}`;
        return `/template/${templateId}`;
    };

    const goToPage = (pageSlug: string) => {
     

        if (editing) return;

        router.visit(`${getBaseRoute()}?page=${pageSlug}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const columns = [
        {
            heading: "Pages",
            links: (website?.data?.pages || []).map((p: any) => ({
                label: p.title,
                pageSlug: p.slug,
            })),
        },
    ];
    const defaultLayout = [
        "logo",
        "tagline",
        "column_0",
        "column_1",
        "column_2",
        "copyright",
        "made_with",
    ];
    const layout: string[] = content?.layout?.length
        ? content.layout
        : defaultLayout;

    const renderBlock = (block: string) => {
        if (block.startsWith("logo")) {
            return (
                <div
                    key={block}
                    data-block={block}
                    data-edit={block}
                    style={{
                        fontWeight: 900,
                        fontSize: 20,
                        letterSpacing: "-0.04em",
                        color: "#fff",
                        position: "relative",
                    }}
                >
                    {content[block] ?? content.logo ?? "Brand"}
                </div>
            );
        }

        if (block.startsWith("tagline")) {
            return (
                <p
                    key={block}
                    data-block={block}
                    data-edit={block}
                    style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.4)",
                        lineHeight: 1.75,
                        maxWidth: 280,
                        margin: 0,
                        position: "relative",
                    }}
                >
                    {content[block] ??
                        content.tagline ??
                        "Building the future of the web, one site at a time."}
                </p>
            );
        }

        if (block.startsWith("column_")) {
            const idx = parseInt(block.split("_")[1], 10);
            const col = columns[idx];
            if (!col) return null;
         
            return (
                <div
                    key={block}
                    data-block={block}
                    style={{ position: "relative" }}
                >
                    <p
                        data-edit={`${block}_heading`}
                        style={{
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.3)",
                            marginBottom: 16,
                        }}
                    >
                        {content[`${block}_heading`] ?? col.heading}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                        }}
                    >
                        {col.links.map((link: any, j: number) => {
                            // label is editable text, pageSlug is which page to go to
                            const label =
                                content[`${block}_link_${j}_label`] ??
                                link.label ??
                                link;
                            const pageSlug =
                                content[`${block}_link_${j}_pageSlug`] ||
                                link.pageSlug ||
                                null;

                            return (
                                <span
                                    key={j}
                                    data-edit={`${block}_link_${j}_label`}
                                    data-link-slug-key={`${block}_link_${j}_pageSlug`}
                                    data-link-slug={pageSlug}
                                    onClick={() => {
                                        if (!pageSlug) {
                                            console.warn(
                                                "No slug for link:",
                                                label
                                            );
                                            return;
                                        }
                                        goToPage(pageSlug);
                                    }}
                                    style={{
                                        fontSize: 14,
                                        color: "rgba(255,255,255,0.5)",
                                        cursor: editing ? "text" : "pointer",
                                        display: "inline-block",
                                        transition: "color 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!editing)
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.color =
                                                "rgba(255,255,255,0.9)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (
                                            e.currentTarget as HTMLElement
                                        ).style.color = "rgba(255,255,255,0.5)";
                                    }}
                                >
                                    {label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (block.startsWith("copyright")) {
            return (
                <p
                    key={block}
                    data-block={block}
                    data-edit={block}
                    style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.3)",
                        margin: 0,
                        position: "relative",
                    }}
                >
                    {content[block] ??
                        content.copyright ??
                        "© 2026 Brand Inc. All rights reserved."}
                </p>
            );
        }

        if (block.startsWith("made_with")) {
            return (
                <p
                    key={block}
                    data-block={block}
                    data-edit={block}
                    style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.2)",
                        margin: 0,
                        position: "relative",
                    }}
                >
                    {content[block] ??
                        content.made_with ??
                        "Made with ♥ by our team"}
                </p>
            );
        }

        return null;
    };

    const brandBlocks = layout.filter(
        (b) => b.startsWith("logo") || b.startsWith("tagline")
    );
    const columnBlocks = layout.filter((b) => b.startsWith("column_"));
    const bottomBlocks = layout.filter(
        (b) => b.startsWith("copyright") || b.startsWith("made_with")
    );

    return (
        <footer
            style={{
                background: content.background_color || "#0f0f11",
                padding: "clamp(48px,8vw,80px) clamp(20px,6vw,80px) 32px",
            }}
        >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `2fr repeat(${columnBlocks.length}, 1fr)`,
                        gap: 48,
                        marginBottom: 56,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        {brandBlocks.map(renderBlock)}
                        <div style={{ display: "flex", gap: 10 }}>
                            {["𝕏", "in", "gh"].map((icon, i) => (
                                <button
                                    key={i}
                                    style={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: 8,
                                        background: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "rgba(255,255,255,0.5)",
                                        fontSize: 13,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                    {columnBlocks.map(renderBlock)}
                </div>
                <div
                    style={{
                        height: 1,
                        background: "rgba(255,255,255,0.06)",
                        marginBottom: 24,
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                    }}
                >
                    {bottomBlocks.map(renderBlock)}
                </div>
            </div>
        </footer>
    );
};

export default Footer1;
