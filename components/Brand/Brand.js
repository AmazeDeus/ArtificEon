import { google, slack, atlassian, dropbox, shopify } from "./imports";
import Image from "next/image";

import classes from "./Brand.module.css";

function Brand() {
  const images = [
    { src: google.src, width: 150, height: 35, alt: "google" },
    { src: slack.src, width: 150, height: 35, alt: "slack" },
    { src: atlassian.src, width: 150, height: 35, alt: "atlassian" },
    { src: dropbox.src, width: 150, height: 35, alt: "dropbox" },
    { src: shopify.src, width: 150, height: 35, alt: "shopify" },
  ];

  return (
    <div className={`${classes.gpt3__brand} ${classes.section__padding}`}>
      {images.map((image) => (
        <div key={image.alt}>
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
          />
        </div>
      ))}
    </div>
  );
}

export default Brand;
