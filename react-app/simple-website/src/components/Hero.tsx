import React from "react";

type Props = {
  content: {
    heading: string
  };
};

const Hero: React.FC<Props> = ({ content }) => {
  return (
    <section className="hero">
      <h1>{content.heading}</h1>
    </section>
  );
};

export default Hero;
