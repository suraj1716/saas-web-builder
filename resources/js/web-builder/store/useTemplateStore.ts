// store/useTemplateStore.ts
import { create } from "zustand";
import { WebsiteInstance } from "../types/types";

type TemplateState = {
  currentTemplate: WebsiteInstance | null;
  setCurrentTemplate: (template: WebsiteInstance) => void;
};

export const useTemplateStore = create<TemplateState>((set) => ({
  currentTemplate: null,
  setCurrentTemplate: (template) => {
    set({ currentTemplate: template });
    // Persist in localStorage
    localStorage.setItem("currentTemplate", JSON.stringify(template));
  },
}));

// Load persisted template
export const loadPersistedTemplate = (): WebsiteInstance | null => {
  const data = localStorage.getItem("currentTemplate");
  return data ? JSON.parse(data) : null;
};