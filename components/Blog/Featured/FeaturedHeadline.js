import classes from "./FeaturedHeadline.module.css";

function FeaturedHeadline() {
  return (
    <div className={`${classes["headline-banner"]}`}>
      <h3 className={`${classes["headline-banner__headline"]} fancy-border`}>
        <span className="place-items-center">Breaking news</span>
      </h3>
      <span className={`${classes["headline-banner__description"]}`}>
        Apple announces a new partnership...
      </span>
    </div>
  );
}

export default FeaturedHeadline;
