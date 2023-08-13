import { useEffect } from "react";

const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title; // title from the dom stored in prevTitle
    document.title = title;

    // When component unmounts, restore the title
    return () => (document.title = prevTitle);
  }, [title]);
};

export default useTitle;
