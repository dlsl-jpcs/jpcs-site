import React from "react";
import ProgramsUnder from "./ProgramsUnder";
import Main from "./Main";
import MissionVision from "./MissionVision";

const About = () => {
  return (
    <div
      id="about"
      className="relative w-full bg-white text-charcoal overflow-hidden selection:bg-neon selection:text-navy"
    >
      <Main />
      <MissionVision />
      <ProgramsUnder />
    </div>
  );
};

export default About;
