import Contact from "../components/Contact";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import React from "react";

export default function Contact() {
  return (
    <div>
      <Navbar content={{"title":"My Simple Site"}} />
      
      <Contact content={{ email: "info@simple.com" }} />
      <Footer content={{"copyright":"© 2026"}} />
    </div>
  );
}
