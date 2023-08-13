import { useState } from "react";
import { FiArrowUpCircle } from "@react-icons/all-files/fi/FiArrowUpCircle"
import { Button } from "./ScrollButton.styles";

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setIsVisible(true);
    } else if (scrolled <= 300) {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    typeof window !== "undefined" &&
      window.scrollTo({
        top: 0,
        behavior: "smooth",
        /* you can also use 'auto' behaviour
         in place of 'smooth' */
      });
  };

  typeof window !== "undefined" &&
    window.addEventListener("scroll", toggleVisible);

  return (
    <Button>
      <FiArrowUpCircle
        onClick={scrollToTop}
        style={{
          transition: isVisible /* fade in/fade out transition */
            ? "opacity 250ms ease-in, visibility 0ms ease-in 0ms"
            : "opacity 250ms ease-in, visibility 0ms ease-in 250ms",
          visibility: isVisible ? isVisible : "hidden",
          opacity: isVisible ? 1 : 0,
        }}
      />
    </Button>
  );
};

export default ScrollButton;
