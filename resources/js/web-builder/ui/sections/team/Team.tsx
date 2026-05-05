import React from "react";

type Props = {
  content: any;
  editing?: boolean;
};

const defaultTeam = [
  { name: "Alex Rivera",  role: "CEO & Co-founder",  avatar: "AR", bio: "10 years building products at Apple and Stripe.", color: "#6366f1" },
  { name: "Jordan Kim",   role: "CTO",                avatar: "JK", bio: "Previously led engineering at Figma.",           color: "#8b5cf6" },
  { name: "Sam Osei",     role: "Head of Design",     avatar: "SO", bio: "Award-winning designer from London.",            color: "#ec4899" },
  { name: "Mia Torres",   role: "Head of Growth",     avatar: "MT", bio: "Grew Notion from 0 to 5M users.",               color: "#f59e0b" },
];

const Team: React.FC<Props> = ({ content, editing }) => {
  const team = content.team || defaultTeam;

  return (
    <section className="section" style={{ background: "var(--color-bg)" }}>
      <div className="container">

        {/* HEADER */}
        <div className="center" >
        <p className="eyebrow">{content.label || "Our Team"}</p>
</div>
        <div className="center" style={{ marginBottom: 60 }}>
       
          <h2 data-edit="heading" className="heading h2" style={{ margin: "0 0 16px" }}>
            {content.heading || "Built by people who care"}
          </h2>
          <p className="text" style={{ maxWidth: 480, margin: "0 auto" }}>
            {content.subheading || "We're a team of designers, engineers, and builders obsessed with the craft."}
          </p>
        </div>

        {/* TEAM GRID */}
        <div
          className="grid gap"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {team.map((m: any, i: number) => (
            <div
              key={i}
              className="card"
              style={{
                padding:    0,
                overflow:   "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform  = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow  = "var(--shadow-lg)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform  = "none";
                (e.currentTarget as HTMLElement).style.boxShadow  = "var(--shadow-sm)";
              }}
            >
              {/* Color bar */}
              <div style={{ height: 100, background: m.color || "var(--color-primary)", opacity: 0.12 }} />

              <div style={{ marginTop: -44, paddingInline: 24, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Avatar */}
                <div style={{
                  width:       72,
                  height:      72,
                  borderRadius:"50%",
                  background:  m.color || "var(--color-primary)",
                  border:      "4px solid var(--color-bg)",
                  display:     "flex",
                  alignItems:  "center",
                  justifyContent: "center",
                  color:       "#fff",
                  fontSize:    22,
                  fontWeight:  700,
                  fontFamily:  "var(--font-heading)",
                  boxShadow:   `0 8px 24px ${m.color}44`,
                }}>
                  {m.avatar || m.name?.slice(0, 2)}
                </div>

                {/* Info */}
                <div style={{ padding: "16px 0 24px" }}>
                  <p className="heading" style={{ fontSize: "var(--text-body)", margin: "0 0 4px" }}>
                    {m.name}
                  </p>
                  <p style={{ fontSize: "var(--text-button)", color: m.color || "var(--color-primary)", fontWeight: 600, margin: "0 0 12px", fontFamily: "var(--font-body)" }}>
                    {m.role}
                  </p>
                  <p className="text" style={{ margin: 0 }}>
                    {m.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;

export const defaultContent = {
  label:     "Our Team",
  heading:   "Built by people who care",
  subheading:"We're a team of designers, engineers, and builders obsessed with the craft.",
  team:      defaultTeam,
};