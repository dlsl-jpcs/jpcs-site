"use client";
import { motion } from "framer-motion";

const MissionVision = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
  };

  const pillars = [
    "Community",
    "Development",
    "Equality",
    "Justice",
    "Growth",
    "Impact",
  ];

  const visionItems = [
    {
      number: "01",
      title: "Professional Excellence",
      description:
        "To prepare students in facing future endeavors as IT professionals.",
    },
    {
      number: "02",
      title: "Social Responsibility",
      description:
        "To awaken the sense of social responsibility among future IT professionals.",
    },
    {
      number: "03",
      title: "Technology Leadership",
      description:
        "To promote among enthusiasts the understanding and usage of information and communications technology.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 md:px-8 relative overflow-hidden bg-background">
      {/* Top separator glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(13,204,88,0.2), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-light-green text-xs font-semibold tracking-widest uppercase border border-light-green/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-light-green" />
            Core Values
          </span>
          <div className="inline-block">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Mission &amp; <span className="text-accent-green">Vision</span>
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-0.5 bg-accent-green rounded-full mt-3"
            />
          </div>
          <p className="text-white/50 text-base md:text-lg font-medium max-w-2xl mx-auto mt-4">
            Our guiding principles and aspirations
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Mission card */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6 }}
            className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 overflow-hidden hover:border-accent-green/30 transition-colors duration-300"
            style={{ borderTop: "2px solid #57cb60" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 rounded-full blur-2xl pointer-events-none" />

            <div className="mb-6 relative">
              <h3 className="text-2xl md:text-4xl font-bold text-white">
                Mission
                <span className="ml-1 text-accent-green/40">.</span>
              </h3>
              <span className="absolute -top-2 -right-2 text-7xl font-black text-white/[0.03] select-none pointer-events-none leading-none">
                M
              </span>
            </div>

            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
              To build a community that will help future IT professionals develop
              their technical and non-technical skills in order to help others in
              bringing equality, equity, and justice into all and every aspect of
              society.
            </p>

            <div className="flex flex-wrap gap-2">
              {pillars.map((pillar) => (
                <span
                  key={pillar}
                  className="px-3 py-1.5 border border-accent-green/40 text-accent-green rounded-full text-xs font-medium"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Vision card */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 overflow-hidden hover:border-accent-green/30 transition-colors duration-300"
            style={{ borderTop: "2px solid #57cb60" }}
          >
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-green/5 rounded-full blur-2xl pointer-events-none" />

            <div className="mb-8 relative">
              <h3 className="text-2xl md:text-4xl font-bold text-white">
                Vision
                <span className="ml-1 text-accent-green/40">.</span>
              </h3>
            </div>

            <div className="space-y-7">
              {visionItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <span className="text-4xl font-black text-light-green/20 leading-none select-none group-hover:text-light-green/40 transition-colors duration-300 flex-shrink-0 w-10">
                    {item.number}
                  </span>
                  <div className="flex-1 pt-1">
                    <h4 className="text-base md:text-lg font-bold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-white/55 leading-relaxed text-sm md:text-base">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom quote */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <p className="text-lg md:text-xl font-semibold text-white/50 leading-relaxed max-w-3xl mx-auto">
            Building bridges between technical excellence and social impact
            <span className="text-white/20">.</span>
          </p>
          <div className="mt-8 mx-auto w-16 h-px bg-white/10" />
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;
