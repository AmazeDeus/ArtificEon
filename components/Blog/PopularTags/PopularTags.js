import Tag from "./Tag";

import classes from "./PopularTags.module.css";

function PopularTags() {
  const tags = ["#AI", "#AR/VR", "#Technology", "#NewTech", "#Computers", "#Events"];

  return (
    <section className={`${classes["popular-tags"]} section fade-in`}>
      <div className="base-container">
        <h2
          className={`${classes.title} ${classes["section-title"]}`}
          data-name="Popular tags"
        >
          Popular tags
        </h2>
        <div className={`${classes["popular-tags__container"]} d-grid`}>
          {tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularTags;
