import React from "react";

type Props = {
  content: any;
  editing?: boolean;
};

const About: React.FC<Props> = ({ content, editing }) => {
  const defaultLayout = ["badge", "heading", "subheading", "text", "cta", "media"];
  const layout = content?.layout?.length ? content.layout : defaultLayout;

  const renderBlock = (block: string) => {

    /* ================= BADGE ================= */
    if (block.startsWith("badge")) {
      return (
        <p
          key={block}
          data-block={block}
          data-edit={block}
          draggable={editing}
          className="eyebrow"
        >
          {content[block] ?? content.badge ?? "About"}
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
          className="heading h1"
        >
          {content[block] ?? content.heading ?? "We build modern digital experiences"}
        </h2>
      );
    }

    /* ================= SUBHEADING ================= */
    if (block.startsWith("subheading")) {
      return (
        <p
          key={block}
          data-block={block}
          data-edit={block}
          draggable={editing}
          className="h3 heading"
        >
          {content[block] ?? content.subheading ?? "Who we are"}
        </p>
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
        >
          {content[block] ?? content.text ?? "We help businesses grow by creating clean, modern experiences."}
        </p>
      );
    }

    /* ================= CTA ================= */
    if (block.startsWith("cta")) {
      return (
        <div key={block} data-block={block} draggable={editing} style={{ width: "fit-content" }}>
          <button data-edit={block} className="button">
            {content[block] ?? content.cta ?? "Learn More"}
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
          data-edit-media="media_url"
          draggable={editing}
          style={{ width: "100%", height: "100%" }}
        >
          {content.media_url ? (
            <img
              src={content.media_url}
              className="media"
              alt="About section"
            />
          ) : (
            <div className="card center text" style={{ aspectRatio: "1" }}>
              No Image
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const contentBlocks = layout.filter((b: string) => !b.startsWith("media"));
  const mediaBlocks   = layout.filter((b: string) =>  b.startsWith("media"));

  return (
    <section
      className="section"
      style={{
        background:         content.background_color || "#fff",
        backgroundImage:    content.background_image ? `url(${content.background_image})` : undefined,
        backgroundSize:     "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="container about-container"
        style={{ gridTemplateColumns: mediaBlocks.length > 0 ? "1fr 1fr" : "1fr" }}
      >
        <div className="flex" style={{ flexDirection: "column", gap: "var(--space-lg)" }}>
          {contentBlocks.map(renderBlock)}
        </div>

        {mediaBlocks.length > 0 && (
          <div style={{ width: "100%" }}>
            {mediaBlocks.map(renderBlock)}
          </div>
        )}
      </div>
    </section>
  );
};

export default About;

export const defaultContent = {
  badge:            "About",
  heading:          "We build modern digital experiences",
  subheading:       "Who we are",
  text:             "We help businesses grow by creating clean, modern experiences.",
  cta:              "Learn More",
  media_url:        "",
  background_color: "#fff",
  background_image: "",
  layout:           ["badge", "heading", "subheading", "text", "cta", "media"],
};