import Link from "next/link";

import classes from "./NewsButton.module.css";

function NewsButton() {
  return (
    <div className={classes.newsbtn}>
      <Link href="#" className={classes.newsbtn__button}>
        Sign up to our Newsletter
      </Link>
    </div>
  );
}

export default NewsButton;
