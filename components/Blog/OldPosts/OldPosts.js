import { memo } from "react";
import dynamic from "next/dynamic";
import Article from "../Article/Article";
import Slider from "../../Swiper/Slider";
import { useGetSortedPosts } from "../../../hooks/use-getSortedPosts";
const DynamicPulseLoader = dynamic(() => import("react-spinners/PulseLoader"));

import classes from "./OldPosts.module.css";

function OldPosts({ posts }) {
  const { sortedPosts: olderPosts } = useGetSortedPosts(posts, 6, "desc", 3);

  if (!olderPosts) return <DynamicPulseLoader color={"#FFF"} />;

  return (
    <section className="older-posts section fade-in">
      <div className="base-container">
        <h2
          className={`${classes.title} ${classes["section-title"]}`}
          data-name="Older posts"
        >
          Older posts
        </h2>
        <div className={`${classes["older-posts__grid-wrapper"]}`}>
          <Slider>
            {Array.from({ length: 6 }, (_, i) => (
              <Article
                key={i}
                post={olderPosts[i]}
                setSwiper={true}
                imageWrappers={"div"}
                imageWrapperClasses={{
                  parentClasses: `${classes["older-posts__grid-wrapper__image-wrapper"]}`,
                }}
              />
            ))}
          </Slider>
        </div>
        <div className={`${classes["older-posts__see-more-container"]}`}>
          <a
            href="#"
            className={`btn ${classes["older-posts__see-more-container_see-more-btn"]} place-items-center`}
          >
            See more <i className="ri-arrow-right-s-line"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

function areEqual(prevProps, nextProps) {
  return prevProps.olderPosts === nextProps.olderPosts;
}

const memoizedOldPosts = memo(OldPosts, areEqual);

export default memoizedOldPosts;
