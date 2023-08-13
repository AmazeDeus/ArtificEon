import { useRef, useEffect } from "react";

const useAnimationFrame = (callback, isSuccess) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  // Pass on a function to the setter of the state
  // to make sure we always have the latest state
  // If routing fails to update the page, experiment with a higher timeout delay
  const animate = (time) => {
    if (!isSuccess) return;
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      setTimeout(() => {
        callback((prevCount) => (prevCount + deltaTime * 0.01) % 360); // animation runs for 360 degrees.
      }, 500);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isSuccess]);
};

export default useAnimationFrame;
