import Link from "next/link";

import classes from "./NavItem.module.css";

const NavItem = ({ text, href, active }) => {
  return (
    <Link href={href}>
      <p className={`${classes.nav__link} ${active ? classes.active : ""}`}>{text}</p>
    </Link>
  );
};

export default NavItem;
