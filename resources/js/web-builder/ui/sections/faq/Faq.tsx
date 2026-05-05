import React, { useState } from "react";

type Props = {
  content: any;
  editing?: boolean;
};

const defaultFaqs = [
  { question: "Do I need to know how to code?",  answer: "Not at all. Our visual editor lets you build complete websites without writing a single line of code. Everything is drag and drop." },
  { question: "Can I use my own domain name?",   answer: "Yes! You can connect any custom domain to your site. We also offer free subdomains on all plans while you get started." },
  { question: "Is there a free plan?",           answer: "Absolutely. Our Starter plan is free forever with no credit card required. Upgrade anytime as your needs grow." },
  { question: "Can I export my website?",        answer: "Pro and Agency plans include HTML export so you can host your site anywhere you like." },
  { question: "How does billing work?",          answer: "We bill monthly or annually. Annual plans come with a 20% discount. You can cancel anytime with no questions asked." },
  { question: "Do you offer refunds?",           answer: "Yes. If you're not happy within the first 14 days, we'll refund your payment in full, no questions asked." },
];

const FAQ: React.FC<Props> = ({ content, editing }) => {
  const defaultLayout = defaultFaqs.map((_, i) => `faq-${i}`);
  const layout = content?.layout?.length ? content.layout : defaultLayout;

  const [open, setOpen] = useState<number | null>(null);

  const renderBlock = (block: string, index: number) => {
    if (!block.startsWith("faq")) return null;

    const data = content[block] || defaultFaqs[index] || {
      question: "New question",
      answer:   "New answer",
    };

    return (
      <div
        key={block}
        data-block={block}
        draggable={editing}
        style={{ borderBottom: "1px solid var(--color-border)", overflow: "hidden" }}
      >
        <button
          onClick={() => setOpen(open === index ? null : index)}
          style={{
            width:          "100%",
            textAlign:      "left",
            padding:        "22px 0",
            background:     "none",
            border:         "none",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            16,
            cursor:         "pointer",
          }}
        >
          <span
            data-edit={`${block}.question`}
            className="heading"
            style={{ fontSize: "var(--text-body)", lineHeight: 1.4 }}
          >
            {data.question}
          </span>

          {/* Toggle indicator — colour-switches on open, no token equivalent */}
          <span style={{
            width:           28,
            height:          28,
            borderRadius:    "50%",
            flexShrink:      0,
            background:      open === index ? "var(--color-primary)" : "var(--color-surface)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            fontSize:        16,
            color:           open === index ? "#fff" : "var(--color-text-light)",
            transition:      "all 0.2s",
          }}>
            {open === index ? "−" : "+"}
          </span>
        </button>

        <div style={{ maxHeight: open === index ? 400 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
          <p
            data-edit={`${block}.answer`}
            className="text"
            style={{ paddingBottom: 22, margin: 0 }}
          >
            {data.answer}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="section" style={{ background: "var(--color-surface)" }}>
      <div className="container">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* HEADER */}
          <div className="center" style={{ marginBottom: 56 }}>
            <p className="eyebrow">
              {content.label || "FAQ"}
            </p>
            <h2
              data-edit="heading"
              className="heading h1"
              style={{ margin: "0 0 16px" }}
            >
              {content.heading || "Frequently asked questions"}
            </h2>
            <p data-edit="subheading" className="text">
              {content.subheading || "Can't find what you're looking for? Reach out to our support team."}
            </p>
          </div>

          {/* FAQ BLOCKS */}
          <div className="flex" style={{ flexDirection: "column", gap: 10 }}>
            {layout.map((block: string, i: number) => renderBlock(block, i))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;

export const defaultContent = {
  label:     "FAQ",
  heading:   "Frequently asked questions",
  subheading:"Can't find what you're looking for? Reach out to our support team.",
  layout:    defaultFaqs.map((_, i) => `faq-${i}`),
  ...Object.fromEntries(defaultFaqs.map((f, i) => [`faq-${i}`, { question: f.question, answer: f.answer }])),
};