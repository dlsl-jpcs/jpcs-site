import React from "react";
import StarBorder from "./StarBorder";
import { NavItems } from "./ui/resizable-navbar";


const Navbar = () => {

  const navItems = [
    {
      name: "Home",
      link: "#home",
    },
    {
      name: "Announcements",
      link: "#announcements",
    },
    {
      name: "Officers",
      link: "#officers",
    },
    {
      name: "Resources",
      link: "#resources",
    },
    {
      name: "Gallery",
      link: "#gallery",
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-20 flex justify-between items-center px-12 py-8 bg-transparent">
      {/* Logo */}
      <div className="flex gap-2 items-center ">
        <div className="bg-white rounded-full">
          <img src="/jpcslogo.png" alt="jpcs" className="w-10" />
        </div>
        <p className="font-bold text-light-green text-[20px]">JPCS</p>
      </div>
      {/* Links */}
      <div
        className="flex items-center justify-between px-10 py-3 
        rounded-full border border-white/10 
        bg-white/8 backdrop-blur-md shadow-lg 
        w-[40%] h-13 gap-9 text-white text-[14px]"
      >
        <NavItems items={navItems}/>
      </div>
      {/* Menu and Contact Us */}
      <div>
        <StarBorder
          as="button"
          className="custom-class"
          color="white"
          speed="5s"
        >
          Contact Us
        </StarBorder>
      </div>
    </div>
  );
};

export default Navbar;
