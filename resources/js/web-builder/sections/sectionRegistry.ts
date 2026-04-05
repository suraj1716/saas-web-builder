import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Hero from "./hero/Hero";
import Contact from "./contact/Contact";
import About from "./about/About";

export type SectionConfig = {
  type: string;
  label: string;
  category: string;
  component: React.FC<any>;
  preview: string,
  defaultContent?: any; // ✅ ADD THIS
};

export const sectionRegistry: Record<string, SectionConfig> = {
  navbar: {
    type: "navbar",
    label: "Navbar",
    preview: "/resources/js/web-builder/sections/about/about.png",
    category: "layout",
    component: Navbar,
  },
  footer: {
    type: "footer",
    label: "Footer",
    preview: "/resources/js/web-builder/sections/about/about.png",

    category: "layout",
    component: Footer,
  },
  hero: {
    type: "hero",
    label: "Hero",
    preview: "/resources/js/web-builder/sections/about/about.png",

    category: "basic",
    component: Hero,
    defaultContent: {
      heading: "Welcome",
      text: "Your tagline here",
    },
  },
  about: {
    type: "about",
    label: "About",
    preview: "/resources/js/web-builder/sections/about/about.png",

    category: "basic",
    component: About,
    defaultContent: {
      heading: "About Us",
      subheading: "Who we are",
      text: "Write something about your business...",
      imageUrl: "",
    },
  },
  contact: {
    type: "contact",
    label: "Contact",
    preview: "/resources/js/web-builder/sections/about/about.png",

    category: "forms",
    component: Contact,
  },
};