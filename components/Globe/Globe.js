import { useState } from "react";
import { geoPath, geoOrthographic } from "d3";
import useAnimationFrame from "../../hooks/use-animationFrame";
import { PulseLoader } from "react-spinners";
import { useGetGeoQuery } from "../../store/geoData/geoDataSlice";

import classes from "./Globe.module.css";

function Globe() {
  const [rotation, setRotation] = useState(0);

  const { data, isLoading, isSuccess, isError, error} =
    useGetGeoQuery("geoData", {
      refetchOnMountOrArgChange: true,
    });
  useAnimationFrame(setRotation, isSuccess);

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const projection = geoOrthographic()
      .fitSize([900, 900], data)
      .rotate([rotation]);

    const geoGenerator = geoPath().projection(projection);

    const pathString = geoGenerator(data);

    content = (
      <div className={classes.wrapper}>
        <svg viewBox="0 -20 900 250" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter
              id="glow"
              width="100%"
              height="100%"
              x="0"
              y="-1rem"
              filterUnits="userSpaceOnUse"
            >
              <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
              <feGaussianBlur
                in="shadowOffsetOuter1"
                result="shadowBlurOuter1"
                stdDeviation="5"
              />
              <feColorMatrix
                in="shadowBlurOuter1"
                result="shadowMatrixOuter1"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
              />
              <feMerge>
                <feMergeNode in="shadowMatrixOuter1" />
              </feMerge>
            </filter>
            <path id="path-2" className={classes.path__2} d={pathString} />
            <path id="path-1" className={classes.path} d={pathString} />
          </defs>
          <g id="glowHandler" fill="none" fillRule="evenodd">
            <g id="glowTargeter">
              <use fill="#000" filter="url(#glow)" xlinkHref="#path-1" />
              <use fill="#FFF" xlinkHref="#path-1" />
            </g>
          </g>
        </svg>
        <div className={classes["gpt3__header-image__overlay"]}></div>
      </div>
    );
  }

  return content;
}

export default Globe;
