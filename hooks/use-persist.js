// For persisting login across refreshes.

import { useState, useEffect } from "react";

const usePersist = () => {
  const initialState = {
    access:
      typeof window !== "undefined"
        ? window.localStorage.getItem("access")
        : false,
    refresh:
      typeof window !== "undefined"
        ? window.localStorage.getItem("refresh")
        : false,
    isAuthenticated: null,
    user: null,
  };

  const [persist, setPersist] = useState(
    typeof window !== "undefined"
      && JSON.parse(window.localStorage.getItem("persist")) || false
  );

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
    console.log("use-persist: ", localStorage.getItem("persist"));
  }, [persist]);

  return [persist, setPersist];
};

export default usePersist;
