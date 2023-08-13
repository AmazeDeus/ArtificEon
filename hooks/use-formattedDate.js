import { useState, useEffect } from "react";

// useEffect for formatting the date in order to avoid hydration problems between the client and the server
const useFormattedDate = (options, date) => {
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(
    () =>
      setFormattedDate(new Intl.DateTimeFormat("en-EU", options).format(date)),
    []
  );

  return formattedDate;
};

export default useFormattedDate;
