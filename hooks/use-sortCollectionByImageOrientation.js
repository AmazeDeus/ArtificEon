// The hook sorts the given collections based on the orientation of the images found at the specified imgUrlPath within each collection.
// sort - determines whether the collections are sorted with horizontal/vertical images first in descending/ascending order, depending on their width/height ratios.
// The default value for sort is "verticalFirst". The hook returns an array of sorted collections.

import { useState, useEffect, useCallback } from "react";

export const useSortCollectionsByImageOrientation = (collections, imgUrlPath, sort = "verticalFirst") => {
  const [sortedCollections, setSortedCollections] = useState([]);

  function getPropertyValue(object, path) {

    // split the path into an array of keys
    const keys = path.split(/[\.\[\]]/).filter((key) => key !== "");

    // initialize the current value to the object
    let currentValue = object;

    // loop through the keys
    for (const key of keys) {
      if (currentValue === undefined) {
        return undefined;
      }
      // update the current value to the value at the key
      currentValue = currentValue[key];
    }

    return currentValue;
  }

  const sortImageCollections = useCallback(async () => {
    const collectionsWithOrientation = [];
  
    if (!collections || !imgUrlPath) {
      return [];
    }
  
    // Load the images in paralell: Wait for all images to load before sorting the collections
    const promises = collections.map((collection) => {
      return new Promise((resolve) => {
        // create an image object to get the natural dimensions of the image
        const url = getPropertyValue(collection, imgUrlPath);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          collectionsWithOrientation.push({ collection, ratio });
          resolve();
        };
      });
    });
  
    await Promise.all(promises);
  
    // sort the array based on the sort property. horizontalFirst - sort in descending order of image w/h ratio // verticalFirst - ascending order of image w/h ratio
    collectionsWithOrientation.sort((a, b) => {
      if (sort === "horizontalFirst") {
        return b.ratio - a.ratio;
      } else {
        return a.ratio - b.ratio;
      }
    });
  
    return collectionsWithOrientation.map((item) => item.collection);
  }, [collections, imgUrlPath, sort]);

  useEffect(() => {
    async function sortCollections() {
      const sorted = await sortImageCollections();
      setSortedCollections(sorted);
    }

    !sortedCollections.length && sortCollections();
  }, [collections]);

  return sortedCollections;
};
