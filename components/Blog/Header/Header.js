import { Fragment } from "react";
import Navbar from "../../Navbar/Navbar";
import Search from "../../utils/Search";

import classes from "./Header.module.css"

function Header() {
  return (
    <Fragment>
      <header id="nav-header" className={classes.header}>
        <div className={classes.header__left} />
        <Navbar />
      </header>
      <Search />
    </Fragment>
  );
}

export default Header;
