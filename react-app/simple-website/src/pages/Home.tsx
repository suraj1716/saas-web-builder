import Hero from "../components/Hero";
import About from "../components/About";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import React from "react";

export default function Home() {
  return (
    <div>
      <Navbar content={{"title":"My Simple Site"}} />
      
      <Hero content={{ heading: "Welcome to Simple Website" }} />
      <About content={{ heading: "About Our Company", subheading: "Who we are & what we do", text: "We are a team of passionate developers and designers dedicated to building modern websites. Our goal is to deliver exceptional user experiences through clean design and innovative solutions.", imageUrl: "https://via.placeholder.com/500x400" }} />
      <Footer content={{"copyright":"© 2026"}} />
    </div>
  );
}
