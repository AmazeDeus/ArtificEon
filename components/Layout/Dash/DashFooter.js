import { useRouter } from "next/router";
import { HiHome } from "@react-icons/all-files/hi/HiHome"
import useAuth from "../../../hooks/use-auth";

import classes from "./DashFooter.module.css";

function DashFooter({ displayHome }) {
  const router = useRouter();
  const { pathname } = useRouter();

  const { username, status } = useAuth();

  const onGoHomeClicked = () => router.push("/dash");

  let goHomeButton = null;

  if (pathname !== "/dash") {
    goHomeButton = (
      <button
        className={`${classes["dash-footer__button"]} ${classes["dash-footer__icon-button"]}`}
        title="Home"
        onClick={onGoHomeClicked}
      >
        <HiHome />
      </button>
    );
  }

  const content = (
    <footer className={classes["dash-footer"]}>
      {displayHome && goHomeButton}
      <p>Current User: {username ? username : "Guest"}</p>
      <p>Status: {status}</p>
    </footer>
  );
  
  return content;
}
export default DashFooter;
