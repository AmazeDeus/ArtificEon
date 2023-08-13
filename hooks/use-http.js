import { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [responseData, setResponseData] = useState(null)

  const sendRequest = useCallback(
    async (fetchMode = fetch, requestConfig, applyData) => {
      setIsLoading(true);
      setError(null);

      const returnJson = !requestConfig.rawResponse ? true : false

      try {
        const response = await fetchMode(requestConfig.url,
          requestConfig.options ? requestConfig.options : {
          method: requestConfig.method ? requestConfig.method : "GET",
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        });

        if (!response.ok) {
          const data = await response.json();
          const error = data.error ? data.error.message : response.statusText;
          throw new Error(error);
        }

        const data = !returnJson ? setResponseData(response) : await response.json();

        if (applyData) {
          applyData(data);
        }
        setIsLoading(false);
        
        return { data };
      } catch (e) {
        // console.log(e.message)
        setError(e.message || "Something went wrong!");
        return { error: e.message };
      }
      
    },
    []
  );
  return {
    responseData,
    message,
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
