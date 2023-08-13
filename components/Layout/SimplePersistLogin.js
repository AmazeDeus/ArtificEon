import { useState, useEffect, useRef, Fragment } from "react";
import { useRouter } from "next/router";
import { getLayout as getSiteLayout } from "./SiteLayout";
import { useRefreshMutation } from "../../store/authApiSlice";
import { useSelector } from "react-redux";
import usePersist from "../../hooks/use-persist";
import { selectCurrentToken } from "../../store/authSlice";

const HomeLayout = ({ children }) => {
  const [content, setContent] = useState();
  const [refresh] = useRefreshMutation();
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const { pathname } = useRouter();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          //const response =
          await refresh();
          //const { accessToken } = response.data
        } catch (err) {
          console.error(err);
        }
      };

      if (!token && persist) verifyRefreshToken();

      setContent(<Fragment>{children}</Fragment>);
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, [pathname]);

  return content;
};

export const getLayout = (page) =>
  getSiteLayout(<HomeLayout>{page}</HomeLayout>);

export default HomeLayout;
