import React, { useEffect } from "react";
import Link from "next/link";
import { ProjectCard } from "../../elements";

import AOS from "aos";
import "aos/dist/aos.css";

export default function Projects() {
  const projects = [
    {
      projectimage: "/assets-json/dortv.png",
      projectdemolink: "https://new-dor-dev.vercel.app/",
      projectgithublink: "",
    },
    {
      projectimage: "/assets-json/flowstate.png",
      projectdemolink: "https://flowstate-ruby.vercel.app/",
      projectgithublink: "",
    },
    {
      projectimage: "/assets-json/hsbookstore.png",
      projectdemolink: "https://hsbookstore.vercel.app/default-channel/en-US",
      projectgithublink: "",
    },
    {
      projectimage: "/assets-json/skbeach.png",
      projectdemolink: "https://www.samarthkrupabeachresort.com/",
      projectgithublink: "",
    },
    {
      projectimage: "/assets-json/bookings.png",
      projectdemolink: "https://bookings.bunchup.in/",
      projectgithublink:
        "",
    },
    {
      projectimage: "/Images/bunchupap.jpg",
      projectdemolink: ".",
      projectgithublink: "",
    },
  ];

  useEffect(() => {
    AOS.init({});
    AOS.refresh();
    return () => {
      AOS.refreshHard();
    };
  }, []);

  return (
    <div
      id="projects"
      className="text-2xl text-white text-center py-[6vh] overflow-hidden"
    >
      <h1
        data-aos="fade-left"
        className="text-center text-[3vh] md:text-[5vh] font-semibold my-[10vh]"
      >
        My Recent Work/Projects
      </h1>

      <div
        data-aos="zoom-in"
        data-aos-duration="700"
        className="flex flex-row flex-wrap gap-[3vh] md:gap-[5vh] justify-center items-center"
      >
        {projects.map((item, index) => (
          <ProjectCard
            imageSrc={item.projectimage}
            githubLink={item.projectgithublink}
            videoLink={item.projectdemolink}
          />
        ))}
      </div>

      <div className="my-[3vh]">
        <Link href="https://github.com/gauravmad">
          <button className="btngradient text-white p-[2vh] text-[2.5vh]">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            View all Projects
          </button>
        </Link>
      </div>
    </div>
  );
}
