import { useState, useEffect, useRef } from "react";
import { HiHome } from "@react-icons/all-files/hi/HiHome";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaCodepen } from "@react-icons/all-files/fa/FaCodepen";
import { Resizable } from "re-resizable";
import NotesList from "./NotesList";
import FilterOptions from "./FilterOptions";
import useAuth from "../../hooks/use-auth";

import classes from "./NotesList.module.css";

function Nav() {
  return (
    <div className={classes.nav}>
      <a href="#">
        <HiHome />
      </a>
      <a href="#" target="_blank">
        <FaTwitter />
      </a>
      <a href="#" target="_blank">
        <FaGithub />
      </a>
      <a href="#" target="_blank">
        <FaCodepen />
      </a>
    </div>
  );
}

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
};

function List() {
  const { isManager, isAdmin } = useAuth();
  const wrapperRef = useRef();
  const [filteredUserNotes, setFilteredUserNotes] = useState(null);
  const [resizableWidth, setResizableWidth] = useState(0);

  let resizeTimeout;

  // On window resize event
  useEffect(() => {
    if (!wrapperRef.current) return;

    const checkScreenSize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setResizableWidth(wrapperRef.current.resizable.offsetWidth);
      }, 200);
    };
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // On Resizable wrapper resize event
  const checkSizeHadler = () => {
    setResizableWidth(wrapperRef.current.resizable.offsetWidth);
  };

  const toggleUserNotesFilter = (username) => {
    setFilteredUserNotes(username);
  };

  return (
    <>
      <Resizable
        ref={wrapperRef}
        style={style}
        onResizeStop={checkSizeHadler}
        defaultSize={{ width: "50%", height: "100%" }}
        minWidth={305}
        minHeight={120}
        maxHeight={"100%"}
        maxWidth={"100%"}
      >
        <div className={classes.container}>
          <div className={classes.line}></div>
          <div className={classes.line}></div>
          <div className={classes.line}></div>
          {(isManager || isAdmin) && (
            <div className={classes.filter_container}>
              <FilterOptions setShowUserNotes={toggleUserNotesFilter} />
            </div>
          )}
          <Nav />
          <NotesList
            filteredUserNotes={filteredUserNotes}
            resizableWidth={resizableWidth}
          />
        </div>
      </Resizable>
    </>
  );
}

export default List;
