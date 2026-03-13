"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-navy pt-32 pb-12 px-6 overflow-hidden rounded-t-[3rem] -mt-10 z-40 shadow-[0_-30px_60px_rgba(0,0,0,0.3)]">
   
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-neon/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="absolute bottom-[-5vw] left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none z-0 opacity-[0.02]">
        <h1 className="text-[18vw] font-black text-white whitespace-nowrap leading-none tracking-tighter">
          JPCS DLSL
        </h1>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between border-b border-white/10 pb-20 mb-16 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold text-white tracking-tight leading-[1.05] mb-6">
              Ready to <br />
              <span className="text-neon">innovate?</span>
            </h2>
            <p className="text-white/50 text-xl font-medium leading-relaxed">
              Join the network of future IT professionals. Connect with us to
              stay updated on hackathons, seminars, and exclusive opportunities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href="mailto:jpcs@dlsl.edu.ph"
              className="group relative inline-flex items-center justify-center px-10 py-6 bg-neon text-navy font-extrabold text-xl rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(196,255,71,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Let's Talk
                <svg
                  className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-24">
     
          <div className="md:col-span-12 lg:col-span-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Image
                  src="/jpcslogo.png"
                  width={56}
                  height={56}
                  alt="JPCS Logo"
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                JPCS<span className="text-neon">.</span>
              </span>
            </div>

            <div className="flex items-center gap-3 mt-4 ml-1">
              <div className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-neon animate-ping opacity-75"></span>
                <span className="relative block w-2 h-2 rounded-full bg-neon shadow-[0_0_8px_#C4FF47]"></span>
              </div>
              <span className="text-[11px] font-bold text-white/50 tracking-[0.25em] uppercase">
                Innovating 24/7
              </span>
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-2 lg:col-start-8">
            <h4 className="text-white font-extrabold mb-6 text-lg tracking-wide">
              Explore
            </h4>
            <ul className="space-y-4">
              {["Home", "About", "Officers", "Projects"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="group flex items-center gap-2 text-white/50 hover:text-neon font-bold transition-colors text-lg"
                  >
                    <span className="w-0 h-0.5 bg-neon transition-all duration-300 group-hover:w-3" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 lg:col-span-3">
            <h4 className="text-white font-extrabold mb-6 text-lg tracking-wide">
              Connect
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://www.facebook.com/JPCS.DLSL"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-2 pr-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all w-fit"
              >
                <div className="w-12 h-12 rounded-full bg-charcoal flex items-center justify-center text-white/70 group-hover:bg-[#1877F2] group-hover:text-white transition-colors duration-300 shadow-inner">
                  <FacebookIcon />
                </div>
                <span className="font-bold text-white/70 group-hover:text-white transition-colors">
                  Facebook
                </span>
              </a>
              <a
                href="https://www.instagram.com/jpcsdlsl"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-2 pr-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all w-fit"
              >
                <div className="w-12 h-12 rounded-full bg-charcoal flex items-center justify-center text-white/70 group-hover:bg-[#E4405F] group-hover:text-white transition-colors duration-300 shadow-inner">
                  <InstagramIcon />
                </div>
                <span className="font-bold text-white/70 group-hover:text-white transition-colors">
                  Instagram
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="relative pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 font-bold text-sm tracking-wide">
            © {new Date().getFullYear()} Junior Philippine Computer Society. De
            La Salle Lipa.
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-white/40 hover:text-neon font-bold text-sm transition-colors uppercase tracking-widest"
          >
            Back to top
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon group-hover:bg-neon/10 transition-all">
              <svg
                className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
