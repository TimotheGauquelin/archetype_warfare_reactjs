import { Swiper } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "swiper/css/autoplay";

const Slider = ({ children }) => {
  return (
    <>
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        autoplay={{ delay: 6000 }}
        pagination={{ clickable: true }}
      >
        {children}
      </Swiper>{" "}
    </>
  );
};

export default Slider;
