import { Fragment, createRef, useRef } from "react";
import { useRouter } from "next/router";
import { Article } from "../../components";

import useUpdateImageSrc from "../../hooks/use-updateImageSrc";

import classes from "./Blog.module.css";

function Blog({ posts }) {
  const imgRefs = useRef(Array.from({ length: 5 }, () => createRef()));
  const router = useRouter()
  const wrapperRef = useRef();
  let collection;
  if (posts) {
    collection = {
      images: posts.map((post) => ({
        url: post.image.url,
      })),
    };
  }

  imgRefs.current.forEach((imgRef, index) => {
    useUpdateImageSrc("Square", collection, imgRef, wrapperRef, [index]);
  });
  
  const onClickHandler = () => {
    router.push("/blog")
  }
  
  return (
    <div className={`${classes.gpt3__blog} section__padding fade-in`} id="blog">
      <div className={`${classes["gpt3__blog-heading"]}`}>
        <h1 className="gradient__text">
          A lot is happening, <br /> We are blogging about it.
        </h1>
      </div>
      <div className={classes["gpt3__blog_title-heading"]}>
        <button className={classes["gpt3__blog_title-btn"]} onClick={onClickHandler}>
          <p className="gradient__text">
            Visit Our Blog
          </p>
        </button>
      </div>
      <div className={classes["gpt3__blog-container"]}>
        {Array.from({ length: 5 }, (_, i) => (
          <Fragment key={i}>
            {i === 0 && (
              <div className={classes["gpt3__blog-container_groupA"]}>
                <Article
                  key={i}
                  imgRef={imgRefs.current[i]}
                  wrapperRef={wrapperRef}
                  imgUrl={posts[i]?.image.url}
                  date={posts[i]?.updatedAt}
                  text={posts[i]?.title}
                  slug={posts[i]?.slug}
                />
              </div>
            )}
            {i === 1 && (
              <div className={classes["gpt3__blog-container_groupB"]}>
                {Array.from({ length: 4 }, (_, j) => (
                  <Article
                    key={i + j}
                    imgRef={imgRefs.current[i + j]}
                    wrapperRef={wrapperRef}
                    imgUrl={posts[i + j]?.image.url}
                    date={posts[i + j]?.updatedAt}
                    text={posts[i + j]?.title}
                    slug={posts[i + j]?.slug}
                  />
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Blog;
