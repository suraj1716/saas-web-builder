import { useEffect, useRef } from "react";
import { useEditor } from "./EditorContext";
import axios from "axios";

export function withEditor(Component: any) {
  return function Wrapped(props: any) {
    const { content, sectionId } = props;
    const { editing, updateSection } = useEditor();

    const ref = useRef<HTMLDivElement>(null);
    const dragRef = useRef<{
      draggingBlock: string | null;
      targetBlock: string | null;
    }>({ draggingBlock: null, targetBlock: null });

    const typingLock = useRef(false);

    const getLayout = (prev: any): string[] => {
      if (Array.isArray(prev.layout) && prev.layout.length) {
        return [...prev.layout];
      }
      return ["badge", "heading", "subheading", "text", "buttons", "media"];
    };

    useEffect(() => {
      if (!editing || !ref.current) return;

      const root = ref.current;
      const cleanups: (() => void)[] = [];

      /* ===============================
         TEXT EDIT (FIXED)
      =============================== */
      const textEls = root.querySelectorAll("[data-edit]");

      textEls.forEach((el) => {
        const key = el.getAttribute("data-edit");
        if (!key) return;

        const htmlEl = el as HTMLElement;

        if (htmlEl.getAttribute("data-bound")) return;
        htmlEl.setAttribute("data-bound", "true");

        htmlEl.contentEditable = "true";
        htmlEl.style.outline = "1px dashed rgba(99,102,241,0.4)";
        htmlEl.style.borderRadius = "4px";
        htmlEl.style.minWidth = "20px";
        htmlEl.style.display = "inline-block";

        // IMPORTANT: remove toolbar from text extraction
        const save = () => {
          if (typingLock.current) return;

          const clone = htmlEl.cloneNode(true) as HTMLElement;

          clone
            .querySelectorAll(".block-toolbar, .editor-upload-btn")
            .forEach((n) => n.remove());

            const value = clone.innerText;

            updateSection(sectionId, (prev: any) => {
              // handle nested keys like faq-0.question
              if (key.includes(".")) {
                const [parent, child] = key.split(".");
            
                return {
                  ...prev,
                  [parent]: {
                    ...(prev[parent] || {}),
                    [child]: value,
                  },
                };
              }
            
              return {
                ...prev,
                [key]: value,
              };
            });
        };

        // ✔ BEST PRACTICE: save on blur instead of every keystroke
        htmlEl.addEventListener("blur", save);

        cleanups.push(() => {
          htmlEl.removeEventListener("blur", save);
          htmlEl.removeAttribute("data-bound");
          htmlEl.contentEditable = "false";
        });
      });

      /* ===============================
         MEDIA UPLOAD (UNCHANGED FIXED)
      =============================== */

      const mediaEls = root.querySelectorAll("[data-edit-media]");

      mediaEls.forEach((mediaEl) => {
        const htmlEl = mediaEl as HTMLElement;
        const mediaKey =
          htmlEl.getAttribute("data-edit-media") || "media_url";

        htmlEl.style.position = "relative";

        htmlEl.querySelector(".editor-upload-btn")?.remove();

        const btn = document.createElement("button");
        btn.innerText = "Upload Image";

        Object.assign(btn.style, {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "999",
          padding: "8px 14px",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          background: "#fff",
        });

        htmlEl.appendChild(btn);

        const clickHandler = () => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";

          input.onchange = async (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            const token = document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content");

            const res = await axios.post("/media/upload", formData, {
              headers: { "X-CSRF-TOKEN": token || "" },
            });

            updateSection(sectionId, (prev: any) => ({
              ...prev,
              [mediaKey]: res.data.url,
              media_id: res.data.id,
            }));
          };

          input.click();
        };

        btn.addEventListener("click", clickHandler);

        cleanups.push(() => {
          btn.removeEventListener("click", clickHandler);
          btn.remove();
        });
      });

   /* ===============================
   BLOCK CONTROLS (FIXED HOVER +  )
=============================== */

const blocks = root.querySelectorAll("[data-block]");

blocks.forEach((block) => {
  const el = block as HTMLElement;
  const blockName = el.getAttribute("data-block");
  if (!blockName) return;

  el.style.position = "relative";

  // remove old toolbar
  el.querySelector(".block-toolbar")?.remove();

  const toolbar = document.createElement("div");
  toolbar.className = "block-toolbar";
  toolbar.setAttribute("contenteditable", "false");

  Object.assign(toolbar.style, {
    position: "absolute",
    top: "-32px",
transform: "translateY(-110%)",
    right: "0",
    display: "flex",
    gap: "4px",
    background: "#111827",
    borderRadius: "10px",
    padding: "5px",
    zIndex: "9999",

    // FIX HOVER ISSUE
    opacity: "0",
    pointerEvents: "none",
    transition: "opacity 0.15s ease, transform 0.15s ease",
  });

  const makeBtn = (text: string) => {
    const btn = document.createElement("button");
    btn.innerText = text;

    Object.assign(btn.style, {
      padding: "4px 6px",
      cursor: "pointer",
      border: "none",
      background: "transparent",
      color: "#fff",
      fontSize: "12px",
    });

    return btn;
  };

  /* MOVE UP */
  const up = makeBtn("↑");
  up.onclick = (e) => {
    e.stopPropagation();
    updateSection(sectionId, (prev: any) => {
      const layout = getLayout(prev);
      const i = layout.indexOf(blockName);
      if (i <= 0) return prev;
      [layout[i - 1], layout[i]] = [layout[i], layout[i - 1]];
      return { ...prev, layout };
    });
  };

  /* MOVE DOWN */
  const down = makeBtn("↓");
  down.onclick = (e) => {
    e.stopPropagation();
    updateSection(sectionId, (prev: any) => {
      const layout = getLayout(prev);
      const i = layout.indexOf(blockName);
      if (i === -1 || i >= layout.length - 1) return prev;
      [layout[i], layout[i + 1]] = [layout[i + 1], layout[i]];
      return { ...prev, layout };
    });
  };

  /* DUPLICATE */
  const dup = makeBtn("+");
  dup.onclick = (e) => {
    e.stopPropagation();
    updateSection(sectionId, (prev: any) => {
      const layout = getLayout(prev);
      const i = layout.indexOf(blockName);
      if (i === -1) return prev;

      const newKey = `${blockName.split("_")[0]}_${Date.now()}`;
      layout.splice(i + 1, 0, newKey);

      return {
        ...prev,
        layout,
        [newKey]: prev[blockName] ?? "",
      };
    });
  };

  /* DELETE */
  const del = makeBtn("×");
  del.onclick = (e) => {
    e.stopPropagation();
    updateSection(sectionId, (prev: any) => {
      const layout = getLayout(prev).filter((b) => b !== blockName);
      const updated = { ...prev, layout };
      delete updated[blockName];
      return updated;
    });
  };



  toolbar.appendChild(up);
  toolbar.appendChild(down);
  toolbar.appendChild(dup);
  toolbar.appendChild(del);

  el.appendChild(toolbar);

  /* ===============================
     FIXED HOVER (NO FLICKER)
  =============================== */

  const show = () => {
    toolbar.style.opacity = "1";
    toolbar.style.transform = "translateY(0)";
    toolbar.style.pointerEvents = "auto";
  };

  const hide = () => {
    toolbar.style.opacity = "0";
    toolbar.style.transform = "translateY(4px)";
    toolbar.style.pointerEvents = "none";
  };

  // IMPORTANT FIX: use pointer events instead of mouseenter/leave
  el.addEventListener("pointerenter", show);
  el.addEventListener("pointerleave", hide);

  cleanups.push(() => {
    el.removeEventListener("pointerenter", show);
    el.removeEventListener("pointerleave", hide);
    toolbar.remove();
  });
});

      return () => cleanups.forEach((fn) => fn());
    }, [editing]); // IMPORTANT: removed content dependency

    return (
      <div ref={ref}>
        <Component {...props} editing={editing} />
      </div>
    );
  };
}