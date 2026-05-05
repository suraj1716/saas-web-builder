import React from "react";

type Props = {
  content: any;
  editing?: boolean;
};

const Hero: React.FC<Props> = ({ content, editing }) => {
  const defaultLayout = ["heading", "text", "buttons", "media"];

  const layout = content?.layout?.length ? content.layout : defaultLayout;

  const renderBlock = (block: string) => {
    /* ================= HEADING ================= */
    if (block.startsWith("heading")) {
      return (
        <h1
          key={block}
          className="heading h1"
          data-block={block}
          data-edit={block}
          draggable={editing}
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
        >
          {content[block] ||
            content.text ||
            "Launch beautiful modern websites with powerful drag and drop builder experience built for creators and agencies."}
        </p>
      );
    }

    /* ================= BUTTONS ================= */
    if (block.startsWith("buttons")) {
      return (
        <div
          key={block}
          className="flex items-center"
          data-block={block}
          style={{ gap: "var(--space-md)", width: "fit-content" }}
        >
          <button className="button">
            {content.primary_button || "Get Started"}
          </button>
          <button className="button button-outline">
            {content.secondary_button || "Live Demo"}
          </button>
        </div>
      );
    }

    /* ================= MEDIA ================= */
    if (block.startsWith("media")) {
      return (
        <div
          key={block}
          data-block={block}
          data-edit-media
          draggable={editing}
        >
          {content.media_url ? (
            <img src={content.media_url} className="media card" alt="Hero" />
          ) : (
            <div className="card center text">No Image</div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <section className="section">
      <div className="container about-container">

        {/* LEFT — text content */}
        <div
          className="flex"
          style={{ flexDirection: "column", gap: "var(--space-md)" }}
        >
          {layout
            .filter((b: string) => !b.startsWith("media"))
            .map((block: string) => (
              <div key={block}>{renderBlock(block)}</div>
            ))}
        </div>

        {/* RIGHT — media */}
        <div className="flex items-center">
          {layout.filter((b: string) => b.startsWith("media")).map(renderBlock)}
        </div>

      </div>
    </section>
  );
};

export default Hero;

export const defaultContent = {
  heading: "Build Stunning Websites Faster",
  text: "Launch beautiful modern websites with powerful drag and drop builder experience built for creators and agencies.",
  primary_button: "Get Started",
  secondary_button: "Live Demo",
  media_url: "",
  layout: ["heading", "text", "buttons", "media"],
};