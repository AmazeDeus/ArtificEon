import TrendingNews from "../News/TrendingNews";
import NewPost from "../NewPost/NewPostButton";

import classes from "./Sidebar.module.css";

function Sidebar() {
  return (
    <div className={`${classes.sidebar} d-grid`}>
      <NewPost />
      <TrendingNews />
    </div>
  );
}

export default Sidebar;
