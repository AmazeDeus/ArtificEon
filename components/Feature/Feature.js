import classes from "./Feature.module.css";

function Feature({ title, text, barGlow }) {
  let featureBar;

  if (barGlow) {
    featureBar = (
      <div className={classes["gpt3__features-container__feature-title_fancybar"]}>
        <div className={classes["gpt3__features-container__feature-title_fancybar-scanner"]} />
      </div>
    );
  } else {
      featureBar = (
        <div className={classes["gpt3__features-container__feature-title_bar"]} />
      );
    }

  return (
    <div className={classes["gpt3__features-container__feature"]}>
      <div className={classes["gpt3__features-container__feature-title"]}>
        {featureBar}
        <h1>{title}</h1>
      </div>
      <div className={classes["gpt3__features-container_feature-text"]}>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Feature;
