import React from "react";

type Props = {
  content: any;
  editing?: boolean;
};

const CTA: React.FC<Props> = ({ content, editing }) => {
  const defaultLayout = ["eyebrow", "heading", "text", "buttons"];
  const layout = content?.layout?.length ? content.layout : defaultLayout;

  const renderBlock = (block: string) => {

    /* ================= EYEBROW ================= */
    if (block.startsWith("eyebrow")) {
      return (
        <p
          key={block}
          data-block={block}
          data-edit={block}
          draggable={editing}
          className="eyebrow"
          style={{ color: "var(--color-secondary)", position: "relative", zIndex: 1 }}
        >
          {content[block] ?? content.eyebrow ?? "Get Started Today"}
        </p>
      );
    }

    /* ================= HEADING ================= */
    if (block.startsWith("heading")) {
      return (
        <h2
          key={block}
          data-block={block}
          data-edit={block}
          draggable={editing}
          className="heading h2"
          style={{ color: "#fff", position: "relative", zIndex: 1 }}
        >
          {content[block] ?? content.heading ?? "Ready to build something amazing?"}
        </h2>
      );
    }

    /* ================= TEXT ================= */
    if (block.startsWith("text")) {
      return (
        <p
          key={block}
          data-block={block}
          data-edit={block}
          draggable={editing}
          className="text"
          style={{
            color:     "rgba(255,255,255,0.5)",
            maxWidth:  500,
            position:  "relative",
            zIndex:    1,
          }}
        >
          {content[block] ?? content.text ?? "Join 50,000+ creators and teams who build with us every day. Start free, no credit card required."}
        </p>
      );
    }

    /* ================= BUTTONS ================= */
    if (block.startsWith("buttons")) {
      return (
        <div
          key={block}
          data-block={block}
          draggable={editing}
          className="flex items-center"
          style={{ gap: "var(--space-sm)", justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}
        >
          <button data-edit="primary_button" className="button">
            {content.primary_button ?? "Start Building Free"}
          </button>
          {/* Ghost variant — white-on-dark, not in token system */}
          <button
            data-edit="secondary_button"
            style={{
              background:   "rgba(255,255,255,0.07)",
              color:        "rgba(255,255,255,0.8)",
              border:       "1px solid rgba(255,255,255,0.15)",
              borderRadius: "var(--radius-md)",
              padding:      "14px 28px",
              fontSize:     "var(--text-button)",
              fontWeight:   600,
              cursor:       "pointer",
              fontFamily:   "var(--font-body)",
            }}
          >
            {content.secondary_button ?? "Talk to Sales"}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <section
      className="section"
      style={{
        background:         content.background_color || "var(--color-surface)",
        backgroundImage:    content.background_image ? `url(${content.background_image})` : undefined,
        backgroundSize:     "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div
          className="flex center"
          style={{
            maxWidth:       860,
            margin:         "0 auto",
            flexDirection:  "column",
            gap:            "var(--space-lg)",
            alignItems:     "center",
            background:     "#0f0f11",
            borderRadius:   "var(--radius-lg)",
            padding:        "clamp(48px,8vw,80px) clamp(32px,6vw,80px)",
            position:       "relative",
            overflow:       "hidden",
          }}
        >
          {/* Decorative rings — purely visual, no token equivalent */}
          <div style={{ position: "absolute", top: -80,  right: -80,  width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(79,70,229,0.2)",  pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(79,70,229,0.1)",  pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(6,182,212,0.15)", pointerEvents: "none" }} />

          {layout.map(renderBlock)}
        </div>
      </div>
    </section>
  );
};

export default CTA;

export const defaultContent = {
  eyebrow:          "Get Started Today",
  heading:          "Ready to build something amazing?",
  text:             "Join 50,000+ creators and teams who build with us every day. Start free, no credit card required.",
  primary_button:   "Start Building Free",
  secondary_button: "Talk to Sales",
  background_color: "",
  background_image: "",
  layout:           ["eyebrow", "heading", "text", "buttons"],
};