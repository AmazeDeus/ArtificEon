import { useEffect, useRef, memo } from "react";
import Link from "next/link";
import DynamicWrapper from "../../ui/DynamicWrapper";
import useWrapper from "../../../hooks/use-wrapper";
import useUpdateImageSrc from "../../../hooks/use-updateImageSrc";

import classes from "./Article.module.css";

function Article(props) {
  const imgRef = useRef();
  const wrapperRef = useRef();

  useUpdateImageSrc("Banner-V", props.post, imgRef, wrapperRef, [0]);

  const {
    wrappers: newImageWrappers,
    wrapperClasses: newImageWrapperClasses,
    checkWrappers: checkImageWrappers,
  } = useWrapper();
  
  const {
    wrappers: newMainWrappers,
    wrapperClasses: newMainWrapperClasses,
    checkWrappers: checkMainWrappers,
  } = useWrapper();
  
  let categoryTitle = null;
  if (props.displayCategory) {
    categoryTitle = (
      <span className={`${classes["article-category"]}`}>{props.tag}</span>
      );
  }

  useEffect(() => {
    if (props.mainWrappers) {
      checkMainWrappers(props.mainWrappers, props.mainWrapperClasses);
    }

    if (props.imageWrappers) {
      checkImageWrappers(props.imageWrappers, props.imageWrapperClasses);
    }
  }, []);

  const linkClasses = props.setSwiper
    ? `${classes.article} ${classes["swiper-slide"]}`
    : classes.article;

  if (props.post) {
    const post = props.post;
    const updated = new Date(props.post.updatedAt).toLocaleString("en-EU", {
      day: "numeric",
      month: "long",
    });

    return (
      <DynamicWrapper
        wrapperTags={newMainWrappers}
        classes={newMainWrapperClasses}
      >
        <Link
          href={`/blog/post/${post.slug}/view`}
          ref={wrapperRef}
          className={linkClasses}
        >
          <DynamicWrapper
            wrapperTags={newImageWrappers}
            classes={newImageWrapperClasses}
          >
            <img
              ref={imgRef}
              src={post.images[0]?.url}
              alt="Thumbnail"
              className={`${classes["article-image"]}`}
            />
          </DynamicWrapper>
          {categoryTitle && categoryTitle}
          <div className={`${classes["article-data__container"]}`}>
            <div className={`${classes["article-data__container_data"]}`}>
              <span>{updated}</span>
              <span
                className={`${classes["article-data__container_data-spacer"]}`}
              ></span>
              <span>8 Min read</span>
            </div>
            <h3 className={`${classes["article-title"]}`}>{post.title}</h3>
          </div>
        </Link>
      </DynamicWrapper>
    );
  } else return null;
}

const memoizedPost = memo(Article);

export default memoizedPost;
