import React, { useState } from "react";

type Props = {
  content: any;
  editing?: boolean;
  updateContent?: (c: any) => void;
};

const Footer2: React.FC<Props> = ({ content, editing, updateContent }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer style={{
      background: content?.background_color || "#fff",
      borderTop: "1px solid #f3f4f6",
      padding: "clamp(40px, 7vw, 72px) clamp(20px, 6vw, 80px) 32px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Newsletter */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 28, marginBottom: 48, paddingBottom: 48,
          borderBottom: "1px solid #f3f4f6",
        }}>
          <div>
            <h3
              data-block="newsletter_heading"
              data-edit="newsletter_heading"
              draggable={editing}
              style={{ fontSize: 20, fontWeight: 800, color: "#0f0f11", margin: "0 0 6px", letterSpacing: "-0.03em" }}
            >
              {content.newsletter_heading || "Stay in the loop"}
            </h3>
            <p
              data-block="newsletter_text"
              data-edit="newsletter_text"
              draggable={editing}
              style={{ fontSize: 15, color: "#6b7280", margin: 0 }}
            >
              {content.newsletter_text || "Get product updates, articles, and design inspiration."}
            </p>
          </div>

          {submitted ? (
            <p style={{ fontSize: 15, color: "#10b981", fontWeight: 600 }}>✓ Thanks for subscribing!</p>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  padding: "11px 16px", borderRadius: 8,
                  border: "1px solid #e5e7eb", fontSize: 14,
                  outline: "none", width: 240, color: "#374151",
                }}
              />
              <button
                onClick={() => { if (email) setSubmitted(true); }}
                style={{
                  background: "#0f0f11", color: "#fff", border: "none",
                  borderRadius: 8, padding: "11px 20px", fontSize: 14,
                  fontWeight: 600, cursor: "pointer",
                }}>
                Subscribe
              </button>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div
            data-block="logo"
            data-edit="logo"
            draggable={editing}
            style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.04em", color: "#0f0f11" }}
          >
            {content.logo || "Brand"}
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            {(content.links || ["Privacy", "Terms", "Contact"]).map((link: string, i: number) => (
              <a key={i} href="#" style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}>
                {link}
              </a>
            ))}
          </div>

          <p
            data-block="copyright"
            data-edit="copyright"
            draggable={editing}
            style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}
          >
            {content.copyright || "© 2026 Brand"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer2;

export const defaultContent = {
  logo: "Brand",
  newsletter_heading: "Stay in the loop",
  newsletter_text: "Get product updates, articles, and design inspiration.",
  links: ["Privacy", "Terms", "Contact"],
  copyright: "© 2026 Brand",
  background_color: "#fff",
};