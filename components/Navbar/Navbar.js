import { useState } from "react";
import { HiMoon } from "@react-icons/all-files/hi/HiMoon"
import { HiSun } from "@react-icons/all-files/hi/HiSun"
import { HiOutlineSearch } from "@react-icons/all-files/hi/HiOutlineSearch"
import { APP_NAME } from "../../config";
import Link from "next/link";
import NavList from "./NavList";
import Logout from "../utils/Logout";
import NewsButton from "../Blog/Header/NewsButton";
import useAuth from "../../hooks/use-auth";
import useScreenThreshold from "../../hooks/use-screenThreshold";

import classes from "./Navbar.module.css";

function Navbar() {
  const { username } = useAuth();

  const [navActive, setNavActive] = useState(false);

  const toggleMenu = () => {
    setNavActive((prevState) => !prevState);
  };

  // Toggle the hamburger menu off if screen treshold is fulfilled.
  // For cases where the menu was still active when the hamburger menu was replaced with the normal navigation menu.
  useScreenThreshold("min-1340px", toggleMenu, navActive);

  const SIGN = [
    { text: "Sign in", href: "/user/signin" },
    { text: "Sign up", href: "/user/signup" },
  ];

  const MENU_LIST = [
    { text: "Home", href: "/blog" },
    { text: "Categories", href: "#" },
    { text: "Reviews", href: "#" },
    { text: "News", href: "#" },
    { text: "Membership", href: "#" },
    { text: "Contact", href: "#" },
  ];

  if (!username) {
    MENU_LIST.push(
      { text: "Sign in", href: "/user/signin" },
      { text: "Sign up", href: "/user/signup" }
    );
  }

  let navigation;
  let menuClasses = !navActive
    ? `${classes["blog__header-navbar_menu"]}`
    : `${classes["blog__header-navbar_menu"]} ${classes.showMenu}`;

  // console.log(menuClasses);

  if (!navActive) {
    navigation = (
      <ul className={`${classes["blog__header-navbar_list"]}`}>
        <NavList
          list={MENU_LIST}
          wrappers={"li"}
          setNavActive={(newVal) => setNavActive(newVal)}
        />
      </ul>
    );
  } else {
    navigation = (
      <NavList
        list={MENU_LIST}
        wrappers={"div"}
        setNavActive={(newVal) => setNavActive(newVal)}
      />
    );
  }

  return (
    <div className={classes.blog__header} id="header">
      <nav className={`${classes["blog__header-navbar"]} base-container`}>
        <h2 className={`${classes["blog__header-navbar_logo"]}`}>
          <Link href="/">
            <span>{APP_NAME}</span>
          </Link>
        </h2>
        <div className={menuClasses} id="menu">
          {!navActive && <NewsButton />}
          <div
            className={`${navActive ? classes.active : ""} ${
              classes["nav__menu-list"]
            }`}
          >
            {navActive && <NewsButton />}
            {navigation}
          </div>
        </div>
        <div
          className={`${classes["blog__header-navbar_list"]} ${classes["blog__header-navbar_list-right"]}`}
        >
          <button className="btn place-items-center" id="theme-toggle-btn">
            <i className="ri-sun-line sun-icon">
              <HiSun />
            </i>
            <i className="ri-moon-line moon-icon">
              <HiMoon />
            </i>
          </button>

          <button className="btn place-items-center" id="search-icon">
            <i className="ri-search-line">
              <HiOutlineSearch />
            </i>
          </button>
          <div
            className={`${classes["blog__header-navbar_list-sign"]}`}
          >
            <NavList list={!username ? SIGN : <Logout />} />
          </div>
          <div
            onClick={toggleMenu}
            className={`${classes["nav__menu-bar"]} ${
              !navActive ? classes["no-animation"] : classes.active
            }`}
          >
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
