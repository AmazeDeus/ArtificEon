import { getSimpleLayout as getRequireAuthLayout } from "../Auth/RequireAuth";
import { getLayout as getRequireProtectedAuthLayout } from "../Auth/RequireAuth";
import { getLayout as getRequireSimpleAuthLayout } from "../SimplePersistLogin";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import DashFooter from "../Dash/DashFooter";
import { ContainerWidthProvider } from "../../../store/containerWidth-context";
import { store } from "../../../store";
import { postsApiSlice } from "../../../store/posts/postsApiSlice";

import classes from "./PostRoomLayout.module.css";

const PostRoomLayout = ({ children }) => {
  const [content, setContent] = useState();
  const { pathname } = useRouter();
  const effectRan = useRef(false);

  useEffect(() => {
    store.dispatch(
      postsApiSlice.util.prefetch("getPosts", "postsList", {
        force: true,
        overrideExisting: true,
      })
    );

    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      setContent(
        <ContainerWidthProvider>
          <main className={classes.main}>
            <div className={classes["post-container"]}>{children}</div>
            <DashFooter />
          </main>
        </ContainerWidthProvider>
      );
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, [pathname]);

  return content;
};

export const getSimpleLayout = (page) =>
  getRequireSimpleAuthLayout(<PostRoomLayout>{page}</PostRoomLayout>);

export const getLayout = (page) =>
  getRequireAuthLayout(<PostRoomLayout>{page}</PostRoomLayout>);

export const getProtectedLayout = (page) =>
  getRequireProtectedAuthLayout(<PostRoomLayout>{page}</PostRoomLayout>);

export default PostRoomLayout;
