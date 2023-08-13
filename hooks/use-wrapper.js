import { useState } from "react";

const useWrapper = () => {
  const [wrappers, setWrappers] = useState(null);
  const [wrapperClasses, setWrapperClasses] = useState(null);

  const checkWrappers = (wrappers, wrapperClasses = null) => {
    let recievedWrappers = wrappers;
    let recievedWrapperClasses = wrapperClasses;

    if (wrappers && typeof wrappers === "string") {
      setWrappers(recievedWrappers);
    }

    // for classes present in child component => ( prop: imageWrapperClasses={"childClass1 childClass2 etc"} )
    if (recievedWrapperClasses && typeof recievedWrapperClasses === "string") {
      recievedWrapperClasses.split(" ").filter(Boolean);
      setWrapperClasses(recievedWrapperClasses);
    }
    // for classes present in parent component => ( prop: imageWrapperClasses={{parentClasses: `${classes.parentClass1} ${classes.parentClass2}`}} )
    else if (
      recievedWrapperClasses &&
      typeof recievedWrapperClasses === "object"
    ) {
      recievedWrapperClasses = wrapperClasses.parentClasses; // will expect a "parentClasses" key.
      recievedWrapperClasses.split(" ").filter(Boolean);
      setWrapperClasses(recievedWrapperClasses);
    }
  };
  
  return { wrappers, wrapperClasses, checkWrappers };
};

export default useWrapper;
