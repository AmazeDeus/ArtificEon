import News from "./News";

import classes from "./TrendingNews.module.css";

function TrendingNews() {
  return (
    <>
      <h3 className={`${classes["featured-content-title"]}`}>Trending news</h3>
      {Array.from({ length: 5 }, (_, i) => (
        <News key={i} />
      ))}
    </>
  );
}

export default TrendingNews;
