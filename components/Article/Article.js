import Link from "next/link";
import { RingLoader } from "react-spinners";

import classes from "./Article.module.css";

function Article({ imgUrl, date, text, imgRef, slug, wrapperRef }) {
  if (!slug) {
    return (
      <RingLoader
        color="#FFF"
        cssOverride={{ marginLeft: "auto", marginRight: "auto" }}
      />
    );
  }

  return (
    <div className={classes["gpt3__blog-container_article"]}>
      <div
        ref={wrapperRef}
        className={classes["gpt3__blog-container_article-image"]}
      >
        <Link href={`/blog/post/${slug}/view`}>
          <img src={imgUrl} ref={imgRef} alt={classes.blog_image} />
        </Link>
      </div>
      <div className={classes["gpt3__blog-container_article-content"]}>
        <div>
          <p>{date}</p>
          <Link href={`/blog/post/${slug}/view`}>
            <h3>{text}</h3>
          </Link>
        </div>
        <Link href={`/blog/post/${slug}/view`}>
          <p>Read the Full Article</p>
        </Link>
      </div>
    </div>
  );
}

export default Article;
