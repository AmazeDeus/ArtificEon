import { memo } from "react";
import dynamic from "next/dynamic";
import Slider from "../../Swiper/Slider";
import Article from "../Article/Article";
import { useGetSortedPosts } from "../../../hooks/use-getSortedPosts";
const DynamicPulseLoader = dynamic(() => import("react-spinners/PulseLoader"));

import classes from "./QuickRead.module.css";

function QuickRead({ posts }) {
  // Showing 6 oldest to newest posts as an example:
  const { sortedPosts: olderPosts } = useGetSortedPosts(posts, 6, "asc");

  if (!olderPosts) return <DynamicPulseLoader color={"#FFF"} />;

  return (
    <section className={`quick-read section fade-in`}>
      <div className="base-container">
        <h2
          className={`title ${classes["quick-read__section-title"]}`}
          data-name="Quick read"
        >
          Quick read
        </h2>
        <Slider>
          {Array.from({ length: 6 }, (_, i) => (
            <Article key={i} post={olderPosts[i]} setSwiper={true} />
          ))}
        </Slider>
      </div>
    </section>
  );
}

function areEqual(prevProps, nextProps) {
  return prevProps.olderPosts === nextProps.olderPosts;
}

const memoizedQuickRead = memo(QuickRead, areEqual);

export default memoizedQuickRead;
