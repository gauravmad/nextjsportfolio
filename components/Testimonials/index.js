import React, { useRef, useEffect } from "react";
import TestimonialCard from "@/elements/TestiiCard";
import SwiperCore, { Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
import "swiper/css/pagination";
SwiperCore.use([Navigation, Pagination, Autoplay]);
import { EffectCoverflow, Pagination } from "swiper/modules";

import AOS from "aos";
import "aos/dist/aos.css";

export default function Testimonials() {
  const swiperRef = useRef(null);
  const totalSlides = 6; // The total number of slides
  const slideInterval = 1500; // 1.5 seconds in milliseconds
  const currentSlideRef = useRef(0); // Use useRef to store the current slide

  useEffect(() => {
    const swiperInstance = swiperRef.current;

    const autoplay = setInterval(() => {
      currentSlideRef.current = (currentSlideRef.current + 1) % totalSlides;
      if (swiperInstance && swiperInstance.slideTo) {
        swiperInstance.slideTo(currentSlideRef.current);
      }
    }, slideInterval);

    return () => {
      clearInterval(autoplay);
    };
  }, []);

  useEffect(() => {
    AOS.init({});
    AOS.refresh();
    return () => {
      AOS.refreshHard();
    };
  }, []);

  const testidata = [
    {
      testiImg: "/Images/akash.jpeg",
      testName: "Akash Vishwakarma",
      testPost: "CEO - Kirana Friends",
      testdesc:
        "Gaurav is someone you can count on when it truly matters. His commitment to delivering quality work, even under tight deadlines, is remarkable. He brings creativity, reliability, and a solution-oriented mindset to every challenge. It’s been a pleasure working with him.",
    },
    {
      testiImg: "/Images/omar.png",
      testName: "Omar El Samad",
      testPost: "Director - MYTE IT, Australia",
      testdesc:
        "Gaurav stands out for his professionalism and dedication. He is thoughtful in his approach, communicates effectively, and always ensures that the end result exceeds expectations. I’ve thoroughly enjoyed collaborating with him and look forward to working together again.",
    },
    {
      testiImg: "/Images/vifya.jpeg",
      testName: "Dr. Vidyadhari Singh",
      testPost: "Associate Professor & HOD - CS&E",
      testdesc:
        "Gaurav is an exceptional student who blends creativity with discipline. He approaches his work with a mature and positive attitude, always eager to learn and improve. His consistency and leadership qualities make him a standout individual in both academic and professional settings.",
    },
    {
      testiImg: "/Images/ayush.webp",
      testName: "Ayush Lahoti",
      testPost: "CEO - Bunchup",
      testdesc:
        "Believing in Gaurav has been one of the best decisions. He is dependable, sharp, and carries a strong sense of ownership in everything he does. His ability to understand the bigger picture and still focus on the details is truly commendable.",
    },
    {
      testiImg: "/Images/gauravnagrani.jpeg",
      testName: "Gaurav Nagrani",
      testPost: "Founder - Flowstate Wealth",
      testdesc:
        "Working with Gaurav has been a seamless experience. He is respectful, focused, and driven by a genuine passion for excellence. His calm demeanor and problem-solving attitude make him a valuable contributor to any team or project.",
    },
  ];

  return (
    <div className="mb-[10vh] overflow-hidden">
      <h1
        data-aos="fade-right"
        className="text-[3vh] md:text-[5vh] my-[5vh] text-white text-center"
      >
        Testimonials
      </h1>

      <div className="w-[100%] mx-auto py-[5vh] md:p-[5vh]">
        <Swiper
          slidesPerView={1}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }} // For mobile, 1 card visible
          spaceBetween={10}
          loop={true}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          // autoplay={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination]}
          breakpoints={{
            640: {
              slidesPerView: 3, // For desktop, 3 cards visible
              spaceBetween: 20,
            },
          }}
          className="mySwiper h-[76vh]"
        >
          {testidata.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="p-[4vh] py-[10vh]" key={index}>
                <div className=" mx-auto tesgradient pt-[2vh] p-[1vh] md:p-[4vh] rounded-2xl relative">
                  <img
                    src="/Images/inverted.png"
                    className="absolute -left-[7%] -top-[10%] md:-left-[4%] md:-top-[10%] w-[5vh]"
                    alt=""
                  />
                  <img
                    src="/Images/invertedr.png"
                    className="absolute -right-[7%] -bottom-[10%] md:-right-[4%] md:-bottom-[10%] w-[5vh]"
                    alt=""
                  />
                  <p className="text-[2.2vh] select-none text-white font-medium text-center mb-[4vh]">
                    "{item.testdesc}".
                  </p>
                  <div className="">
                    <div className="flex flex-row justify-center items-center">
                      <img
                        src={item.testiImg}
                        className="w-[9vh] md:w-[10vh] mb-[1vh] mx-auto rounded-full"
                        alt="Image"
                      />
                    </div>
                    <p className="text-[2.5vh] md:text-[3vh] text-white text-center">
                      {item.testName}
                    </p>
                    <p className="text-[1.8vh] md:text-[2.3vh] text-gray-200 font-normal text-center">
                      {item.testPost}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
