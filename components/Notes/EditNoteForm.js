import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AiFillSave } from "@react-icons/all-files/ai/AiFillSave"
import { GoTrashcan } from "@react-icons/all-files/go/GoTrashcan"

import {
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "../../store/notes/notesApiSlice";

import useAuth from "../../hooks/use-auth";

import cls from "classnames";
import classes from "../CSS/Form.module.css";

const EditNoteForm = ({ note, users }) => {
  const { isManager, isAdmin } = useAuth();
  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNoteMutation();

  const router = useRouter();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [completed, setCompleted] = useState(note.completed);
  const [userId, setUserId] = useState(note.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      router.replace({
        pathname: "/dash/notes",
        query: { nid: note.id },
      });
    }
  }, [isSuccess, isDelSuccess]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    if (canSave) {
      await updateNote({ id: note.id, user: userId, title, text, completed });
    }
  };

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id });
  };

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {" "}
        {user.username}
      </option>
    );
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? `${classes["form__input--incomplete"]}` : "";
  const validTextClass = !text ? `${classes["form__input--incomplete"]}` : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteNoteClicked}
      >
        <GoTrashcan />
      </button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
        <div className={classes["form__title-row"]}>
          <h2>Edit Note #{note.ticket}</h2>
          <div className={classes["form__action-buttons"]}>
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <AiFillSave />
            </button>
            {deleteButton}
          </div>
        </div>
        <label className={classes.form__label} htmlFor="note-title">
          Title:
        </label>
        <input
          className={`${classes.form__input} ${validTitleClass}`}
          id="note-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className={classes.form__label} htmlFor="note-text">
          Text:
        </label>
        <textarea
          className={cls(
            classes.form__input,
            classes["form__input--text"],
            validTextClass
          )}
          id="note-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        <div className={classes.form__row}>
          <div className={classes.form__divider}>
            <label
              className={cls(
                classes.form__label,
                classes["form__checkbox-container"]
              )}
              htmlFor="note-completed"
            >
              WORK COMPLETE:
              <input
                className={classes.form__checkbox}
                id="note-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>

            <label
              className={cls(
                classes.form__label,
                classes["form__checkbox-container"]
              )}
              htmlFor="note-username"
            >
              ASSIGNED TO &#8595;
            </label>
            <select
              id="note-username"
              name="username"
              className={classes.form__select}
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </div>
          <div className={classes.form__divider}>
            <p className={classes.form__created}>
              Created:
              <br />
              {created}
            </p>
            <p className={classes.form__updated}>
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditNoteForm;
