import { memo } from "react";
import { useRouter } from "next/router";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit"
import { Resizable } from "re-resizable";

import { useGetNotesQuery } from "../../store/notes/notesApiSlice";

import classes from "./NotesList.module.css";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "1rem",
  flexWrap: "wrap",
  marginLeft: "auto",
  marginRight: "auto",
};

const Note = ({ wrapperRef, noteId }) => {
  // Will not create a seperate query/network request -> Will get the note from the data that is already queried.
  // selectFromResult - A selector for the useGetNotesQuery data
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  const router = useRouter();

  // createdAt/updatedAt dates comes from mongoDB
  if (note) {
    const created = new Date(note.createdAt).toLocaleString("en-EU", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(note.updatedAt).toLocaleString("en-EU", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => router.push(`/dash/notes/${noteId}/edit`);

    return (
      <Resizable
        style={style}
        defaultSize={{ width: 300, height: 150 }}
        minWidth={200}
        minHeight={165}
        maxWidth={"100%"}
      >
        <div
          className={`${classes.grid__item} ${classes.item} text-white relative`}
        >
          <div
            className={`${classes.item__content} h-full w-full p-4 bg-black relative border-2`}
          >
            <div className={`${classes["item__content-top"]}`}>
              {note.title}
              <div className="note_edit">
                <button onClick={handleEdit}>
                  <AiOutlineEdit />
                </button>
                <span className="note_edit-tooltip">Edit</span>
              </div>
            </div>
            <span>
              {created} - {updated}
            </span>
            <p>By: {note.username}</p>
            <button
              className={classes["item__content-showMore"]}
              onClick={handleEdit}
            >
              Learn More
            </button>{" "}
            {note.completed ? (
              <span className="note__status--completed">Completed</span>
            ) : (
              <span className="note__status--open">Open</span>
            )}
          </div>
        </div>
      </Resizable>
    );
  } else return null;
};

const memoizedNote = memo(Note);

export default memoizedNote;
