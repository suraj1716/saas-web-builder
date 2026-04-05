import { WebsiteInstance } from "@/web-builder/types/types";
import { ReactNode } from "react";
import { JSX } from "react/jsx-runtime";

export const SimpleWebsite: WebsiteInstance = {
  id: 1,
  templateId: 1,
  userId: 0,

  name: "Simple Website",

  cssClass: "simple-template-1",

  design: {
    primaryColor: "#ff0000",
    backgroundColor: "#000000",
    textColor: "#ffffff"
  },

  layout: {
    navbar: {
      id: "navbar-1",
      type: "navbar",
      content: {
        title: "My Site"
      },
      draggable: false
    },

    footer: {
      id: "footer-1",
      type: "footer",
      content: {
        copyright: "© 2026"
      },
      draggable: false
    }
  },

  pages: [
    {
      pageId: "home",
      title: "Home",
      slug: "home",

      sections: [
        {
          id: "hero-1",
          type: "hero",
          content: {
            heading: "Welcome hero1",
            subheading: "This is my website"
          },
          draggable: true
        },

        {
          id: "about-1",
          type: "about",
          content: {
            text: "About hero1"
          },
          draggable: true
        }
      ]
    },

    {
      pageId: "about",
      title: "About",
      slug: "about",

      sections: [
        {
          id: "about-2",
          type: "about",
          content: {
            text: "More about us"
          },
          draggable: true
        }
      ]
    },

    {
      pageId: "contact",
      title: "Contact",
      slug: "contact",

      sections: [
        {
          id: "contact-1",
          type: "contact",
          content: {
            email: "info@site.com"
          },
          draggable: true
        }
      ]
    }
  ],
  map: function (arg0: (tpl: any) => JSX.Element): ReactNode {
    throw new Error("Function not implemented.");
  }
};