import React from "react";
import { useEffect } from "react";
import { Project } from "@/types/projects";
interface Props {
  project: Project | null;
  onClose: () => void;
}

function EventInfo({ project, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="
        fixed inset-0
        z-[9999]
        flex items-center justify-center
        bg-black/50
      "
    >
      <div
        className="
          bg-[#0D172F]

    w-[95vw]
    sm:w-[90vw]
    md:w-[80vw]
    lg:w-[650px]

    h-[70vh]
    max-h-[500px]

    grid
    grid-rows-[2fr_1fr]

    rounded-xl"
      >
        <div
          className="bg-cover rounded-t-xl"
          style={{
            backgroundImage: `url('${project?.image}')`,
          }}
        >
          <button
            onClick={onClose}
            className="
            bg-[#27334C]
            pl-3
            pr-3
            pt-1.5
            pb-1.5
            rounded-xl
            relative
            top-4
            left-4
            text-white
            text-2xl
            hover:text-gray-300
            transition
          "
            aria-label="Close popup"
          >
            ✕
          </button>
        </div>
        <div className="pt-2 pl-7 pr-7 pb-10 flex flex-col">
          <div className="flex justify-between">
            <p className="text-2xl font-bold">{project?.name}</p>
            <p className="flex align-middle bg-[#6B728026] p-1.5 rounded-xl">
              {project?.date}
            </p>
          </div>
          <div className="pt-2">
            <p>{project?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventInfo;
