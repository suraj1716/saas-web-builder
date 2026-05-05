import React from "react";

type Props = {
  content: {
    copyright: string
  };
};

const Footer: React.FC<Props> = ({ content }) => {
  return (
    <section className="footer">
      <p>{content.copyright}</p>
    </section>
  );
};

export default Footer;
