import ActionButtons from "../actionButtons";

import classes from "./NewPost.module.css";

function News() {
  return (
    <div className={`${classes.newPost}`}>
      <h1>New Post:</h1>
      <div className={`${classes.newPost__button}`}>
        <ActionButtons
          newHandler={true}
          editHandler={false}
          deleteHandler={false}
        />
      </div>
    </div>
  );
}

export default News;
