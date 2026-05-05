import React from "react";

type Props = {
  content: any;
};

const About: React.FC<Props> = ({ content }) => {
  return (
    <section className="section about">

      <div className="container grid gap items-center">

        {/* TEXT */}
        <div>

          {/* Badge */}
          <div
            data-edit="badge"
            style={{
              display: "inline-block",
              padding: "var(--space-xs) var(--space-sm)",
              background: "var(--color-surface)",
              borderRadius: "999px",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-sm)",
              color: "var(--color-primary)",
            }}
          >
            {content.badge || "About"}
          </div>

          <h2 className="heading h2" data-edit="heading">
            {content.heading || "We build modern digital experiences"}
          </h2>

          <h3 className="heading h3 text-muted" data-edit="subheading">
            {content.subheading || "Who we are"}
          </h3>

          <p className="text" data-edit="text">
            {content.text ||
              "We help businesses grow by creating clean, modern, and high-performing digital experiences."}
          </p>

          {content.cta && (
            <a href="#" className="button" data-edit="cta">
              {content.cta}
            </a>
          )}

        </div>

        {/* IMAGE */}
        <div className="flex-1" data-edit-media="media_url">

          {content.media_url ? (
            <img
              src={content.media_url}
              className="media"
            />
          ) : (
            <div className="card center text-muted">
              No Image
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default About;