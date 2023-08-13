import { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import { ContainerWidthProvider } from "../../store/containerWidth-context";
import { getLayout } from "../../components/Layout/Blog/PostRoomLayout";
import dynamic from "next/dynamic";

import FeaturedSection from "../../components/Blog/Featured/FeaturedSection";
import { useGetPostsQuery } from "../../store/posts/postsApiSlice";
const DynamicQuickRead = dynamic(() =>
  import("../../components/Blog/QuickRead/QuickRead")
);
const DynamicOldPosts = dynamic(() =>
  import("../../components/Blog/OldPosts/OldPosts")
);
const DynamicPopularTags = dynamic(() =>
  import("../../components/Blog/PopularTags/PopularTags")
);
const DynamicNewsLetter = dynamic(() =>
  import("../../components/Blog/NewsLetter/NewsLetter")
);
const DynamicFooter = dynamic(() =>
  import("../../containers").then((mod) => mod.Footer)
);

function index() {
  const midRef = useRef(null);
  const bottomRef = useRef(null);
  const [showMid, setShowMid] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const {
    data: posts,
    isError,
    error,
    isSuccess,
  } = useGetPostsQuery("postsList", {
    pollingInterval: 60000,
  }); // pollingInterval - Re-query the data every 60 s.
  // postsList label will be viewable in Redux devtools

  useEffect(() => {
    if (!isSuccess) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            switch (entry.target) {
              case midRef.current:
                setShowMid(true);
                break;
              case bottomRef.current:
                setShowBottom(true);
                break;
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(midRef.current);
    showMid &&
      setTimeout(() => {
        observer.observe(bottomRef.current);
      }, 1000);
    return () => observer.disconnect();
  }, [isSuccess, showMid]);

  let content;

  /* if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  } */

  if (isSuccess) {
    content = (
      <ContainerWidthProvider>
        <Layout>
          <FeaturedSection posts={posts} />
          <div id="blog-dynamic-mid" ref={midRef}>
            {showMid && <DynamicQuickRead posts={posts} />}
            {showMid && <DynamicOldPosts posts={posts} />}
          </div>
          {showMid && (
            <div id="blog-dynamic-bottom" ref={bottomRef}>
              {showBottom && <DynamicPopularTags />}
              {showBottom && <DynamicNewsLetter />}
              {showBottom && <DynamicFooter />}
            </div>
          )}
        </Layout>
      </ContainerWidthProvider>
    );
  }

  return content;
}

index.getLayout = getLayout;

export default index;
