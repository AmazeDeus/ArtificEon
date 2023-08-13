import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAddNewMemberMutation } from "../../store/users/usersApiSlice";
import { AiFillSave } from "@react-icons/all-files/ai/AiFillSave"
import { ROLES } from "../../config/roles";

import classes from "../CSS/Form.module.css";

const USER_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

// https://regexpattern.com/email-address/
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const PWD_REGEX = /^[A-z0-9!@#$%]{6,16}$/;

const NewMemberForm = () => {
  const [addNewMember, { isLoading, isSuccess, isError, error }] =
    useAddNewMemberMutation();

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["User"]);

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
    console.log(isSuccess);
    if (isSuccess) {
      setUsername("");
      setEmail("");
      setPassword("");
      setRoles([]);
      router.push("/");
    }
  }, [isSuccess]);

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

  // Allow more than one role to be selected.
  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions, //HTMLCollection
      (option) => option.value
    );
    setRoles(values);
  };

  const canSave =
    [roles.length, validUsername, validEmail, validPassword].every(Boolean) &&
    !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewMember({ username, email, password, roles });
    }
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass =
    !validUsername && usernameHasBlurred
      ? `${classes["form__input--incomplete"]}`
      : "";
  const validEmailClass =
    !validEmail && emailHasBlurred
      ? `${classes["form__input--incomplete"]}`
      : "";
  const validPwdClass =
    !validPassword && passwordHasBlurred
      ? `${classes["form__input--incomplete"]}`
      : "";
  const validRolesClass = !Boolean(roles.length)
    ? `${classes["form__input--incomplete"]}`
    : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className={classes.form} onSubmit={onSaveUserClicked}>
        <div className={classes["form__title-row"]}>
          <h2>New User</h2>
          <div className={classes["form__action-buttons"]}>
            <button className="icon-button" title="Save" disabled={!canSave}>
              <AiFillSave />
            </button>
          </div>
        </div>
        <label className={classes.form__label} htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`${classes.form__input} ${validUserClass}`}
          readOnly
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />

        <label className={classes.form__label} htmlFor="email">
          Email: <span className="nowrap">[Enter a valid email]</span>
        </label>
        <input
          className={`${classes.form__input} ${validEmailClass}`}
          readOnly
          id="email"
          name="email"
          type="text"
          autoComplete="off"
          value={email}
          onChange={onEmailChanged}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />

        <label className={classes.form__label} htmlFor="password">
          Password: <span className="nowrap">[6-16 chars incl. !@#$%]</span>
        </label>
        <input
          className={`${classes.form__input} ${validPwdClass}`}
          readOnly
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />

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

export default NewMemberForm;
