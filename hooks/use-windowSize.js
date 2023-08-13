import { useEffect, useContext } from "react";
import { ContainerWidthContext } from "../store/containerWidth-context";

function useWindowSize(callback, resetCallback, threshold) {
  const { containerWidth, setContainerWidth } = useContext(ContainerWidthContext);
  let resizeTimeout;

  useEffect(() => {
    const checkScreenSize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        console.log(callback, resetCallback, threshold);
        const [comparison, value] = threshold.split("-");
        const shouldCallCallback =
          (comparison === "min" && window.innerWidth <= value) ||
          (comparison === "max" && window.innerWidth >= value);
        if (shouldCallCallback) {
          callback();
        } else {
          resetCallback();
        }
        setContainerWidth(window.innerWidth)
      }, 500);
    };

    !containerWidth && checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [callback, resetCallback, threshold]);
}

export default useWindowSize;
