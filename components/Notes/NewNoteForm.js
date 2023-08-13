import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAddNewNoteMutation } from "../../store/notes/notesApiSlice";
import { AiFillSave } from "@react-icons/all-files/ai/AiFillSave"

import classes from "../CSS/Form.module.css";
import cls from "classnames";

const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(users[0].id);

  const [hasBlurredTitle, setHasBlurredTitle] = useState(false);
  const [hasBlurredText, setHasBlurredText] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      router.replace("/dash/notes");
    }
  }, [isSuccess]);

  const inputBlurHandler = (event) => {
    const { name } = event.target;
    if (name === "title") {
      setHasBlurredTitle(true);
    } else if (name === "text") {
      setHasBlurredText(true);
    }
  };

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ user: userId, title, text });
    }
  };

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {" "}
        {user.username}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass =
    !title && hasBlurredTitle ? `${classes["form__input--incomplete"]}` : "";
  const validTextClass =
    !text && hasBlurredText ? `${classes["form__input--incomplete"]}` : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className={classes.form} onSubmit={onSaveNoteClicked}>
        <div className={classes["form__title-row"]}>
          <h2>New Note</h2>
          <div className={classes["form__action-buttons"]}>
            <button className="icon-button" title="Save" disabled={!canSave}>
              <AiFillSave />
            </button>
          </div>
        </div>
        <label className={classes.form__label} htmlFor="title">
          Title:
        </label>
        <input
          className={`${classes.form__input} ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
          onBlur={inputBlurHandler}
        />

        <label className={classes.form__label} htmlFor="text">
          Text:
        </label>
        <textarea
          className={cls(
            classes.form__input,
            classes["form__input--text"],
            validTextClass
          )}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
          onBlur={inputBlurHandler}
        />

        <label
          className={cls(
            classes.form__label,
            classes["form__checkbox-container"]
          )}
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className={classes.form__select}
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewNoteForm;
