import Link from "next/link";
import { useRouter } from "next/router";
import DashButtons from "../../ui/buttons/DashButtons";

import classes from "./DashHeader.module.css";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

function DashHeader() {

  const router = useRouter();
  const { pathname } = router;

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = `${classes["dash-header__container--small"]}`;
  }

  let errClass = "offscreen";
  let errMessage;
  const setErrorClass = (value, message) => {
    value ? (errClass = "errmsg") : "offscreen";
    message ? (errMessage = message) : null;
  };

  const content = (
    <>
      <p className={errClass}>{errMessage && errMessage}</p>

      <header className={classes["dash-header"]}>
        <div className={`${classes["dash-header__container"]} ${dashClass}`}>
          <Link href={"/"}>
            <h1 className={classes["dash-header__title"]}>ArtificEon</h1>
          </Link>
          <nav className={classes["dash-header__nav"]}>
            <DashButtons hasError={setErrorClass} />
          </nav>
        </div>
      </header>
    </>
  );

  return content;
}

export default DashHeader;
