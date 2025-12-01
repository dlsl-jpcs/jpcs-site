"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image"; 
import StarBorder from "./StarBorder";
import { NavItems } from "./ui/resizable-navbar";
import { StaggeredMenu } from "./StaggeredMenu";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handleLinkClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.getAttribute("href")?.startsWith("#")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleLinkClick);
    document.addEventListener("touchstart", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      document.removeEventListener("touchstart", handleLinkClick);
    };
  }, [menuOpen]);

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "Announcements", link: "#announcements" },
    { name: "Officers", link: "#officers" },
    { name: "Resources", link: "#resources" },
    { name: "Gallery", link: "#gallery" },
  ];

  const menuItems = [
    { label: "Home", ariaLabel: "Navigate to Home section", link: "#home" },
    {
      label: "Announcements",
      ariaLabel: "Navigate to Announcements section",
      link: "#announcements",
    },
    {
      label: "Officers",
      ariaLabel: "Navigate to Officers section",
      link: "#officers",
    },
    {
      label: "Resources",
      ariaLabel: "Navigate to Resources section",
      link: "#resources",
    },
    {
      label: "Gallery",
      ariaLabel: "Navigate to Gallery section",
      link: "#gallery",
    },
  ];

  const socialItems = [
    { label: "Facebook", link: "https://facebook.com/jpcs" },
    { label: "Instagram", link: "https://instagram.com/jpcs" },
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
              priority // Above-the-fold image → loads immediately
            />
          </div>
          <p className="font-bold text-light-green text-[20px]">JPCS</p>
        </div>

        {/* Navigation Links */}
        <div
          className="flex items-center justify-between px-10 py-3 
          rounded-full border border-white/10 
          bg-white/8 backdrop-blur-md shadow-lg 
          min-w-[550px] h-13 gap-9 text-white text-[14px] pointer-events-auto"
        >
          <NavItems items={navItems} />
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
          items={menuItems}
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
