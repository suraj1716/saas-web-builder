// core/types/WebsiteInstance.ts

export type WebsiteInstance = {
    map(arg0: (tpl: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    id: number;
    templateId: number;
    userId: number;
    name: string;
    cssClass: string;

    design?: {
      primaryColor?: string;
      secondaryColor?: string;
      backgroundColor?: string;
      textColor?: string;
    };

    layout: {
      navbar: SectionInstance;
      footer: SectionInstance;
    };
    pages: PageInstance[];
  };
  
  export interface PageInstance {
    pageId: string;         // Unique page ID
    title: string;          // Page title
    slug: string;           // URL slug for the page
    sections: SectionInstance[]; // Sections inside the page
  }
  
 // src/core/types/types.ts
export type SectionInstance = {
    id: string; // unique identifier for this section
    type: string; // must match a key in sectionRegistry
    content: Record<string, any>; // section-specific content
    draggable?: boolean; // optional, default false
    editable?: boolean; // optional, default true
  };