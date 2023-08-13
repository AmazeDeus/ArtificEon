import { useState, useEffect } from 'react';

export const useGetContainerWidth = (ref) => {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current.offsetWidth);

      let timeoutId = null;

      const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setContainerWidth(ref.current.offsetWidth);
        }, 200);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [ref.current]);

  return containerWidth;
}
