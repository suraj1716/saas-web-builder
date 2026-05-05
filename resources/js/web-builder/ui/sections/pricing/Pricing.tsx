import React from "react";

type Props = {
  content: any;
  editing?: boolean;
};

const defaultPlans = [
  {
    name: "Starter", price: "0",  period: "/mo", badge: "",
    description: "Perfect for personal projects and exploring the platform.",
    features: ["3 websites", "5GB bandwidth", "Custom domain", "SSL certificate", "Community support"],
    cta: "Get Started Free", highlighted: false,
  },
  {
    name: "Pro",     price: "29", period: "/mo", badge: "Most Popular",
    description: "For freelancers and small teams building client sites.",
    features: ["Unlimited websites", "100GB bandwidth", "Custom domains", "SSL certificate", "Priority support", "Analytics dashboard", "Remove branding"],
    cta: "Start Free Trial", highlighted: true,
  },
  {
    name: "Agency",  price: "99", period: "/mo", badge: "",
    description: "For agencies managing multiple clients at scale.",
    features: ["Unlimited websites", "1TB bandwidth", "White labeling", "Team collaboration", "Dedicated support", "Custom integrations", "SLA guarantee"],
    cta: "Contact Sales", highlighted: false,
  },
];

const Pricing: React.FC<Props> = ({ content, editing }) => {
  const plans = content.plans || defaultPlans;

  return (
    <section className="section" style={{ background: "var(--color-surface)" }}>
      <div className="container">

        {/* HEADER */}
        
        <div
  className="center"
  style={{
    marginBottom: 64,
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // or "flex-start" if you want left aligned
    gap: 8,
  }}
>
  <p className="eyebrow">{content.label || "Pricing"}</p>

  <h2
    data-edit="heading"
    className="heading h2"
    style={{ margin: 0 }}
  >
    {content.heading || "Simple, transparent pricing"}
  </h2>

  <p data-edit="subheading" className="text" style={{ margin: 0 }}>
    {content.subheading || "No hidden fees. Cancel anytime."}
  </p>
</div>

        {/* PLANS GRID */}
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--gap)", alignItems: "center" }}
        >
          {plans.map((plan: any, i: number) => (
            <div
              key={i}
              className={plan.highlighted ? "" : "card"}
              style={{
                borderRadius: "var(--radius-lg)",
                padding:      plan.highlighted ? "40px 32px" : "32px",
                background:   plan.highlighted ? "#0f0f11" : undefined,
                boxShadow:    plan.highlighted ? "0 24px 80px rgba(0,0,0,0.2)" : undefined,
                position:     "relative",
                transform:    plan.highlighted ? "scale(1.04)" : "none",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position:        "absolute",
                  top:             -14,
                  left:            "50%",
                  transform:       "translateX(-50%)",
                  background:      "var(--color-primary)",
                  color:           "#fff",
                  fontSize:        11,
                  fontWeight:      700,
                  letterSpacing:   "0.08em",
                  padding:         "5px 16px",
                  borderRadius:    100,
                  whiteSpace:      "nowrap",
                  fontFamily:      "var(--font-body)",
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <p style={{
                fontSize:       "var(--text-button)",
                fontWeight:     700,
                letterSpacing:  "0.05em",
                textTransform:  "uppercase",
                color:          plan.highlighted ? "rgba(255,255,255,0.5)" : "var(--color-muted)",
                marginBottom:   8,
                fontFamily:     "var(--font-body)",
              }}>
                {plan.name}
              </p>

              {/* Price */}
              <div className="flex items-center" style={{ gap: 2, marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: plan.highlighted ? "rgba(255,255,255,0.5)" : "var(--color-text-light)" }}>$</span>
                <span style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", color: plan.highlighted ? "#fff" : "var(--color-text)" }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 14, color: plan.highlighted ? "rgba(255,255,255,0.4)" : "var(--color-muted)" }}>
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p style={{
                fontSize:    "var(--text-button)",
                color:       plan.highlighted ? "rgba(255,255,255,0.5)" : "var(--color-text-light)",
                marginBottom: 28,
                lineHeight:  "var(--line-height)",
                fontFamily:  "var(--font-body)",
              }}>
                {plan.description}
              </p>

              {/* CTA */}
              <button
                className={plan.highlighted ? "button button-full" : "button button-full button-outline"}
                style={plan.highlighted ? { marginBottom: 28 } : { marginBottom: 28, background: "var(--color-surface)", color: "var(--color-text)" }}
              >
                {plan.cta}
              </button>

              {/* Feature list */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {plan.features.map((f: string, j: number) => (
                  <li
                    key={j}
                    className="flex items-center"
                    style={{ gap: 10, fontSize: "var(--text-button)", color: plan.highlighted ? "rgba(255,255,255,0.7)" : "var(--color-text)", fontFamily: "var(--font-body)" }}
                  >
                    <span style={{
                      width:           18,
                      height:          18,
                      borderRadius:    "50%",
                      flexShrink:      0,
                      background:      plan.highlighted ? "rgba(255,255,255,0.1)" : "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      fontSize:        10,
                      color:           plan.highlighted ? "#fff" : "var(--color-primary)",
                    }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Pricing;

export const defaultContent = {
  label:     "Pricing",
  heading:   "Simple, transparent pricing",
  subheading:"No hidden fees. Cancel anytime.",
  plans:     defaultPlans,
};