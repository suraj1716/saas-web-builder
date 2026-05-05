import React from "react";

type Props = {
  content: {
    title: string
  };
};

const Navbar: React.FC<Props> = ({ content }) => {
  return (
    <section className="navbar">
      <p>{content.title}</p>
    </section>
  );
};

export default Navbar;
