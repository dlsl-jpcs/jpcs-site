import React from "react";
import ProgramsUnder from "./ProgramsUnder";
import Main from "./Main";

const About = () => {
  return (
    <div
      id="about"
      className="relative w-screen min-h-screen bg-background overflow-hidden"
    >
      <Main />

      <ProgramsUnder />
    </div>
  );
};

export default About;
