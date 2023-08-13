import { useRef } from "react";
import { Parser } from "html-to-react";
import TempImage from "../../../../public/assets/ai.png";

import useUpdateImageSrc from "../../../../hooks/use-updateImageSrc";

import classes from "./Post.module.css";

function Content({ children, post }) {
  const imgRef = useRef();
  const wrapperRef = useRef();

  useUpdateImageSrc("Circle", post, imgRef, wrapperRef, [0]);

  // The first call removes the first img tag from post.content by replacing it with an empty string.
  // The second call adds the dynamic class name to all remaining img tags by replacing <Image with <Image class="${classes["blog-post__centered-image"]}"
  const content = post?.content
    ?.replace(/<img[^>]*>/, "")
    ?.replace(
      /<img/g,
      `<img className="${classes["blog-post__centered-image"]}"`
    );
    
  // cleaning up the HTML content by removing unnecessary class attributes from <p> elements, which were assigned by React Quill, and removing any extra line breaks between paragraphs
  const mergedContent = content
    .replace(/<p class="[^"]*">\s*<br>\s*<\/p>/g, "<p><br></p>")
    .replace(/<\/p>\s*(<br>)*\s*<p>/g, "");

  // Temporary profile image
  let profileSrc;
  if (post?.images.length > 0) profileSrc = post?.images[0].url;
  else profileSrc = TempImage.src;

  return (
    <div
      className={`base-container ${classes["blog-post__container-baseContainer"]}`}
    >
      {mergedContent && Parser().parse(mergedContent)}
      <div className={`${classes["blog-post__container_author"]} d-grid`}>
        <div
          ref={wrapperRef}
          className={`${classes["blog-post__container_author-imageBox"]}`}
        >
          <img
            src={profileSrc}
            ref={imgRef}
            alt="Profile Image"
            className={`${classes["blog-post__container_author-imageBox_image"]}`}
          />
        </div>
        {children}
      </div>
    </div>
  );
}

export default Content;
