"use client";
import { motion } from "framer-motion";

const Main = () => {
  return (
    <section className="relative pt-32 pb-24 px-6 md:px-16 overflow-hidden bg-white z-10 rounded-t-[3rem] -mt-10">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2 text-navy text-xs font-bold tracking-[0.15em] uppercase border border-navy/10 rounded-full px-4 py-2 bg-[#F4F4F5]">
            <span className="w-2 h-2 rounded-full bg-neon" />
            About Us
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-navy leading-[1.05] tracking-tight">
              Shaping the <br />
              future of <br />
              <span className="inline-block bg-neon text-navy px-6 py-2 mt-4 rounded-full shadow-lg transform -rotate-2">
                Technology
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:pt-6 space-y-6"
          >
            <p className="text-charcoal text-lg md:text-xl leading-relaxed font-semibold">
              JPCS is a professional organization of ICT students which aims to
              provide knowledge and skills significant to the students once they
              enter the academe and industry.
            </p>
            <p className="text-navy/60 text-base md:text-lg leading-relaxed font-medium">
              We provide wide opportunities and experiences which encourage
              collaboration, innovation, and healthy competition among our
              members, preparing them to be the digital leaders of tomorrow.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Main;
