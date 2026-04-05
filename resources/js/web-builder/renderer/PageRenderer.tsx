import React, { useState, useEffect } from "react";
import { sectionRegistry, SectionConfig } from "../sections/sectionRegistry";

export const PageRenderer = ({
    website,
    page,
    editing,
    updateWebsite,
}: any) => {
    const [sections, setSections] = useState(page.sections || []);

    useEffect(() => {
        setSections(page.sections || []);
    }, [page]);

    const sync = (updated: any) => {
        const newSite = {
            ...website,
            pages: website.pages.map((p: any) =>
                p.slug === page.slug ? { ...p, sections: updated } : p
            ),
        };
        updateWebsite(newSite);
    };

    const insertSection = (index: number, type: string = "hero") => {
        const config = sectionRegistry[type];

        const newSection = {
            id: Date.now().toString(),
            type,
            content: config?.defaultContent || {}, // ✅ FIX
        };

        const updated = [...sections];
        updated.splice(index + 1, 0, newSection);

        setSections(updated);
        sync(updated);
    };

    const deleteSection = (index: number) => {
        const updated = sections.filter((_: any, i: number) => i !== index);
        setSections(updated);
        sync(updated);
    };

    // Separate Navbar and Footer from normal sections
    const NavbarComponent = sectionRegistry["navbar"]?.component;
    const FooterComponent = sectionRegistry["footer"]?.component;

    console.log("RENDER PAGE:", page);
    console.log("ALL PAGES:", website.pages);

    return (
        <div>
            {/* Navbar */}
            {NavbarComponent && (
                <NavbarComponent
                    website={website}
                    editing={editing}
                    updateWebsite={updateWebsite} // ✅ VERY IMPORTANT
                    content={{
                        title: website?.name || "My Website",
                    }}
                />
            )}

            {/* Page Sections */}
            {sections.map((section: any, index: number) => {
                const config: SectionConfig | undefined =
                    sectionRegistry[section.type];

                // Skip layout-only sections
                if (!config || config.category === "layout") return null;

                const Component = config.component;

                return (
                    <div
                        key={section.id}
                        style={{
                            position: "relative",
                            border: editing ? "2px dashed #3b82f6" : "none",
                            marginBottom: 16,
                            background: "#fff",
                        }}
                    >
                        {editing && (
                            <>
                                <button
                                    onClick={() => insertSection(index)}
                                    style={{
                                        position: "absolute",
                                        top: -12,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        zIndex: 10,
                                    }}
                                >
                                    +
                                </button>

                                <button
                                    onClick={() => deleteSection(index)}
                                    style={{
                                        position: "absolute",
                                        top: 6,
                                        right: 6,
                                        zIndex: 10,
                                    }}
                                >
                                    ✕
                                </button>

                                {/* Move up */}
                                {index > 0 && (
                                    <button
                                        onClick={() => {
                                            const newSections = [...sections];
                                            [
                                                newSections[index - 1],
                                                newSections[index],
                                            ] = [
                                                newSections[index],
                                                newSections[index - 1],
                                            ];
                                            setSections(newSections);
                                            sync(newSections);
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: 6,
                                            left: 6,
                                            zIndex: 10,
                                        }}
                                    >
                                        ↑
                                    </button>
                                )}

                                {/* Move down */}
                                {index < sections.length - 1 && (
                                    <button
                                        onClick={() => {
                                            const newSections = [...sections];
                                            [
                                                newSections[index],
                                                newSections[index + 1],
                                            ] = [
                                                newSections[index + 1],
                                                newSections[index],
                                            ];
                                            setSections(newSections);
                                            sync(newSections);
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: 36,
                                            left: 6,
                                            zIndex: 10,
                                        }}
                                    >
                                        ↓
                                    </button>
                                )}
                            </>
                        )}

                        <Component
                            content={section.content}
                            editing={editing}
                            updateContent={(data: any) => {
                                const updated = sections.map((s: any) =>
                                    s.id === section.id
                                        ? { ...s, content: data }
                                        : s
                                );
                                setSections(updated);
                                sync(updated);
                            }}
                            website={website}
                        />
                    </div>
                );
            })}

            {/* Footer */}
            {FooterComponent && (
                <FooterComponent
                    website={website}
                    editing={false}
                    content={{
                        copyright: website?.copyright || "© 2026 My Website",
                    }}
                />
            )}
        </div>
    );
};
