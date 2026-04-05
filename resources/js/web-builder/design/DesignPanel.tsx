import React, { useState, useRef, useEffect } from "react";

type Props = {
  site: any;
  setSite: (site: any) => void;
};

export default function ThemeColorDropdown({ site, setSite }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const updateDesign = (key: string, value: string) => {
    setSite({
      ...site,
      design: {
        ...site.design,
        [key]: value,
      },
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="btn text-sm px-2 py-1 border rounded bg-white hover:bg-gray-100"
      >
        Theme Colors
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg p-2 z-50">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm">Primary</label>
            <input
              type="color"
              value={site.design?.primaryColor || "#4f46e5"}
              onChange={(e) => updateDesign("primaryColor", e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between mb-2">
            <label className="text-sm">Background</label>
            <input
              type="color"
              value={site.design?.backgroundColor || "#ffffff"}
              onChange={(e) => updateDesign("backgroundColor", e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">Text</label>
            <input
              type="color"
              value={site.design?.textColor || "#1f2937"}
              onChange={(e) => updateDesign("textColor", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}