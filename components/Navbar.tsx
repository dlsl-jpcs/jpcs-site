"use client";

import React, { useState } from "react";
import Image from "next/image";
import StarBorder from "./StarBorder";
import { NavItems } from "./ui/resizable-navbar";
import { StaggeredMenu } from "./StaggeredMenu";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith("#")) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "About", link: "#about" },
    { name: "Officers", link: "#officers" },
    { name: "Projects", link: "#projects" },
    { name: "Gallery", link: "#gallery" },
  ];

  const menuItems = [
    { label: "Home", ariaLabel: "Navigate to Home section", link: "#home" },
    {
      label: "About",
      ariaLabel: "Navigate to About section",
      link: "#about",
    },
    {
      label: "Officers",
      ariaLabel: "Navigate to Officers section",
      link: "#officers",
    },
    {
      label: "Projects",
      ariaLabel: "Navigate to Projects section",
      link: "#projects",
    },
    {
      label: "Gallery",
      ariaLabel: "Navigate to Gallery section",
      link: "#gallery",
    },
  ];

  const socialItems = [
    { label: "Facebook", link: "https://www.facebook.com/JPCS.DLSL" },
    { label: "Instagram", link: "https://www.instagram.com/jpcsdlsl" },
    { label: "Twitter", link: "https://twitter.com/jpcs" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 hidden lg:flex justify-between items-center px-12 py-8 bg-transparent pointer-events-none">
        {/* Logo */}
        <div className="flex gap-2 items-center pointer-events-auto">
          <div className="relative bg-white rounded-full w-10 h-10">
            <Image
              src="/jpcslogo.png"
              alt="JPCS Logo"
              width={40}
              height={40}
              className="rounded-full object-cover"
              priority
            />
          </div>
          <p className="font-bold text-light-green text-[20px]">JPCS</p>
        </div>

        {/* Navigation Links */}
        <div
          className="flex items-center justify-between px-10 py-3 
          rounded-full border border-white/10 
          bg-[#1D1D1D]/80 backdrop-blur-md shadow-lg 
          min-w-[525px] h-13 gap-10 text-white text-[14px] pointer-events-auto"
        >
          <NavItems
            items={navItems}
            onItemClick={(link: string) => scrollToSection(link)} 
          />
        </div>

        <div className="pointer-events-auto">
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

      <div className="lg:hidden">
        <StaggeredMenu
          position="right"
          colors={["#1a1a1a", "#2d2d2d", "#1a1a1a"]}
          items={menuItems.map((item) => ({
            ...item,
            onClick: () => {
              scrollToSection(item.link);
            },
          }))}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          logoUrl="/jpcslogo.png"
          menuButtonColor="#ffffff"
          openMenuButtonColor="#000000"
          accentColor="#48bb78"
          isFixed={true}
          changeMenuColorOnOpen={true}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
        />
      </div>
    </>
  );
};

export default Navbar;
