"use client";

import React, { useState, useEffect, useCallback } from "react";
import { NavItems } from "./ui/resizable-navbar";
import { StaggeredMenu } from "./StaggeredMenu";
import Image from "next/image";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);

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

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 10) {
      setShowNavbar(true);
      setLastScrollY(currentScrollY);
      return;
    }

    if (currentScrollY < lastScrollY) {
      setShowNavbar(true);
    } else if (currentScrollY > lastScrollY + 50) {
      setShowNavbar(false);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "About", link: "#about" },
    { name: "Officers", link: "#officers" },
    { name: "Projects", link: "#projects" },
    { name: "Gallery", link: "#gallery" },
  ];

  const menuItems = [
    { label: "Home", ariaLabel: "Navigate to Home section", link: "#home" },
    { label: "About", ariaLabel: "Navigate to About section", link: "#about" },
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
      <div
        className={`fixed top-6 left-0 w-full z-50 hidden lg:flex justify-center items-center px-12 bg-transparent pointer-events-none transition-transform duration-500 ease-in-out ${
          showNavbar ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-7xl">
          {/* Logo Area */}
          <div className="flex gap-3 items-center pointer-events-auto">
            <div className="relative bg-white rounded-full w-12 h-12 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Image
                src="/jpcslogo.png"
                alt="JPCS Logo"
                width={48}
                height={48}
                className="rounded-full object-cover p-1"
                priority
              />
            </div>
            <p className="font-extrabold text-white text-[22px] tracking-tight">
              JPCS<span className="text-neon">.</span>
            </p>
          </div>

          {/* Center Nav Pill */}
          <div
            className="flex items-center justify-center px-8 py-3 
            rounded-full border border-white/10 
            bg-charcoal/60 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] 
            min-w-[450px] gap-8 text-white font-medium pointer-events-auto"
          >
            <NavItems
              items={navItems}
              onItemClick={(link: string) => scrollToSection(link)}
            />
          </div>

          {/* CTA Area */}
          <div className="pointer-events-auto">
            <button className="bg-neon text-navy px-8 py-3.5 rounded-full font-extrabold text-sm hover:bg-neon-hover hover:-translate-y-1 transition-all duration-300 shadow-[0_0_30px_rgba(196,255,71,0.25)]">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <StaggeredMenu
          position="right"
          colors={["#0B132B", "#111111", "#1A1A1A"]}
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
          menuButtonColor="#C4FF47"
          openMenuButtonColor="#FFFFFF"
          accentColor="#C4FF47"
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
