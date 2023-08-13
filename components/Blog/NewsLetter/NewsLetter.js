import { BiRightArrow } from "@react-icons/all-files/bi/BiRightArrow"

import classes from "./NewsLetter.module.css";

function NewsLetter() {
  return (
    <section className={`${classes.newsletter} section fade-in`}>
      <div className="base-container">
        <h2
          className={`${classes.title} ${classes["section-title"]}`}
          data-name="Newsletter"
        >
          Newsletter
        </h2>
        <div className={`${classes["newsletter__form_container"]}`}>
          <h6
            className={`${classes.title} ${classes["newsletter__form_container-title"]}`}
          >
            Subscribe to ArtificEon
          </h6>
          <p className={`${classes["newsletter__form_container-description"]}`}>
            Lorem ipsum dolor sit amet consectetur adipisicing quaerat
            dignissimos.
          </p>
          <form
            action=""
            className={`${classes["newsletter__form_container-form"]}`}
          >
            <input
              className={`${classes["newsletter__form_container-form_input"]}`}
              type="text"
              placeholder="Enter your email address"
            />
            <button
              className={`btn ${classes["newsletter__form_container-form_btn"]}`}
              type="submit"
            >
              <BiRightArrow />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default NewsLetter;
