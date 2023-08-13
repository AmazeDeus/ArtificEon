// Clear local storage item on route change or manually typed url, but re-create the storage item if the action was a refresh.

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useClearStorageOnPathnameChange(currentUrl, storageItem) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (newUrl) => {
      // Check if the pathname has changed
      if (newUrl !== currentUrl) {
        // Remove the specified item from local storage
        localStorage.getItem(storageItem) &&
          localStorage.removeItem(storageItem);
      }
    };

    // Listen for route changes within the Next.js application
    router.events.on("routeChangeStart", handleRouteChange);

    // Listen for navigation away from the Next.js application
    window.addEventListener("beforeunload", () => {
      localStorage.getItem(storageItem) && localStorage.removeItem(storageItem);
    });

    // Cleanup function to remove the event listeners
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", () => {
        localStorage.getItem(storageItem) &&
          localStorage.removeItem(storageItem);
      });
    };
  }, [router, currentUrl, storageItem]);
}
