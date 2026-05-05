import React from "react";

type Props = {
  content: any;
  editing?: boolean;
};

const defaultStats = [
  { value: "50K+", label: "Websites built" },
  { value: "99.9%", label: "Uptime guarantee" },
  { value: "2.4M", label: "Pages published" },
  { value: "140+", label: "Countries reached" },
];


const Stats: React.FC<Props> = ({ content, editing }) => {
  const stats = content.stats || defaultStats;

  return (
    <section
      style={{
        padding: "clamp(50px, 8vw, 100px) clamp(20px, 6vw, 80px)",
        background: content.background_color || "#0f0f11",
        backgroundImage: content.background_image ? `url(${content.background_image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2
            data-block="heading"
            data-edit="heading"
            draggable={editing}
            style={{
              fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.03em",
              color: "#fff", margin: "0 0 12px",
            }}
          >
            {content.heading || "Trusted by the world's best teams"}
          </h2>
          <p
            data-block="subheading"
            data-edit="subheading"
            draggable={editing}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.4)" }}
          >
            {content.subheading || "Real numbers from real customers."}
          </p>
        </div>

        {/* STATS GRID */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2, borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {stats.map((s: any, i: number) => (
            <div
              key={i}
              data-block={`stat_${i}`}
              draggable={editing}
              style={{
                padding: "40px 32px", textAlign: "center",
                background: "rgba(255,255,255,0.025)",
                borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <p
                data-edit={`stat_${i}_value`}
                style={{
                  fontSize: "clamp(2.2rem,4vw,3.5rem)", fontWeight: 900,
                  letterSpacing: "-0.04em", margin: "0 0 8px",
                  background: "linear-gradient(135deg,#fff,rgba(255,255,255,0.6))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </p>
              <p
                data-edit={`stat_${i}_label`}
                style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0, fontWeight: 500 }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

export const defaultContent = {
  heading: "Trusted by the world's best teams",
  subheading: "Real numbers from real customers.",
  stats: defaultStats,
  background_color: "#0f0f11",
  background_image: "",
};