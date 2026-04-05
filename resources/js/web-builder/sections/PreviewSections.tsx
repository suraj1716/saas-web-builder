import React, { useState } from "react";
import { sectionRegistry } from "./sectionRegistry";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

type Props = {
  addSection: (type: string) => void;
  active: boolean;
  toggle: () => void;
};

export default function PreviewSidebar({ addSection, active, toggle }: Props) {
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const groupedSections = Object.values(sectionRegistry).reduce(
    (acc: Record<string, any[]>, section: any) => {
      if (!acc[section.category]) acc[section.category] = [];
      acc[section.category].push(section);
      return acc;
    },
    {}
  );

  return (
    <div
      className={`transition-all duration-300 bg-gray-100 border-r border-gray-300 ${
        active ? "w-64" : "w-16"
      } flex flex-col`}
    >
      {/* Expand/Collapse Sidebar */}
      <button
        className="p-2 m-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={toggle}
      >
        {active ? "«" : "»"}
      </button>

      {active && (
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {Object.entries(groupedSections).map(([category, sections]) => (
            <div key={category} className="space-y-1">
              {/* Category Header */}
              <div
                className="flex items-center justify-between cursor-pointer p-1 hover:bg-gray-200 rounded"
                onClick={() => toggleCategory(category)}
              >
                <span className="font-semibold">{category}</span>
                {collapsedCategories.includes(category) ? (
                  <FiChevronRight />
                ) : (
                  <FiChevronDown />
                )}
              </div>

              {/* Section List */}
              {!collapsedCategories.includes(category) && (
                <div className="flex flex-col gap-2 mt-1">
                  {sections.map((section: any) => (
                    <div
                      key={section.type}
                      className="flex items-center gap-2 cursor-pointer border rounded p-1 hover:shadow-sm transition"
                      onClick={() => addSection(section.type)}
                    >
                      <img
                        src={section.preview}
                        alt={section.label || section.type}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="text-sm">{section.label || section.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}