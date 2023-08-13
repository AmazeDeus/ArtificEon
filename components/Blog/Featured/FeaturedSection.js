import { memo } from "react";
import dynamic from "next/dynamic";
import Sidebar from "../Sidebar/Sidebar";
import FeaturedHeadline from "./FeaturedHeadline";
import Article from "../Article/Article";
import { useGetSortedPosts } from "../../../hooks/use-getSortedPosts";
import { useSortCollectionsByImageOrientation } from "../../../hooks/use-sortCollectionByImageOrientation";
const DynamicPulseLoader = dynamic(() => import("react-spinners/PulseLoader"));

import classes from "./FeaturedSection.module.css";
import useAuth from "../../../hooks/use-auth";

function FeaturedSection({ posts }) {
  const { sortedPosts: recentPosts } = useGetSortedPosts(posts, 3, "desc", 0);
  const {roles} = useAuth();
  console.log(roles)
  let sortedCollections;
  if (recentPosts) {
    sortedCollections = useSortCollectionsByImageOrientation(
      recentPosts,
      "images[0].url",
      "verticalFirst"
    );
  }

  if (!sortedCollections) {
    return <DynamicPulseLoader color={"#FFF"} />;
  }

  return (
    <section
      className={`${classes["featured-articles"]} section ${classes["section-header-offset"]}`}
    >
      <div
        className={`${classes["featured-articles__container"]} base-container d-grid`}
      >
        <div
          className={`${classes["featured-articles__container-content"]} d-grid`}
        >
          <FeaturedHeadline />
          <Article
            post={sortedCollections[0]}
            tag={"Technology"}
            displayCategory={true}
          />
          <Article
            post={sortedCollections[1]}
            tag={"AI"}
            displayCategory={true}
          />
          <Article
            post={sortedCollections[2]}
            tag={"NewTech"}
            displayCategory={true}
          />
        </div>
        <Sidebar />
      </div>
    </section>
  );
}

function areEqual(prevProps, nextProps) {
  return prevProps.sortedCollections === nextProps.sortedCollections;
}

const memoizedFeaturedSection = memo(FeaturedSection, areEqual);

export default memoizedFeaturedSection;
