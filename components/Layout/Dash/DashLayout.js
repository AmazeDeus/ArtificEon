import { getLayout as getPrefetchLayout } from "../Prefetch";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import classes from "./DashLayout.module.css";

const DashLayout = ({ children }) => {
  const [content, setContent] = useState();
  const { pathname } = useRouter();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      setContent(
        <main className={classes.main}>
          <DashHeader />
          <div className={classes["dash-container"]}>{children}</div>
          <DashFooter displayHome={true} />
        </main>
      );
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, [pathname]);

  return content;
};

export const getLayout = (page) =>
  getPrefetchLayout(<DashLayout>{page}</DashLayout>);

export default DashLayout;