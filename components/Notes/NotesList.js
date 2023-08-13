import { useState, useEffect } from "react";
import { useGetNotesQuery } from "../../store/notes/notesApiSlice";
import Note from "./Note";
import { useRouter } from "next/router";
import { PulseLoader } from "react-spinners";

import useAuth from "../../hooks/use-auth";

import classes from "./NotesList.module.css";

const NotesList = ({ filteredUserNotes, resizableWidth }) => {
  const { username, isManager, isAdmin } = useAuth();
  const [styles, setStyles] = useState(null);

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  }); // Refetch data during specific circumstances. pollingInterval - Re-query the data (notes) every 15 s.
  // notesList label will be viewable in Redux devtools
  const router = useRouter();

  // nid - query from EditNoteForm
  // handlePopstate - On browser back button. Redirect to "/dash" instead of back to the edit form
  useEffect(() => {
    const handlePopstate = () => {
      if (router.query.nid) {
        router.push("/dash");
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  // resizableWidth - Main Resizable window width
  useEffect(() => {
    if (!resizableWidth) return;

    if (resizableWidth <= 420) {
      !styles &&
        setStyles({
          gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
        });
    } else setStyles(null);
  }, [resizableWidth]);

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = notes; // notes - contains the ids array and the entities

    let filteredIds;
    if (isManager || isAdmin) {
      if (!filteredUserNotes || filteredUserNotes === "show-all") {
        // Managers and admins see all notes
        filteredIds = [...ids];
      } else {
        // Managers and admins see notes filtered by username
        filteredIds = ids.filter(
          (noteId) => entities[noteId].username === filteredUserNotes
        );
      }
    } else {
      // Employees see their own notes only
      filteredIds = ids.filter(
        (noteId) => entities[noteId].username === username
      );
    }

    // console.log(resizableWidth);

    const noteContent =
      ids?.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

    // Display purposes
    const gridClasses =
      filteredIds.length < 3 ? classes.grid_column : classes.grid_container;

    content = (
      <>
        <div className={gridClasses} style={styles && styles}>
          {noteContent}
        </div>
      </>
    );
  }

  return <div>{content}</div>;
};

export default NotesList;
