import { useEffect, useRef } from "react";

/**
 * withFooterEditor
 *
 * - Makes every [data-edit] element inline-editable (saves on blur)
 * - Shows ↑ ↓ + × toolbar on every [data-block] on hover
 * - For link labels ([data-link-slug-key] attribute):
 *     opens a page picker popup showing all pages from website.data.pages
 *     user clicks a page → label + pageSlug both saved into footer content
 */
export function withFooterEditor(Component: any) {
  return function WrappedFooter(props: any) {
    const { content, editing, updateWebsite, website } = props;
    const ref = useRef<HTMLDivElement>(null);

    const updateFooterContent = (updater: (prev: any) => any) => {
        // updateWebsite((prev: any) => {
        //   const current = prev?.data?.layout?.footer?.content ?? {};
      
        //   console.log("=== updateFooterContent ===");
        //   console.log("CURRENT CONTENT:", current);
      
        //   const updated = updater(current);
      
        //   console.log("UPDATED CONTENT:", updated);
      
        //   return {
        //     ...prev,
        //     data: {
        //       ...prev.data,
        //       layout: {
        //         ...prev.data?.layout,
        //         footer: {
        //           ...prev.data?.layout?.footer,
        //           content: updated,
        //         },
        //       },
        //     },
        //   };
        // });
      };
      const getLayout = (prev: any): string[] => {
        const layout = prev?.data?.layout?.footer?.content?.layout;
      
        if (Array.isArray(layout) && layout.length) return [...layout];
      
        return [
          "logo",
          "tagline",
          "column_0",
          "column_1",
          "column_2",
          "copyright",
          "made_with",
        ];
      };

    useEffect(() => {
      if (!editing || !ref.current) return;
      const root = ref.current;
      const cleanups: (() => void)[] = [];

      /* ══════════════════════════════
         PAGE PICKER POPUP
         One shared popup, repositioned
         each time a link is focused.
      ══════════════════════════════ */
      const picker = document.createElement("div");
      Object.assign(picker.style, {
        position: "fixed",
        zIndex: "99999",
        background: "#111827",
        border: "1px solid rgba(251,146,60,0.35)",
        borderRadius: "12px",
        padding: "6px",
        minWidth: "200px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        display: "none",
        flexDirection: "column",
        gap: "2px",
      });

      const pickerHeader = document.createElement("p");
      pickerHeader.innerText = "Link to page";
      Object.assign(pickerHeader.style, {
        fontSize: "10px", fontWeight: "700",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "rgba(251,146,60,0.5)",
        margin: "0 0 6px 6px",
      });
      picker.appendChild(pickerHeader);
      document.body.appendChild(picker);

      let activeLabelEl: HTMLElement | null = null;
      let activeSlugKey: string | null = null;
      let activeLabelKey: string | null = null;

      const closePicker = () => {
        picker.style.display = "none";
        activeLabelEl = null;
        activeSlugKey = null;
        activeLabelKey = null;
      };

      const openPicker = (labelEl: HTMLElement, slugKey: string, labelKey: string) => {
        activeLabelEl = labelEl;
        activeSlugKey = slugKey;
        activeLabelKey = labelKey;

        // Rebuild list fresh each time (pages can change)
        
        const pages: { title: string; slug: string }[] = website?.data?.pages ?? [];

        Array.from(picker.children).forEach(child => {
          if (child !== pickerHeader) child.remove();
        });

        if (pages.length === 0) {
          const empty = document.createElement("p");
          empty.innerText = "No pages found";
          Object.assign(empty.style, { fontSize: "12px", color: "rgba(255,255,255,0.3)", padding: "8px 10px" });
          picker.appendChild(empty);
        }

        pages.forEach((page) => {
          const btn = document.createElement("button");
          btn.innerText = page.title;
          Object.assign(btn.style, {
            width: "100%", textAlign: "left",
            padding: "8px 12px", borderRadius: "8px",
            border: "none", background: "transparent",
            color: "rgba(255,255,255,0.7)", fontSize: "13px",
            cursor: "pointer", transition: "background 0.1s",
            display: "flex", alignItems: "center", gap: "8px",
          });

          // Show current slug as hint
          const hint = document.createElement("span");
          hint.innerText = `/${page.slug}`;
          Object.assign(hint.style, { fontSize: "11px", color: "rgba(255,255,255,0.25)", marginLeft: "auto", fontFamily: "monospace" });
          btn.appendChild(hint);

          btn.onmouseenter = () => { btn.style.background = "rgba(251,146,60,0.1)"; btn.style.color = "#fff"; };
          btn.onmouseleave = () => { btn.style.background = "transparent"; btn.style.color = "rgba(255,255,255,0.7)"; };

          btn.onclick = (e) => {
            e.stopPropagation();

            // Save label = page title, pageSlug = page.slug
            updateFooterContent((prev: any) => ({
              ...prev,
              [activeLabelKey!]: page.title,
              [activeSlugKey!]: page.slug,
            }));

            // Update DOM immediately so user sees the change
            if (activeLabelEl) {
              activeLabelEl.innerText = page.title;
              activeLabelEl.setAttribute("data-link-slug", page.slug);
            }

            closePicker();
          };

          picker.appendChild(btn);
        });

        // Position below the label element
        picker.style.display = "flex";
        const rect = labelEl.getBoundingClientRect();
        let top  = rect.bottom + 8;
        let left = rect.left;

        // Keep inside viewport
        requestAnimationFrame(() => {
          const pw = picker.offsetWidth;
          const ph = picker.offsetHeight;
          if (left + pw > window.innerWidth - 12) left = window.innerWidth - pw - 12;
          if (top + ph > window.innerHeight - 12) top = rect.top - ph - 8;
          picker.style.top  = `${top}px`;
          picker.style.left = `${left}px`;
        });
      };

      // Close picker on outside click
      const outsideClick = (e: MouseEvent) => {
        if (!picker.contains(e.target as Node)) closePicker();
      };
      document.addEventListener("mousedown", outsideClick);
      cleanups.push(() => {
        document.removeEventListener("mousedown", outsideClick);
        picker.remove();
      });

      /* ══════════════════════════════
         1. TEXT EDITING  (data-edit)
      ══════════════════════════════ */
      root.querySelectorAll("[data-edit]").forEach((el) => {
        const key = el.getAttribute("data-edit");
        if (!key) return;
        const htmlEl = el as HTMLElement;
        if (htmlEl.getAttribute("data-footer-bound")) return;
        htmlEl.setAttribute("data-footer-bound", "true");

        // data-link-slug-key is set only on link label spans
        const slugKey = htmlEl.getAttribute("data-link-slug-key");
        const isLink  = !!slugKey;

        htmlEl.contentEditable = "true";
        htmlEl.style.outline      = "1px dashed rgba(251,146,60,0.45)";
        htmlEl.style.borderRadius = "4px";
        htmlEl.style.minWidth     = "20px";
        htmlEl.style.display      = "inline-block";

        // Save plain text on blur
        const onBlur = () => {
          const clone = htmlEl.cloneNode(true) as HTMLElement;
          clone.querySelectorAll(".footer-block-toolbar").forEach(n => n.remove());
          const value = clone.innerText.trim();
          updateFooterContent((prev: any) => ({ ...prev, [key]: value }));
        };
        htmlEl.addEventListener("blur", onBlur);

        // Link labels → open page picker on focus
        let onFocus: (() => void) | null = null;
        if (isLink && slugKey) {
          onFocus = () => {
            setTimeout(() => openPicker(htmlEl, slugKey, key), 60);
          };
          htmlEl.addEventListener("focus", onFocus);
        }

        cleanups.push(() => {
          htmlEl.removeEventListener("blur", onBlur);
          if (onFocus) htmlEl.removeEventListener("focus", onFocus);
          htmlEl.removeAttribute("data-footer-bound");
          htmlEl.contentEditable = "false";
          htmlEl.style.outline = "";
        });
      });

      /* ══════════════════════════════
         2. BLOCK CONTROLS (data-block)
            ↑ ↓  +  × toolbar on hover
      ══════════════════════════════ */
      
      root.querySelectorAll("[data-block]").forEach((block) => {
        const el = block as HTMLElement;
        const blockName = el.getAttribute("data-block");
        if (!blockName) return;
  
        
        updateWebsite((prev: any) => {
          return prev; // TEMP: don't mutate yet
        });
        el.style.position = "relative";
        el.querySelector(".footer-block-toolbar")?.remove();

        const toolbar = document.createElement("div");
        toolbar.className = "footer-block-toolbar";
        toolbar.setAttribute("contenteditable", "false");
        Object.assign(toolbar.style, {
          position: "absolute", top: "0", right: "0",
          transform: "translateY(-110%)",
          display: "flex", gap: "4px",
          background: "#1a1206",
          border: "1px solid rgba(251,146,60,0.25)",
          borderRadius: "10px", padding: "5px",
          zIndex: "9999", opacity: "0", pointerEvents: "none",
          transition: "opacity 0.15s ease",
        });

        const makeBtn = (text: string, title: string, color = "rgba(251,146,60,0.85)") => {
          const btn = document.createElement("button");
          btn.innerText = text; btn.title = title;
          Object.assign(btn.style, {
            padding: "4px 7px", cursor: "pointer", border: "none",
            background: "transparent", color,
            fontSize: "12px", fontWeight: "700", borderRadius: "6px",
          });
          btn.onmouseenter = () => { btn.style.background = "rgba(251,146,60,0.15)"; };
          btn.onmouseleave = () => { btn.style.background = "transparent"; };
          return btn;
        };

        const up = makeBtn("↑", "Move up");
        up.onclick = (e) => {
            e.stopPropagation();
          
            updateFooterContent((prev: any) => {
              const layout = [...(prev.layout || [])];
              const i = layout.indexOf(blockName);
          
              if (i <= 0) return prev;
          
              [layout[i - 1], layout[i]] = [layout[i], layout[i - 1]];
          
              return {
                ...prev,
                layout,
              };
            });
          };

        const down = makeBtn("↓", "Move down");
        down.onclick = (e) => {
            e.stopPropagation();
          
            updateFooterContent((prev: any) => {
              const layout = [...(prev.layout || [])];
              const i = layout.indexOf(blockName);
          
              if (i === -1 || i >= layout.length - 1) return prev;
          
              [layout[i], layout[i + 1]] = [layout[i + 1], layout[i]];
          
              return {
                ...prev,
                layout,
              };
            });
          };

        const dup = makeBtn("+", "Duplicate");
        dup.onclick = (e) => {
            e.stopPropagation();
          
            updateFooterContent((prev: any) => {
              const layout = [...(prev.layout || [])];
              const i = layout.indexOf(blockName);
          
              if (i === -1) return prev;
          
              const newKey = `${blockName}_${Date.now()}`;
          
              layout.splice(i + 1, 0, newKey);
          
              return {
                ...prev,
                layout,
                [newKey]: prev[blockName] ?? "",
              };
            });
          };

        const sep = document.createElement("div");
        Object.assign(sep.style, { width: "1px", height: "14px", background: "rgba(251,146,60,0.15)", alignSelf: "center" });

        const del = makeBtn("×", "Remove", "rgba(248,113,113,0.8)");
        del.onmouseenter = () => { del.style.background = "rgba(248,113,113,0.15)"; };
     del.onclick = (e) => {
  e.stopPropagation();

  updateFooterContent((prev: any) => {
    const layout = (prev.layout || []).filter(
      (b: string) => b !== blockName
    );

    const updated = { ...prev, layout };
    delete updated[blockName];

    return updated;
  });
};

        toolbar.append(up, down, dup, sep, del);
        el.appendChild(toolbar);

        let isOpen = false;

        const toggleToolbar = (e: MouseEvent) => {
          e.stopPropagation();
          isOpen = !isOpen;
        
          toolbar.style.opacity = isOpen ? "1" : "0";
          toolbar.style.pointerEvents = isOpen ? "auto" : "none";
        };
        
        el.addEventListener("click", toggleToolbar);
        cleanups.push(() => {
            el.removeEventListener("click", toggleToolbar);
          toolbar.remove();
          el.style.position = "";
        });
      });

      return () => cleanups.forEach(fn => fn());
    }, [editing]);

    return (
      <div ref={ref}>
        <Component {...props} editing={editing} />
      </div>
    );
  };
}