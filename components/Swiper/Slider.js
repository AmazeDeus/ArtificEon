import { useState, Children } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper";

import useWindowSize from "../../hooks/use-windowSize";

function Slider({ children }) {
  const [slidesPerView, setSlidesPerView] = useState(3);

  useWindowSize(
    () => setSlidesPerView(1),
    () => setSlidesPerView(3),
    "min-768"
  );

  const mappedChildren = Children.map(children, (child) => (
    <SwiperSlide>{child}</SwiperSlide>
  ));

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar]}
      slidesPerView={slidesPerView}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {mappedChildren}
    </Swiper>
  );
}

export default Slider;
