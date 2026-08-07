import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import { Project } from "@/types/projects";
import { useState } from "react";
import EventInfo from "../EventInfo";

interface ProjectsCarouselProps {
  projects: Project[];
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="relative w-full h-[380px] sm:h-[430px] md:h-[480px] lg:h-[535px] mx-auto mt-[-40px]">
      <Swiper
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.realIndex + 1);
        }}
        allowTouchMove={false}
        simulateTouch={false}
        effect="coverflow"
        centeredSlides
        loop
        observer
        observeParents
        updateOnWindowResize
        modules={[EffectCoverflow, Navigation, Autoplay]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 250,
          modifier: 1.2,
          slideShadows: false,
          scale: 0.85,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: -20,
          },
          480: {
            slidesPerView: 1.2,
            spaceBetween: -30,
          },
          640: {
            slidesPerView: 1.5,
            spaceBetween: -40,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: -60,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: -80,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: -100,
          },
        }}
        className="h-full w-[280px] sm:w-[340px] md:w-[420px] lg:w-[1280px] px-4"
      >
        {projects.map((project) => (
          <SwiperSlide
            key={project.id}
            className="flex items-center justify-center h-full"
          >
            <div className="card h-full w-full rounded-xl grid grid-rows-[2fr_1fr] bg-[#0D1522] text-white shadow-2xl overflow-hidden">
              {/* Image Section */}
              <div className="relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center flex items-end"
                  style={{
                    backgroundImage: `url('${project.image}')`,
                  }}
                >
                  <p className="z-10 p-4 text-xl sm:text-2xl lg:text-3xl font-bold">
                    {project.name}
                  </p>
                </div>

                {/* Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0D1522] via-[#27334C]/70 to-transparent" />
              </div>

              {/* Bottom Content */}
              <div className="grid grid-rows-[1fr_auto]">
                <div className="p-4">
                  <p className="text-[#9CA3AF] text-sm sm:text-base lg:text-lg font-medium line-clamp-4">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
                  <button
                    className="flex items-center"
                    onClick={() => {
                      setSelectedProject(project);
                      setShowPopup(true);
                    }}
                  >
                    <Image
                      src="/button1.png"
                      alt="More Info"
                      width={40}
                      height={40}
                      className="w-8 h-8 sm:w-10 sm:h-10"
                    />

                    <p className="text-[#9CA3AF] text-xs sm:text-sm font-medium ml-3 sm:ml-4">
                      MORE INFO
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {showPopup && (
        <EventInfo
          project={selectedProject}
          onClose={() => setShowPopup(false)}
        />
      )}
      <div className="flex justify-center items-center mt-4">
        <button className="custom-prev">
          <Image
            src="/leftButton.png"
            alt="Previous"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </button>
        <p className="m-5 text-sm sm:text-base lg:text-lg font-medium">
          {currentSlide}
        </p>
        <button className="custom-next">
          <Image
            src="/rightButton.png"
            alt="Next"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </button>
      </div>

      <style jsx global>{`
        .swiper-slide {
          opacity: 0.5;
          transition:
            opacity 0.35s ease,
            transform 0.35s ease;
        }
        .swiper-slide-active {
          opacity: 1;
          z-index: 10;
        }
        .swiper-slide-prev,
        .swiper-slide-next {
          opacity: 0.85;
        }

        .swiper-slide-active .card {
          border-width: 2px;
          border-color: #d0ff47;
        }
      `}</style>
    </div>
  );
}
