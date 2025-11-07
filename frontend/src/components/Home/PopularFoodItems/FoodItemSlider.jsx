import React, {useRef,  } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FoodCard from "./FoodCard";
import { foodItems } from "../../../constants";
import SectionHeader from "../../Common/SectionHeader";
import NextPrevButton from "../CustomerSay/NextPrevButton";

const FoodItemSlider = () => {
  const sliderRef = useRef(null); // Add a ref

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1225,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 972,
        settings: {
          slidesToShow: 2,
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
    <div className="relative w-full  mt-8 bg-fooditem pt-5 pb-[60px]">
      <div className="between w-full container mx-auto wrapper ">
        <SectionHeader inspirationWord={"Crispy, Every Bite Test"} title={"Popular Food Items"} />
        <div className="lg:flex items-end justify-end gap-4 hidden">
          <NextPrevButton sliderRef={sliderRef} />

        </div>
      </div>
      <div className="pl-2 min-sm:pl-16 sc-390:pl-4 sc-414:pl-6 sc-430:pl-[34px] container mx-auto wrapper  pt-10">
        <Slider ref={sliderRef} {...settings}>
          {foodItems.map((item, index) => (
            <FoodCard product={item} index={index} name={item.name} description={item.description} image={item.image} price={item.price} />
          ))}
        </Slider>
      </div>
      <div className="flex items-center justify-center lg:hidden mt-6 gap-4 container mx-auto wrapper">
        <NextPrevButton sliderRef={sliderRef} />
      </div>
    </div>
  );
};

export default FoodItemSlider;
