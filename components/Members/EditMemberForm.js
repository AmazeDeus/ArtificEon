import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AiFillSave } from "@react-icons/all-files/ai/AiFillSave"
import { GoTrashcan } from "@react-icons/all-files/go/GoTrashcan"
import { ROLES } from "../../config/roles";

import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../store/users/usersApiSlice";

import cls from "classnames";
import classes from "../CSS/Form.module.css";

const USER_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

// https://regexpattern.com/email-address/
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const PWD_REGEX = /^[A-z0-9!@#$%]{6,16}$/;

const EditMemberForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const router = useRouter();

  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  const [usernameHasBlurred, setUsernameHasBlurred] = useState(false);
  const [emailHasBlurred, setEmailHasBlurred] = useState(false);
  const [passwordHasBlurred, setPasswordHasBlurred] = useState(false);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setEmail("");
      setPassword("");
      setRoles([]);
      router.replace({
        pathname: "/dash/members",
        query: { nid: true },
      });
    }
  }, [isSuccess, isDelSuccess]);

  const inputFocusHandler = (event) => {
    const { name } = event.target;
    if (name === "username") {
      setUsernameHasBlurred(false);
    } else if (name === "email") {
      setEmailHasBlurred(false);
    } else if (name === "password") {
      setPasswordHasBlurred(false);
    }
    event.target.removeAttribute("readonly");
  };

  const inputBlurHandler = (event) => {
    const { name } = event.target;
    if (name === "username") {
      setUsernameHasBlurred(true);
    } else if (name === "email") {
      setEmailHasBlurred(true);
    } else if (name === "password") {
      setPasswordHasBlurred(true);
    }
    event.target.setAttribute("readonly", true);
  };

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveUserClicked = async (e) => {
    if (password) {
      await updateUser({
        id: user.id,
        username,
        email,
        password,
        roles,
        active,
      });
    } else {
      await updateUser({ id: user.id, username, email, roles, active });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    );
  });

  let canSave;
  if (password) {
    canSave =
      [roles.length, validUsername, validEmail, validPassword].every(Boolean) &&
      !isLoading;
  } else {
    canSave =
      [roles.length, validUsername, validEmail].every(Boolean) && !isLoading;
  }

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validUserClass =
    !validUsername && usernameHasBlurred
      ? `${classes["form__input--incomplete"]}`
      : "";
  const validEmailClass =
    !validEmail && emailHasBlurred
      ? `${classes["form__input--incomplete"]}`
      : "";
  const validPwdClass =
    password && !validPassword && passwordHasBlurred
      ? `${classes["form__input--incomplete"]}`
      : "";
  const validRolesClass = !Boolean(roles.length)
    ? `${classes["form__input--incomplete"]}`
    : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
        <div className={classes["form__title-row"]}>
          <h2>Edit User</h2>
          <div className={classes["form__action-buttons"]}>
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <AiFillSave />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <GoTrashcan />
            </button>
          </div>
        </div>
        <label className={classes.form__label} htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`${classes.form__input} ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={onUsernameChanged}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />

        <label className={classes.form__label} htmlFor="email">
          Email: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`${classes.form__input} ${validEmailClass}`}
          id="email"
          name="email"
          type="text"
          value={email}
          onChange={onEmailChanged}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />

        <label className={classes.form__label} htmlFor="password">
          Password: <span className="nowrap">[empty = no change]</span>{" "}
          <span className="nowrap">[6-16 chars incl. !@#$%]</span>
        </label>
        <input
          className={`${classes.form__input} ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />

        <label
          className={cls(
            classes.form__label,
            classes["form__checkbox-container"]
          )}
          htmlFor="user-active"
        >
          ACTIVE:
          <input
            className={classes.form__checkbox}
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChanged}
          />
        </label>

        <label className={classes.form__label} htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          id="roles"
          name="roles"
          className={`${classes.form__select} ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default EditMemberForm;
