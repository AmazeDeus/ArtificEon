import Image from "next/image";
import tempImage from "../../../public/assets/ai.png";

import classes from "./Tag.module.css";

function Tag({ tag }) {
  return (
    <a href="#" className={classes.tag}>
      <span className={`${classes["tag-name"]}`}>{tag}</span>
      <Image
        src={tempImage}
        fill
        sizes="100%"
        alt="Background image"
        className={`${classes["tag-image"]}`}
      />
    </a>
  );
}

export default Tag;
