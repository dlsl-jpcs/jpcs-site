import React from "react";
import StarBorder from "./StarBorder";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center w-full">
      {/* logo */}
      <div className="flex gap-2 items-center">
        <img src="/jpcslogo.png" alt="jpcs" className="w-10" />

        <p className="font-bold text-light-green text-[20px] ">JPCS</p>
      </div>
      {/* links */}
      <div
        className="flex items-center justify-between px-10 py-3 
  rounded-full border border-white/10 
  bg-white/8 backdrop-blur-md shadow-lg 
  max-w-3xl mx-auto gap-9 text-white text-[14px]"
      >
        <a href="" className="hover:text-gray-300 transition">
          Home
        </a>
        <a href="" className="hover:text-gray-300 transition">
          Announcements
        </a>
        <a href="" className="hover:text-gray-300 transition">
          Officers
        </a>
        <a href="" className="hover:text-gray-300 transition">
          Resources
        </a>
        <a href="" className="hover:text-gray-300 transition">
          Gallery
        </a>
      </div>

      {/* menu and contact us */}
      <div>
        <StarBorder
          as="button"
          className="custom-class "
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
