import { create } from "zustand"

export interface Section {
  id: string
  type: string
  data: any
}

interface BuilderState {
  sections: Section[]
  setSections: (sections: Section[]) => void
  updateSection: (id: string, data: any) => void
  reorderSections: (sections: Section[]) => void
  addSection: (section: Section) => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  sections: [],

  setSections: (sections) => set({ sections }),

  addSection: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
    })),

  updateSection: (id, data) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, data: { ...s.data, ...data } } : s
      ),
    })),

  reorderSections: (sections) => set({ sections }),
}))