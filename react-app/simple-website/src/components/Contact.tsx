import React from "react";

type Props = {
  content: {
    email: string
  };
};

const Contact: React.FC<Props> = ({ content }) => {
  return (
    <section className="contact">
      <p>{content.email}</p>
    </section>
  );
};

export default Contact;
