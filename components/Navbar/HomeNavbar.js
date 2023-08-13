import { useState, Fragment } from "react";
import { RiMenu3Line } from "@react-icons/all-files/ri/RiMenu3Line"
import { RiCloseLine } from "@react-icons/all-files/ri/RiCloseLine"
import logo from "../../public/assets/logo.svg";
import Link from "next/link";
import Image from "next/image";
import Logout from "../utils/Logout";
import useAuth from "../../hooks/use-auth";
import useScreenThreshold from "../../hooks/use-screenThreshold";

import classes from "./HomeNavbar.module.css";

const Menu = () => (
  <>
    <p>
      <a href="#home">Home</a>
    </p>
    <p>
      <a href="#wgpt3">What is GPT?</a>
    </p>
    <p>
      <a href="#dynamic-mid">Case Studies</a>
    </p>
    <p>
      <Link href="/blog">Our Blog</Link>
    </p>
  </>
);

// BEM -> Block Element Modifier

function HomeNavbar(props) {
  const { username, isEmployee, isManager, isAdmin } = useAuth();
  const [navActive, setNavActive] = useState(false);

  const toggleMenu = () => {
    setNavActive((prevState) => !prevState);
  };

  // Toggle the hamburger menu off if screen treshold is fulfilled.
  // For cases where the menu was still active when the hamburger menu was replaced with the normal navigation menu.
  useScreenThreshold("min-950px", toggleMenu, navActive);

  let signButtons;

  if (!username) {
    signButtons = (
      <div className={classes["gpt3__navbar-sign"]}>
        <button type="button">
          <Link href="/user/signin">Sign in</Link>
        </button>
        <button type="button">
          <Link href="/user/signup">Sign up</Link>
        </button>
      </div>
    );
  } else {
    signButtons = (
      <Fragment>
        <span>Sign out</span>
        <Logout />
      </Fragment>
    );
  }

  let dashButton = null;
  if (isManager || isAdmin || isEmployee) {
    dashButton = (
      <div className={`${classes["gpt3__navbar-dash"]} ${navActive && classes["gpt3__navbarActive-dash"]}`}>
        <Link href="/dash">Access /dash</Link>
      </div>
    );
  }

  return (
    <div className={classes.gpt3__navbar}>
      <div className={classes["gpt3__navbar-links"]}>
        <div className={classes["gpt3__navbar-links_logo"]}>
          <Image src={logo.src} width={62.56} height={16.02} alt="logo" />
        </div>
        <div className={classes["gpt3__navbar-links_container"]}>
          <Menu />
        </div>
      </div>
      {!navActive && signButtons}
      {!navActive && dashButton}
      <div className={classes["gpt3__navbar-menu"]}>
        {navActive ? (
          <RiCloseLine
            color="#fff"
            size={27}
            onClick={() => setNavActive(false)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setNavActive(true)}
          />
        )}
        {navActive && (
          <div
            className={`${classes["gpt3__navbar-menu_container"]} scale-up-center`}
          >
            <div className={classes["gpt3__navbar-menu_container-links"]}>
              <Menu />
              <div
                className={classes["gpt3__navbar-menu_container-links-sign"]}
              >
                {signButtons}
                {dashButton}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeNavbar;
