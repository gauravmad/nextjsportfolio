import React, { useRef, useEffect } from "react";
import TestimonialCard from "../../elements/TestominialCard";
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
        "Gaurav played a crucial role in developing our mobile app and internal tools. His expertise in React Native and frontend development was instrumental in delivering a seamless user experience. He also integrated Clevertap for analytics and AWS S3 for file handling, making our operations much more efficient. A truly dependable and innovative developer.",
    },
    {
      testiImg: "/Images/omar.png",
      testName: "Omar El Samad",
      testPost: "Director - MYTE IT, Australia",
      testdesc:
        "Working with Gaurav was a pleasure. He brought a strong command of modern web technologies and delivered scalable solutions using Next.js and GraphQL. His integration of Myfatootrah and work with Apollo Client showed both depth and attention to detail. He is an asset to any team looking for frontend excellence.",
    },
    {
      testiImg: "/Images/vifya.jpeg",
      testName: "Dr. Vidyadhari Singh",
      testPost: "Associate Professor & HOD - CS&E",
      testdesc:
        "Gaurav has consistently demonstrated a rare blend of creativity and technical acumen. His passion for cybersecurity and full-stack development, combined with a solid academic track record, sets him apart. He brings both vision and execution to every project he undertakes.",
    },
    {
      testiImg: "/Images/ayush.webp",
      testName: "Ayush Lahoti",
      testPost: "CEO - Bunchup",
      testdesc:
        "Gaurav is a rare talent—creative, technically sound, and extremely deadline-driven. He turns ambitious concepts into real, functioning products with ease. His ability to balance UI/UX with backend logic makes him one of the best developers I’ve worked with.",
    },
    {
      testiImg: "/Images/gauravnagrani.jpeg",
      testName: "Gaurav Nagrani",
      testPost: "Founder - Flowstate Wealth",
      testdesc:
        "Gaurav’s dedication and work ethic are commendable. He approaches each project with precision and clarity, whether it’s frontend design or backend development. His professional integrity and commitment to delivering high-quality work make him a valuable partner on any tech initiative.",
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
              <div className="p-[4vh] py-[10vh]">
                <TestimonialCard
                  testimonialdesc={item.testdesc}
                  testimonialname={item.testName}
                  testimonialpost={item.testPost}
                  testimonialimg={item.testiImg}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
