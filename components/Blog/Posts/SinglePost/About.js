import { RiTwitterLine } from "@react-icons/all-files/ri/RiTwitterLine";
import { RiFacebookCircleLine } from "@react-icons/all-files/ri/RiFacebookCircleLine";
import { RiInstagramLine } from "@react-icons/all-files/ri/RiInstagramLine";

import classes from "./Post.module.css";

function About({ post }) {
  return (
    <div className={`${classes["blog-post__container_author-about"]}`}>
      <h3 className={`${classes["blog-post__container_author-about_name"]}`}>
        {post.displayedUsername}
      </h3>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque quis
        repellat rerum, possimus cumque dolor repellendus eligendi atque
        explicabo exercitationem id.
      </p>
      <span
        className={`${classes["blog-post__container_author-about_socialsTitle"]}`}
      >
        Socials
      </span>
      <hr />
      <ul
        className={`list ${classes["blog-post__container_author-about_socials"]}`}
      >
        <li className="list-item">
          <a href="#" className="list-link">
            <RiInstagramLine />
          </a>
        </li>
        <li className="list-item">
          <a href="#" className="list-link">
            <RiFacebookCircleLine />
          </a>
        </li>
        <li className="list-item">
          <a href="#" className="list-link">
            <RiTwitterLine />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default About;
