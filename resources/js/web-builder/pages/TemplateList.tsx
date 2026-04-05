// TemplateList.tsx

import { WebsiteInstance } from "../types/types";


type Props = {
  templates: WebsiteInstance;
  onSelect: (tpl: WebsiteInstance) => void;
};

export const TemplateList = ({ templates, onSelect }: Props) => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Select a Template</h1>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            style={{
              border: "1px solid #ccc",
              padding: 20,
              cursor: "pointer",
              width: 250,
              borderRadius: 6,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
            onClick={() => onSelect(tpl)}
          >
            <h2>{tpl.siteSettings.siteName}</h2>
            <p>Template ID: {tpl.templateId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};