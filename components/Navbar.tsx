"use client";

// toggle once gallery ready

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/adminPath";

const StaggeredMenu = dynamic(
  () => import("./StaggeredMenu").then((mod) => mod.StaggeredMenu),
  { ssr: false },
);

const NAV_ITEMS = [
  { name: "Home", link: "#home" },
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  //{ name: "Gallery", link: "#gallery" },
  { name: "Officers", link: "#officers" },
];

const SOCIAL_ITEMS = [
  { label: "Facebook", link: "https://www.facebook.com/JPCS.DLSL" },
  { label: "Instagram", link: "https://www.instagram.com/jpcsdlsl" },
];

// Sections tracked for the active nav pill; #contact has no pill, so none is highlighted there.
const SPY_TARGETS = [...NAV_ITEMS.map((item) => item.link), "#contact"];

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [navTheme, setNavTheme] = useState<"dark" | "light">("dark");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeLink, setActiveLink] = useState("#home");
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const showNavbarRef = useRef(true);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isProgramPage = pathname.startsWith("/programs/");

  const navItems = NAV_ITEMS;
  const socialItems = SOCIAL_ITEMS;
  const activeIndex = navItems.findIndex((item) => item.link === activeLink);
  const pillIndex = hoveredIndex ?? (activeIndex >= 0 ? activeIndex : null);

  const scrollToSection = (sectionId: string) => {
    if (!sectionId.startsWith("#")) return;
    if (pathname !== "/") {
      router.push(`/${sectionId}`);
      return;
    }
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const updateNavbarVisibility = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const delta = currentScrollY - lastScrollY;

      let nextShowNavbar = showNavbarRef.current;

      // Keep navbar visible near the top for predictable navigation.
      if (currentScrollY <= 24) {
        nextShowNavbar = true;
      } else if (delta > 6 && currentScrollY > 120) {
        // Hide while scrolling down.
        nextShowNavbar = false;
      } else if (delta < -6) {
        // Reveal quickly while scrolling up.
        nextShowNavbar = true;
      }

      setShowNavbar((prev) => {
        if (prev === nextShowNavbar) return prev;
        showNavbarRef.current = nextShowNavbar;
        return nextShowNavbar;
      });
      lastScrollYRef.current = currentScrollY;

      // Active section: the last one whose top has passed 35% of the viewport.
      const probe = window.innerHeight * 0.35;
      let current = SPY_TARGETS[0];
      for (const id of SPY_TARGETS) {
        const el = document.querySelector(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      setActiveLink((prev) => (prev === current ? prev : current));

      tickingRef.current = false;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(updateNavbarVisibility);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section"));
    if (!sections.length) return;

    const visibleSections = new Map<Element, IntersectionObserverEntry>();

    const getThemeFromSection = (sec: Element) => {
      const className = sec.className;
      if (typeof className === "string") {
        if (
          className.includes("bg-white") ||
          className.includes("bg-[#F4F4F5]")
        ) {
          return "light" as const;
        }
      }
      return "dark" as const;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target, entry);
          } else {
            visibleSections.delete(entry.target);
          }
        }

        let activeEntry: IntersectionObserverEntry | null = null;
        for (const entry of visibleSections.values()) {
          if (
            !activeEntry ||
            entry.intersectionRatio > activeEntry.intersectionRatio
          ) {
            activeEntry = entry;
          }
        }

        const nextTheme = activeEntry
          ? getThemeFromSection(activeEntry.target)
          : "dark";

        setNavTheme((prev) => (prev === nextTheme ? prev : nextTheme));
      },
      {
        root: null,
        threshold: [0.15, 0.3, 0.6],
        rootMargin: "-80px 0px -60% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        className={`fixed top-8 left-0 w-full z-50 hidden lg:flex justify-center items-center px-12 bg-transparent pointer-events-none transition-transform duration-500 ease-in-out ${
          showNavbar ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
        }`}
        style={{
          transitionDuration: "650ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex items-center justify-between w-full max-w-7xl">
          <button
            type="button"
            aria-label="JPCS, back to top"
            className="flex gap-3 items-center pointer-events-auto cursor-pointer group rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon"
            onClick={() => {
              // A single click scrolls home; three quick clicks open the admin sign-in.
              clickCountRef.current += 1;
              if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
              if (clickCountRef.current === 3) {
                clickCountRef.current = 0;
                router.push(ADMIN_LOGIN_PATH);
                return;
              }
              // On the home page scroll right away; elsewhere navigating would unmount
              // this navbar mid-sequence, so wait to see whether more clicks follow.
              const onHome = pathname === "/";
              if (onHome && clickCountRef.current === 1) scrollToSection("#home");
              clickTimeoutRef.current = setTimeout(() => {
                clickCountRef.current = 0;
                if (!onHome) scrollToSection("#home");
              }, 450);
            }}
          >
            <div className="relative bg-white rounded-full w-14 h-14 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/jpcslogo.png"
                alt="JPCS Logo"
                width={56}
                height={56}
                className="rounded-full object-cover p-0.3"
                sizes="56px"
                quality={70}
              />
            </div>
            <p
              className={`font-extrabold text-2xl tracking-tight transition-colors duration-500 ${
                navTheme === "light" ? "text-navy" : "text-white"
              }`}
            >
              JPCS<span className="text-neon">.</span>
            </p>
          </button>

          {!isProgramPage && (
            <div
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-center p-2 rounded-full border backdrop-blur-2xl font-bold pointer-events-auto transition-all duration-500 ${
                navTheme === "light"
                  ? "bg-white/40 border-navy/10 shadow-[0_20px_40px_-15px_rgba(11,19,43,0.15)]"
                  : "bg-charcoal-light/40 border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
              }`}
            >
              {navItems.map((item, idx) => (
                <a
                  key={item.name}
                  href={item.link}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  aria-current={activeIndex === idx ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.link);
                  }}
                  className={`relative px-7 py-1 rounded-full transition-colors duration-300 text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    navTheme === "light"
                      ? `focus-visible:outline-navy ${pillIndex === idx ? "text-navy" : "text-navy/60"}`
                      : `focus-visible:outline-neon ${pillIndex === idx ? "text-neon" : "text-white/70"}`
                  }`}
                >
                  {pillIndex === idx && (
                    <motion.div
                      layoutId="nav-pill-background"
                      className={`absolute inset-0 rounded-full ${
                        navTheme === "light" ? "bg-navy/5" : "bg-white/10"
                      }`}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </a>
              ))}
            </div>
          )}

          {!isProgramPage && (
            <div className="pointer-events-auto">
              <button
                type="button"
                onClick={() => scrollToSection("#contact")}
                className={`px-9 py-3 rounded-full font-extrabold text-[15px] tracking-wide transition-all duration-500 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon ${
                  navTheme === "light"
                    ? "bg-navy text-white hover:bg-navy-light shadow-[0_15px_30px_-10px_rgba(11,19,43,0.4)]"
                    : "bg-neon text-navy hover:bg-neon-hover shadow-[0_15px_30px_-10px_rgba(196,255,71,0.3)]"
                }`}
              >
                Contact Us
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {!isProgramPage && (
        <div
          className={`fixed top-0 left-0 w-full z-50 lg:hidden transition-transform duration-500 ease-in-out ${
            showNavbar ? "translate-y-0" : "-translate-y-16"
          }`}
          style={{
            transitionDuration: "500ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <StaggeredMenu
            position="right"
            colors={["#0B132B", "#111111", "#1A1A1A"]}
            items={navItems.map((item) => ({
              label: item.name,
              ariaLabel: `Maps to ${item.name} section`,
              link: item.link,
              onClick: () => {
                scrollToSection(item.link);
              },
            }))}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            logoUrl="/jpcslogo.png"
            menuButtonColor={navTheme === "light" ? "#0B132B" : "#C4FF47"}
            openMenuButtonColor="#0B132B"
            accentColor="#C4FF47"
            isFixed={true}
            changeMenuColorOnOpen={true}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
