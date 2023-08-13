import { Feature } from "../../components";

import classes from "./WhatGPT3.module.css";

function WhatGPT3() {
  return (
    <div className={`${classes.gpt3__whatgpt3} section__margin`} id="wgpt3">
      <div className={classes["gpt3__whatgpt3-feature"]}>
        <Feature
          title="What is GPT-3"
          text="We so opinion friends me message as delight. Whole front do of plate heard oh ought. His defective nor convinced residence own. Connection has put impossible own apartments boisterous. At jointure ladyship an insisted so humanity he. Friendly bachelor entrance to on by."
          barGlow={true}
        />
      </div>
      <div className={classes["gpt3__whatgpt3-heading"]}>
        <h1 className="gradient__text">
          The possibilities are beyond your imagination
        </h1>
        <p>Explore The Library</p>
      </div>
      <div className={classes["gpt3__whatgpt3-container"]}>
        <Feature
          title="Chatbots"
          text="We so opinion friends me message as delight. Whole front do of plate heard oh ought. "
          barGlow={true}
        />
        <Feature
          title="Knowledgebase"
          text="At jointure ladyship an insisted so humanity he. Friendly bachelor entrance to on by. As put impossible own apartments b"
          barGlow={true}
        />
        <Feature
          title="Education"
          text="At jointure ladyship an insisted so humanity he. Friendly bachelor entrance to on by. As put impossible own apartments b"
          barGlow={true}
        />
      </div>
    </div>
  );
}

export default WhatGPT3;
