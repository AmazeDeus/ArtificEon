import Image from "next/image";
import gpt3Logo from "../../public/assets/logo.svg";

import classes from "./Footer.module.css";

function Footer({ displayMessage }) {
  return (
    <div className={`${classes.gpt3__footer} section__padding`}>
      {displayMessage && (
        <div className={classes["gpt3__footer-heading"]}>
          <h1 className="gradient__text">
            Do you want to step in to the future before others
          </h1>
        </div>
      )}

      {displayMessage && (
        <div className={classes["gpt3__footer-btn"]}>
          <p>Request Early Access</p>
        </div>
      )}

      <div className={classes["gpt3__footer-links"]}>
        <div className={classes["gpt3__footer-links_logo"]}>
          <Image src={gpt3Logo.src} width={118} height={30} alt="gpt3_logo" className={classes["gpt3__footer-links_logo-image"]} />
          <p>
            Crechterwoord K12 182 DK Alknjkcb, <br /> All Rights Reserved
          </p>
        </div>
        <div className={classes["gpt3__footer-links_div"]}>
          <h4>Links</h4>
          <p>Overons</p>
          <p>Social Media</p>
          <p>Counters</p>
          <p>Contact</p>
        </div>
        <div className={classes["gpt3__footer-links_div"]}>
          <h4>Company</h4>
          <p>Terms & Conditions </p>
          <p>Privacy Policy</p>
          <p>Contact</p>
        </div>
        <div className={classes["gpt3__footer-links_div"]}>
          <h4>Get in touch</h4>
          <p>Crechterwoord K12 182 DK Alknjkcb</p>
          <p>085-132567</p>
          <p>info@payme.net</p>
        </div>
      </div>

      <div className={classes["gpt3__footer-copyright"]}>
        <p>@2021 ArtificEon. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
