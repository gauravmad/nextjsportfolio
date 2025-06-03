import React, { useEffect } from "react";
import Tilt from "react-parallax-tilt";

import AOS from "aos";
import "aos/dist/aos.css";

export default function Services() {
  useEffect(() => {
    AOS.init({});
    AOS.refresh();
    return () => {
      AOS.refreshHard();
    };
  }, []);

  return (
    <div id="services">
      <h1
        data-aos="fade-right"
        data-aos-duration="700"
        className="text-white text-[3vh] md:text-[5vh] font-semibold text-center my-[10vh]"
      >
        Services
      </h1>

      <div className="flex flex-col md:flex-row w-[90%] md:w-[80%] mx-auto gap-[2vh]">
        <div
          data-aos="zoom-in"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="700"
          className="w-[90%] mx-auto md:w-[30%]"
        >
          <Tilt className="tesgradient p-[2vh]">
            <div data-aos="flip-left" data-aos-duration="700">
              <img src="/Images/website.webp" className="w-[10vh]" alt="" />
              <h2 className="text-neutral-300 font-normal text-[3.5vh] my-[1.5vh]">
                Website Development
              </h2>
              <p className="text-neutral-300 text-[2vh] font-normal text-justify">
                I design and develop responsive, high-performance websites
                tailored to your business needs. From landing pages to
                full-stack web applications, I ensure seamless UI, fast loading
                times, and optimized SEO for better visibility.
              </p>
            </div>
          </Tilt>
        </div>

        <div
          data-aos="zoom-in"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="700"
          className="w-[90%] mx-auto md:w-[30%]"
        >
          <Tilt className="appgradient p-[2vh]">
            <div>
              <img src="/Images/mobileapp.webp" className="w-[10vh]" alt="" />
              <h2 className="text-neutral-300 font-normal text-[3.5vh] my-[1.5vh]">
                Mobile App Development
              </h2>
              <p className="text-neutral-300 text-[2vh] font-normal text-justify">
                I build cross-platform mobile applications using modern
                frameworks, delivering smooth user experiences on both Android
                and iOS. Whether it’s a simple utility app or a feature-rich
                solution, I handle everything from UI design to backend
                integration.
              </p>
            </div>
          </Tilt>
        </div>

        <div
          data-aos="zoom-in"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="700"
          className="w-[90%] mx-auto md:w-[30%] "
        >
          <Tilt className="uigradient p-[2vh]">
            <div>
              <img src="/Images/design.webp" className="w-[10vh]" alt="" />
              <h2 className="text-neutral-300 font-normal text-[3.5vh] my-[1.5vh]">
                UI/UX Development
              </h2>
              <p className="text-neutral-300 text-[2vh] font-normal text-justify">
                I craft intuitive, user-friendly interfaces that are both
                visually appealing and functionally efficient. I focus on user
                experience, responsive layouts, and accessibility to ensure your
                digital product stands out and performs well.
              </p>
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  );
}
