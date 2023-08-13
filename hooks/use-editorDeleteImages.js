// Identify the specific image deleted from the Rich Editor.

import { useState } from "react";

export default function useEditorDeleteImages(quill, documentId) {
  const [deletedImgUrls, setDeletedImgUrls] = useState([]);

  async function onEditorDeleteImages(oldContent) {
    const editor = quill?.current?.editor;
    const currentContent = editor.getContents();

    const deletedImages = findDeletedImages(oldContent, currentContent);

    for (const image of deletedImages) {
      if (image) {
        const deletedImgUrl = image.insert.image;
        setDeletedImgUrls((prevDeletedImgUrls) => [
          ...prevDeletedImgUrls,
          deletedImgUrl,
        ]);
      }
    }
  }

  function findDeletedImages(oldContent, currentContent) {
    const oldImages = oldContent.ops.filter(
      (op) => op.insert && op.insert.image
    );

    const currentImages = currentContent.ops.filter(
      (op) => op.insert && op.insert.image
    );

    const deletedImages = oldImages.filter(
      (oldImage) =>
        !currentImages.some(
          (currentImage) => currentImage.insert.image === oldImage.insert.image
        )
    );

    return deletedImages;
  }

  return { onEditorDeleteImages, deletedImgUrls };
}
