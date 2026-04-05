// storage.ts

import type { WebsiteInstance } from "../core/types";

// Save a website template
export const saveWebsite = (website: WebsiteInstance) => {
  localStorage.setItem("currentWebsite", JSON.stringify(website));
};

// Load saved website, fallback to null
export const loadWebsite = (): WebsiteInstance | null => {
  const data = localStorage.getItem("currentWebsite");
  return data ? JSON.parse(data) : null;
};