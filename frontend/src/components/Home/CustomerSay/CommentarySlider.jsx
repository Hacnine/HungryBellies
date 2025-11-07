import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { testimonials } from "../../../constants";
import SectionHeader from "../../Common/SectionHeader";
import NextPrevButton from "./NextPrevButton";
import FoodTestimonials from "./FoodTestimonials";

const CommentarySlider = () => {
  const sliderRef = useRef(null); 

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="relative w-full mx-auto mt- py-5 bg-commentary">
     <div className="container wrapper">
     <div className="between w-full">
        <SectionHeader inspirationWord={"Crispy, Every Bite Test"} title={"What some of our customer say"} />
        <div className="lg:flex items-end justify-end gap-4 hidden">
          <NextPrevButton sliderRef={sliderRef} />
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}> {/* Attach the ref to Slider */}
        {testimonials.map((item, index) => (
          <FoodTestimonials key={index}/>
        ))}
      </Slider>
      <div className="flex items-center justify-center lg:hidden mt-6 gap-4">
        <NextPrevButton sliderRef={sliderRef} />
      </div>
     </div>
    </div>
  );
};

export default CommentarySlider;
