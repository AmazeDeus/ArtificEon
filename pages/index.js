import { useState, useEffect, Fragment, memo } from "react";
import dynamic from "next/dynamic";
import ScrollButton from "../components/utils/ScrollButton";
import { MongoClient } from "mongodb";
import { getLayout } from "../components/Layout/SimplePersistLogin";

import { ContainerWidthProvider } from "../store/containerWidth-context";
import useTitle from "../hooks/use-title";

import classes from "./index.module.css";

import { CTA, Brand, HomeNavbar } from "../components";
import { WhatGPT3, Header, Possibility, Features } from "../containers";

const DynamicBlog = dynamic(() =>
  import("../containers").then((mod) => mod.Blog)
);
const DynamicFooter = dynamic(() =>
  import("../containers").then((mod) => mod.Footer)
);

function HomePage({ posts }) {
  useTitle("Artific Eon");

  const [showMid, setShowMid] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            switch (entry.target.id) {
              case "dynamic-bottom":
                setShowBottom(true);
                break;
              case "dynamic-mid":
                setShowMid(true);
                break;
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(document.querySelector("#dynamic-mid"));

    return () => observer.disconnect();
  }, []);

  return (
    <ContainerWidthProvider>
      <Fragment>
        <div id="overlays"></div>
        <div className={classes.Home}>
          <div className="gradient__bg">
            <HomeNavbar />
            <Header />
          </div>
          <Brand />
          <WhatGPT3 />
          <Features />
          <Possibility />
          <div id="dynamic-mid">
            <CTA />
            {showMid && <DynamicBlog posts={posts} />}
            {showMid && <DynamicFooter displayMessage={true} />}
          </div>
          <ScrollButton />
        </div>
      </Fragment>
    </ContainerWidthProvider>
  );
}

const memoizedHomePage = memo(HomePage);

export async function getStaticProps() {
  // Connect to mongodb
  const client = await MongoClient.connect(
    process.env.DB_URI || "mongodb://127.0.0.1:27017/artificeon"
  );
  const db = client.db();

  const postsCollection = db.collection("posts");

  const posts = await postsCollection.find().toArray();

  client.close();

  // Returned 5 most recent posts and sorted based on the "updatedAt" value
  return {
    props: {
      posts: posts
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map((post) => ({
          title: post.title,
          slug: post.slug,
          updatedAt: new Date(post.updatedAt).toLocaleString("en-EU", {
            day: "numeric",
            month: "long",
          }),
          image: {
            url: post.images[0].url,
            // _id: post.images[0]._id.toString(),
          },
        })),
    },
    revalidate: 1,
  };
}

memoizedHomePage.getLayout = getLayout;

export default memoizedHomePage;
