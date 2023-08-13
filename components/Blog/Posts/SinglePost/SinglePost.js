import { memo, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Banner from "./Banner";
import Content from "./Content";
import About from "./About";
import { useGetSinglePost } from "../../../../hooks/use-getSinglePost";
const DynamicPulseLoader = dynamic(() => import("react-spinners/PulseLoader"));

import classes from "./Post.module.css";

function Post() {
  const router = useRouter();
  const { slug } = router.query;

  const post = useGetSinglePost(null, slug);

  // pid - query from useEditorConfig.js
  // handlePopstate - On browser back button. Redirect to "/blog" instead of trying to route back to the editor route
  useEffect(() => {
    if(router.query.bid || router.query.pid) {
      // Currently there is an issue with how the useEditorConfig hook and/or the editor component handles un-mounting on successful Post submission or browser back button press.
      // router.reload() for brute handling said issue for now.
      router.reload()
    }
    const handlePopstate = () => {
      if (router.query.pid) {
        router.push("/blog");
      }
    };
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  if (!post) return <DynamicPulseLoader color={"#FFF"} />;

  // console.log(post);

  const content = (
    <section className={`${classes["blog-post"]} section-header-offset`}>
      <div className={`${classes["blog-post__container"]} base-container`}>
        <Banner post={post} />
        <Content post={post}>
          <About post={post} />
        </Content>
      </div>
    </section>
  );

  return content;
}

const memoizedPost = memo(Post);

export default memoizedPost;
