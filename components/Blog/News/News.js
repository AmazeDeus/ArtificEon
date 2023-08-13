import Image from "next/image";
import TempImage from "../../../public/assets/ai.png"

import classes from "./News.module.css";

function News() {
  return (
    <a href="#" className={`${classes["trending-news"]}`}>
      <div className={`${classes["trending-news__img-box"]}`}>
        <span
          className={`${classes["trending-news__img-box_number"]} place-items-center`}
        >
          01
        </span>
        <Image
          src={TempImage.src}
          fill
          sizes="100%"
          alt="Thumbnail"
          className={`${classes["trending-news__img-box_image"]}`}
        />
      </div>
      <div className={`${classes["trending-news__data-box"]}`}>
        <div className={`${classes["trending-news__data-box_article-data"]}`}>
          <span>23 Dec 2021</span>
          <span
            className={`trending-news__data-box_article-data_spacer`}
          ></span>
          <span>3 Min read</span>
        </div>
        <h3 className={`${classes["trending-news__data-box_article-title"]}`}>
          Sample article title
        </h3>
      </div>
    </a>
  );
}

export default News;
