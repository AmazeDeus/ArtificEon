import { useRef } from "react";
import EditDeletePost from "../../actionButtons";

import useUpdateImageSrc from "../../../../hooks/use-updateImageSrc";

import classes from "./Post.module.css";

function Banner({ post }) {
  const imgRef = useRef();
  const wrapperRef = useRef();

  useUpdateImageSrc("Banner-H", post, imgRef, wrapperRef, [0]);

  const updated = new Date(post.updatedAt).toLocaleString("en-EU", {
    day: "numeric",
    month: "long",
  });

  const title = (
    <h3 className={`title ${classes["blog-post__container_data-title"]}`}>
      {post.title}
    </h3>
  );

  return (
    <div ref={wrapperRef} className={`${classes["blog-post__container-data"]}`}>
      {title}
      <div
        className={`article-data ${classes["blog-post__container-articleData"]}`}
      >
        <span>{updated}</span>
        <span className="article-data-spacer"></span>
        <span>4 Min read</span>
      </div>
      <div
        className={`article-data ${classes["blog-post__container-articleData"]}`}
      >
        <EditDeletePost post={post} editHandler={true} deleteHandler={true} />
      </div>
      {post.images[0]?.url && <img src={post.images[0]?.url} ref={imgRef} alt="Banner Image" />}
    </div>
  );
}

export default Banner;
