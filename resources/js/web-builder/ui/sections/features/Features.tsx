import React from "react";

type Props = {
  content: any;
  editing?: boolean;
};

const defaultFeatures = [
  { icon: "⚡", title: "Blazing Fast",       description: "Built on modern infrastructure. Pages load in milliseconds, keeping your visitors engaged." },
  { icon: "🎨", title: "Visual Editor",      description: "Drag, drop, and style everything without writing a single line of code." },
  { icon: "📱", title: "Mobile First",       description: "Every section is responsive by default. Looks perfect on all devices." },
  { icon: "🔒", title: "Secure by Default",  description: "SSL, DDoS protection, and enterprise-grade security out of the box." },
  { icon: "🌐", title: "Global CDN",         description: "Deploy to 200+ edge locations worldwide. Fast everywhere, always." },
  { icon: "🔌", title: "100+ Integrations",  description: "Connect to your favorite tools — Stripe, Mailchimp, HubSpot, and more." },
];

const Features: React.FC<Props> = ({ content, editing }) => {
  const defaultLayout = [
    "label",
    "heading",
    "subheading",
    ...defaultFeatures.map((_, i) => `feature-${i}`),
  ];

  const layout = content?.layout?.length ? content.layout : defaultLayout;

  const renderBlock = (block: string) => {

    /* ================= LABEL ================= */
    if (block.startsWith("label")) {
      return (
        <p key={block} data-block={block} data-edit={block} draggable={editing} className="eyebrow">
          {content[block] ?? content.label ?? "Features"}
        </p>
      );
    }

    /* ================= HEADING ================= */
    if (block.startsWith("heading")) {
      return (
        <h2 key={block} data-block={block} data-edit={block} draggable={editing} className="heading h1">
          {content[block] ?? content.heading ?? "Everything you need to succeed"}
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
          className="text"
          style={{ maxWidth: 540 }}
        >
          {content[block] ?? content.subheading ?? "Powerful features that help you build, launch, and grow faster."}
        </p>
      );
    }

    /* ================= FEATURE CARD ================= */
    if (block.startsWith("feature-")) {
      const fallbackIndex = parseInt(block.split("-")[1] || "0", 10);
      const data = content[block] || defaultFeatures[fallbackIndex] || {
        icon: "✨", title: "New Feature", description: "Describe your feature",
      };

      return (
        <div
          key={block}
          data-block={block}
          draggable={editing}
          className="card"
          style={{ padding: 32, transition: "box-shadow 0.2s, transform 0.2s" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
            (e.currentTarget as HTMLElement).style.transform = "none";
          }}
        >
          {/* Icon */}
          <div
            data-edit={`${block}.icon`}
            style={{
              width:           48,
              height:          48,
              borderRadius:    "var(--radius-md)",
              background:      "color-mix(in srgb, var(--color-primary) 8%, transparent)",
              border:          "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              fontSize:        22,
              marginBottom:    "var(--space-md)",
            }}
          >
            {data.icon}
          </div>

          {/* Title */}
          <h3 data-edit={`${block}.title`} className="heading h3" style={{ margin: "0 0 10px", color: "var(--color-text)" }}>
            {data.title}
          </h3>

          {/* Description */}
          <p data-edit={`${block}.description`} className="text" style={{ margin: 0 }}>
            {data.description}
          </p>
        </div>
      );
    }

    return null;
  };

  const headerBlocks  = layout.filter((b: string) => b.startsWith("label") || b.startsWith("heading") || b.startsWith("subheading"));
  const featureBlocks = layout.filter((b: string) => b.startsWith("feature-"));

  return (
    <section
      className="section"
      style={{
        background:         content.background_color || "var(--color-bg)",
        backgroundImage:    content.background_image ? `url(${content.background_image})` : undefined,
        backgroundSize:     "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">

        {/* HEADER */}
        <div
          className="flex center"
          style={{ flexDirection: "column", gap: "var(--space-md)", alignItems: "center", marginBottom: 64 }}
        >
          {headerBlocks.map(renderBlock)}
        </div>

        {/* GRID */}
        <div
          className="grid gap"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {featureBlocks.map(renderBlock)}
        </div>

      </div>
    </section>
  );
};

export default Features;

export const defaultContent = {
  label:      "Features",
  heading:    "Everything you need to succeed",
  subheading: "Powerful features that help you build, launch, and grow faster.",
  layout: [
    "label", "heading", "subheading",
    ...defaultFeatures.map((_, i) => `feature-${i}`),
  ],
  ...Object.fromEntries(defaultFeatures.map((f, i) => [`feature-${i}`, { icon: f.icon, title: f.title, description: f.description }])),
  background_color: "var(--color-bg)",
  background_image: "",
};