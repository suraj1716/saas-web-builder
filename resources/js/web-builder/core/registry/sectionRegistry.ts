import React from "react";

export type SectionConfig = {
  type: string;
  label: string;
  category: "navigation" | "footer" | "layout" | "forms" | "basic";
  component: React.FC<any>;
  preview: string;
  defaultContent?: any;
};

export const sectionRegistry: Record<string, SectionConfig> = {};

const modules = import.meta.glob<{
  default: React.FC<any>;
  defaultContent?: any;
}>("../../ui/sections/**/*.tsx", { eager: true });

Object.entries(modules).forEach(([path, mod]) => {
  const Component = mod?.default;
  if (!Component) return;

  const filename = path.split("/").pop()?.replace(".tsx", "") ?? "";
  const parts = path.split("/");
  const folderName = parts[parts.length - 2]?.toLowerCase() ?? "";
  const type = filename.toLowerCase();

  let category: SectionConfig["category"] = "basic";
  if (folderName === "navbar" || folderName === "navigation") category = "navigation";
  else if (folderName === "footer") category = "footer";
  else if (folderName === "layout") category = "layout";
  else if (folderName === "contact") category = "forms";

  sectionRegistry[type] = {
    type,
    label: filename,
    category,
    component: Component,
    preview: `/web-builder/sections/${folderName}/${type}.jpg`,
    defaultContent: mod.defaultContent ?? {},
  };
});

/* ── HELPERS ── */

export function getDefaultNavbarType(): string | undefined {
  return Object.values(sectionRegistry).find(
    (s) => s.category === "navigation"
  )?.type;
}

export function getDefaultFooterType(): string | undefined {
  return Object.values(sectionRegistry).find(
    (s) => s.category === "footer"
  )?.type;
}