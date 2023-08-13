// Hook for dynamically passing in a width threshold to execute some logic.
// Takes a width threshold parameter (eg. "min-1025px"), a target function with logic to be executed upon passing said threshold, and a specific boolean watcher which is required for the target function to be executed.

import { useState, useEffect } from "react";

const useScreenThreshold = (widthThreshold, targetFunc, watcher) => {
  const [screenThreshold, setScreenThreshold] = useState(false);
  useEffect(() => {
    // Remove quotes and prefix
    const regexResult = widthThreshold.match(/^["']?(min-|max-)?(.+?)["']?$/);

    let minWidthThreshold = null;
    let maxWidthThreshold = null;
    let widthFormat = null;

    // The regexResult variable contains an array with three elements: the full matched string, the prefix (if any), and the threshold value.
    if (regexResult) {
      const [, prefix, threshold] = regexResult;

      switch (prefix) {
        case "min-":
          minWidthThreshold = threshold;
          maxWidthThreshold = null;
          widthFormat = `${`(min-width: ${minWidthThreshold})`}`;
          break;
        case "max-":
          minWidthThreshold = null;
          maxWidthThreshold = threshold;
          widthFormat = `${`(max-width: ${maxWidthThreshold})`}`;
          break;
        default:
          console.log("No Threshold prefix passed in.");
          minWidthThreshold = null;
          maxWidthThreshold = null;
      }
    }

    const mediaWatcher = window.matchMedia(widthFormat);

    setScreenThreshold(mediaWatcher.matches);

    function updateIsThresholdPass(e) {
      setScreenThreshold(e.matches);
      if (watcher) {
        targetFunc();
      }
    }
    if (mediaWatcher.addEventListener) {
      mediaWatcher.addEventListener("change", updateIsThresholdPass);
      return function cleanup() {
        mediaWatcher.removeEventListener("change", updateIsThresholdPass);
      };
    } else {
      // No addEventListener available. For older browsers.
      mediaWatcher.addListener(updateIsThresholdPass);
      return function cleanup() {
        mediaWatcher.removeListener(updateIsThresholdPass);
      };
    }
  }, [screenThreshold, watcher]);

  return screenThreshold;
};

export default useScreenThreshold;
