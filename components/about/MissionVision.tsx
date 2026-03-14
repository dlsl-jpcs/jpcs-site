
"use client";
import { motion } from "framer-motion";

const MissionVision = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
  };

  const visionItems = [
    {
      number: "01",
      title: "Professional Excellence",
      description:
        "Preparing students for future endeavors as IT professionals.",
    },
    {
      number: "02",
      title: "Social Responsibility",
      description:
        "Awakening the sense of responsibility among future IT leaders.",
    },
    {
      number: "03",
      title: "Technology Leadership",
      description: "Promoting the understanding and usage of cutting-edge ICT.",
    },
  ];

  return (
    <section className="py-16 min-[401px]:py-20 px-4 min-[401px]:px-6 md:px-16 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 min-[401px]:gap-8 md:gap-12 items-start">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6 }}
            className="relative bg-navy rounded-[2rem] min-[401px]:rounded-[2.5rem] p-6 min-[401px]:p-8 md:p-14 overflow-hidden shadow-[0_30px_60px_-15px_rgba(11,19,43,0.3)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[80px] pointer-events-none" />

            <h3 className="text-3xl min-[401px]:text-4xl md:text-5xl font-extrabold text-white mb-6 min-[401px]:mb-8 tracking-tight">
              Our <span className="text-neon">Mission</span>
            </h3>

            <p className="text-white/80 text-base min-[401px]:text-lg md:text-xl leading-relaxed font-medium mb-8 min-[401px]:mb-12">
              To build a community that will help future IT professionals
              develop their technical and non-technical skills in order to help
              others in bringing equality, equity, and justice into all and
              every aspect of society.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                "Community",
                "Development",
                "Equality",
                "Justice",
                "Impact",
              ].map((pillar) => (
                <span
                  key={pillar}
                  className="px-4 min-[401px]:px-5 py-1.5 min-[401px]:py-2 bg-white/10 text-white rounded-full text-xs min-[401px]:text-sm font-bold tracking-wide backdrop-blur-md"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-charcoal rounded-[2rem] min-[401px]:rounded-[2.5rem] p-6 min-[401px]:p-8 md:p-14 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] lg:mt-16 min-[401px]:lg:mt-24"
          >
            <h3 className="text-3xl min-[401px]:text-4xl md:text-5xl font-extrabold text-white mb-8 min-[401px]:mb-10 tracking-tight">
              Our <span className="text-neon">Vision</span>
            </h3>

            <div className="space-y-6 min-[401px]:space-y-8">
              {visionItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4 min-[401px]:gap-6 group">
                  <span className="text-2xl min-[401px]:text-3xl font-black text-neon/40 group-hover:text-neon transition-colors duration-300 mt-1">
                    {item.number}
                  </span>
                  <div>
                    <h4 className="text-lg min-[401px]:text-xl font-bold text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-white/60 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
