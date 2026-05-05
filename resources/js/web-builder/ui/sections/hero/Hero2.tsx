import React from "react";

type Props = {
  content: any;
  editing?: boolean;
};

const Hero2: React.FC<Props> = ({ content, editing }) => {
  const defaultLayout = [
    "badge",
    "heading",
    "text",
    "buttons",
    "footnote",
    "media",
  ];

  const layout = content?.layout?.length
    ? content.layout
    : defaultLayout;

  const renderBlock = (block: string) => {

    /* ================= BADGE ================= */
    if (block.startsWith("badge")) {
      return (
        <div
          key={block}
          data-block={block}
          draggable={editing}
          style={{ width: "fit-content" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(79,70,229,0.08)",
              border: "1px solid rgba(79,70,229,0.2)",
              borderRadius: 100,
              padding: "6px 16px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-primary)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              data-edit={block}
              style={{
                fontSize: 13,
                color: "var(--color-primary)",
                fontWeight: 600,
              }}
            >
              {content[block] || content.badge || "Now in public beta"}
            </span>
          </div>
        </div>
      );
    }

    /* ================= HEADING ================= */
    if (block.startsWith("heading")) {
      return (
        <h1
          key={block}
          className="heading h1"
          data-block={block}
          data-edit={block}
          draggable={editing}
          style={{
            fontSize: "clamp(2.2rem, 5vw, var(--text-h1))",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          {content[block] ||
            content.heading ||
            "Build Stunning Websites Faster"}
        </h1>
      );
    }

    /* ================= TEXT ================= */
    if (block.startsWith("text")) {
      return (
        <p
          key={block}
          className="text"
          data-block={block}
          data-edit={block}
          draggable={editing}
          style={{
            fontSize: 17,
            color: "var(--color-text-light)",
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {content[block] ||
            content.text ||
            "Launch beautiful modern websites with a powerful drag and drop builder experience built for creators and agencies."}
        </p>
      );
    }

    /* ================= BUTTONS ================= */
    if (block.startsWith("buttons")) {
      return (
        <div
          key={block}
          data-block={block}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            data-edit="primary_button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: "var(--radius-md)",
              background: "var(--color-primary)",
              color: "#fff",
              border: "none",
              fontSize: "var(--text-button)",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(79,70,229,0.3)",
              fontFamily: "var(--font-body)",
            }}
          >
            {content.primary_button || "Get Started Free"}
          </button>

          <button
            data-edit="secondary_button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: "var(--radius-md)",
              background: "transparent",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              fontSize: "var(--text-button)",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            {content.secondary_button || "Live Demo"}
          </button>
        </div>
      );
    }

    /* ================= FOOTNOTE ================= */
    if (block.startsWith("footnote")) {
      return (
        <p
          key={block}
          data-block={block}
          data-edit={block}
          draggable={editing}
          style={{
            fontSize: 13,
            color: "var(--color-muted)",
            margin: 0,
          }}
        >
          {content[block] ||
            content.footnote ||
            "No credit card required · Free forever plan available"}
        </p>
      );
    }

    /* ================= MEDIA ================= */
    if (block.startsWith("media")) {
      return (
        <div
          key={block}
          data-block={block}
          data-edit-media="media_url"
          draggable={editing}
          style={{ width: "100%", height: "100%" }}
        >
          {content.media_url ? (
            <img
              src={content.media_url}
              className="media"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-lg)",
                display: "block",
              }}
              alt="Hero"
            />
          ) : (
            <div
              className="card center"
              style={{
                minHeight: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-muted)",
                fontSize: 15,
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              No Image
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const contentBlocks = layout.filter(
    (b: string) => !b.startsWith("media")
  );
  const mediaBlocks = layout.filter((b: string) => b.startsWith("media"));

  return (
    <section
      className="section"
      style={{
        background: content.background_color || "var(--color-bg)",
        backgroundImage: content.background_image
          ? `url(${content.background_image})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: mediaBlocks.length > 0
            ? "1fr 1fr"
            : "1fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "center",
          maxWidth: "var(--container-width)",
        }}
      >
        {/* LEFT: content blocks */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          {contentBlocks.map(renderBlock)}
        </div>

        {/* RIGHT: media blocks */}
        {mediaBlocks.length > 0 && (
          <div
            className="flex items-center"
            style={{ width: "100%" }}
          >
            {mediaBlocks.map(renderBlock)}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero2;

export const defaultContent = {
  badge: "Now in public beta",
  heading: "Build Stunning Websites Faster",
  text: "Launch beautiful modern websites with a powerful drag and drop builder experience built for creators and agencies.",
  primary_button: "Get Started Free",
  secondary_button: "Live Demo",
  footnote: "No credit card required · Free forever plan available",
  media_url: "",
  background_color: "",
  background_image: "",
  layout: [
    "badge",
    "heading",
    "text",
    "buttons",
    "footnote",
    "media",
  ],
};