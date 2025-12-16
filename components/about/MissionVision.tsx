"use client";
import { motion } from "framer-motion";

const MissionVision = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
  };

  return (
    <section className="py-10 md:py-16 px-8 md:px-8 text-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-block mb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Mission & <span className="text-accent-green">Vision</span>
            </h1>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 bg-accent-green rounded-full mt-2"
            ></motion.div>
          </div>

          <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Our guiding principles and aspirations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-[#57cb60] text-black rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-black/5 skew-x-12 transform"></div>

            <div className="mb-6">
              <div className="text-3xl md:text-4xl font-bold mb-4">
                Mission
                <span className="ml-1 text-black/30">.</span>
              </div>

              <div className="relative">
                <div className="absolute -top-4 -left-3 text-6xl md:text-7xl font-bold text-black/5">
                  M
                </div>
                <p className="text-lg md:text-xl leading-relaxed font-medium relative z-10">
                  To build a community that will help future IT professionals
                  develop their technical and non-technical skills in order to
                  help others in bringing equality, equity, and justice into all
                  and every aspect of society.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {[
                "Community",
                "Development",
                "Equality",
                "Justice",
                "Growth",
                "Impact",
              ].map((pillar, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-black text-[#57cb60] rounded-full text-sm font-medium"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#57cb60] text-black rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/3 h-full bg-black/5 -skew-x-12 transform"></div>

            <div className="mb-6">
              <div className="text-3xl md:text-4xl font-bold mb-4">
                Vision
                <span className="ml-1 text-black/30">.</span>
              </div>
            </div>

            <div className="space-y-6 md:space-y-6">
              {[
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
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-black text-[#57cb60] rounded-full flex items-center justify-center font-bold text-sm md:text-base">
                    {item.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-black/80 leading-relaxed text-sm md:text-base">
                      {item.description}
                    </p>
                    {index < 2 && (
                      <div className="w-16 h-0.5 bg-black/30 mt-4"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 md:mt-16"
        >
          <div className="my-6 md:my-8 border-t border-gray-200 origin-left"></div>

          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl font-bold leading-tight text-gray-50">
              Building bridges between technical excellence and social impact
              <span className="text-gray-400">.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;
