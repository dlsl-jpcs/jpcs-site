"use client";

import React from "react";
import { motion } from "framer-motion";

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/JPCS.DLSL",
    icon: <FacebookIcon />,
    hoverClass: "hover:text-blue-400 hover:border-blue-400/40",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/jpcsdlsl",
    icon: <InstagramIcon />,
    hoverClass: "hover:text-pink-400 hover:border-pink-400/40",
  },
];

const Announcements = () => {
  return (
    <>
      {/* Stay Connected section */}
      <section className="relative py-28 md:py-36 px-6 bg-background overflow-hidden">
        {/* Top separator */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(13,204,88,0.2), transparent)",
          }}
        />
        {/* Bottom glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(13,204,88,0.07), transparent)",
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 text-light-green text-xs font-semibold tracking-widest uppercase border border-light-green/30 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-light-green" />
              Stay Connected
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-5"
          >
            Follow our journey
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Stay up to date with the latest events, announcements, and
            opportunities from JPCS DLSL.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 border border-white/10 rounded-xl px-6 py-3 text-white/55 transition-all duration-300 ${s.hoverClass}`}
              >
                {s.icon}
                <span className="text-sm font-medium">{s.name}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-light-green/10 border border-light-green/20 flex items-center justify-center">
              <span className="text-light-green text-xs font-bold">J</span>
            </div>
            <span className="text-white/40 text-sm">
              JPCS — De La Salle Lipa
            </span>
          </div>
          <p className="text-white/25 text-xs text-center">
            © {new Date().getFullYear()} Junior Philippine Computer Society ·
            De La Salle Lipa Chapter
          </p>
        </div>
      </footer>
    </>
  );
};

export default Announcements;
