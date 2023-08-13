// Takes in several arguments: imageType, collection, imgRef, wrapperRef, and imageIndexes.
// If all conditions are met when the useEffect is called, the function is defined and invoked after a 1s delay.
// This function finds the closest ancestor element of the image that matches the provided wrapper selector and gets its dimensions.
// It then filters the images in the collection based on the provided imageIndexes and updates their src attribute (presets from Cloudinary) based on the provided imageType.
// Also makes the image a png, if imageType has a value of "Circle" and the url has a file extension that is not ".png" or ".gif" (for omitting the white background)
// The hook also adds an event listener to the window’s resize event to update the image’s src attribute in order to stay consistent with the wrapper's dimensions.
// Note the containerWidth context in the dependencies. Comes from "use-windowSize.js" (called in Slider.js).
// - Slider.js modifies the dimensions of wrapperRef so the extra conext of that event in needed.
// - If containerWidth is not defined yet (Slider.js hasn't been imported yet), it uses the window size instead.

import { useEffect, useContext } from "react";
import { ContainerWidthContext } from "../store/containerWidth-context";

const useUpdateImageSrc = (
  imageType = "Original",
  collection = {},
  imgRef,
  wrapperRef,
  imageIndexes = []
) => {
  const contextValue = useContext(ContainerWidthContext);

  let containerWidth;
  if (contextValue) {
    containerWidth = contextValue.containerWidth;
  }

  let resizeTimeout;
  
  useEffect(() => {
    if (!collection?.images || !imgRef.current || !wrapperRef.current) {
      return;
    }
    console.log("CONTAINERWIDTH:", containerWidth)

    const updateImageSrc = () => {
      const img = imgRef.current;
      const reference = wrapperRef.current;
      const refWidth = reference?.offsetWidth;
      const refHeight = reference?.offsetHeight;

      const imagesToUpdate = imageIndexes.length
        ? collection.images.filter((_, index) => imageIndexes.includes(index))
        : collection.images;

      const imageTypes = {
        Original: "",
        "Banner-H": `upload/c_fill,g_face,h_${refHeight},w_${refWidth}/b_rgb:000000,e_gradient_fade,y_-0.50/c_scale,co_rgb:ffffff,fl_relative/`,
        "Banner-V": `upload/e_improve,w_${refWidth},h_${refHeight},c_thumb,g_face/`,
        Circle: `upload/w_${refWidth},c_fill,ar_1:1,g_auto,r_max,bo_2px_solid_red/`,
        Sharpened: `upload/w_${refWidth},ar_16:9,c_fill,g_auto,e_sharpen/`,
        Square: `upload/w_${refWidth},ar_1:1,c_fill,g_face,e_art:hokusai/`,
        Thumbnail: `upload/c_thumb,w_${refWidth},g_face/`,
        Watermark: `upload/w_${refWidth},h_${refHeight},c_limit,e_blur:400,o_90,b_black/l_text:arial_80:®,ar_1:1,c_lfill,o_60,co_rgb:ffffff,b_rgb:000000,r_max/`,
      };

      imagesToUpdate.forEach((image) => {
        let newSrc = image.url.replace(/upload\//, imageTypes[imageType]);

        if (
          imageType === "Circle" &&
          !image.url.endsWith(".png") &&
          !image.url.endsWith(".gif")
        ) {
          newSrc = newSrc.replace(/\.[^/.]+$/, ".png");
        }

        if (img) img.src = newSrc;
      });
    };

    
    const handleResize = (val) => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateImageSrc, val);
    };

    const checkScreenSize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        handleResize();
      }, 500);
    };

    handleResize(1000);

    !containerWidth && window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [imgRef, wrapperRef, collection, imageIndexes, imageType, containerWidth]);
};

export default useUpdateImageSrc;
