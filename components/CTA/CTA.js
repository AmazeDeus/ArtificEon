import classes from "./CTA.module.css";

function CTA() {
  return (
    <div className={classes.gpt3__cta}>
      <div className={classes["gpt3__cta-content"]}>
        <p>Request Early Access to Get Started</p>
        <h3>Register Today & start exploring the endless possibilities.</h3>
      </div>
      <div className={classes["gpt3__cta-btn"]}>
        <button type="button">Get Started</button>
      </div>
    </div>
  );
}

export default CTA;
