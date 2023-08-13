import Image from "next/image";
import people from "../../public/assets/people.png";
import Globe from "../../components/Globe/Globe";

import classes from "./Header.module.css";

function Header() {
  return (
    <div className={`${classes.gpt3__header}`} id="home">
      <div className={classes["gpt3__header-content"]}>
        <h1
          className={`${classes["gpt3__header-content__title"]} gradient__text`}
        >
          Let's Build Something Amazing with GPT Today
        </h1>
        <div className={classes["gpt3__header-content__text"]}>
          <p>
            Yet bed and for travelling assistance indulgence unpleasing. Not
            thoughts all axercise blessing. Indulgence way everything joy
            alteration boisterous the attachment. Party we years to order allow
            asked of.
          </p>
          <p>Register now and take part in everything we have to offer!</p>
        </div>
        <div className={classes["gpt3__header-content__input"]}>
          <input type="email" placeholder="Your Email Address" />
          <button type="button">Get Started</button>
        </div>
        <div className={classes["gpt3__header-content__people"]}>
          <Image src={people.src} width={181.79} height={38} alt="people" />
          <p>1600 people requested access in the last 24 hours</p>
        </div>
      </div>
      <div className={classes["gpt3__header-image"]}>
        <Globe />
      </div>
    </div>
  );
}

export default Header;
