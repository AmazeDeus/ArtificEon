import { useState, useRef } from "react";
import useForm from "../../hooks/use-form"; // client side validation.
import useSubmit from "../../hooks/use-submit";
import usePersist from "../../hooks/use-persist";

import classes from "./AuthForm.module.css";

const USER_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

// https://regexpattern.com/email-address/
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const PWD_REGEX = /^[A-z0-9!@#$%]{6,16}$/;

const usernameValidation = (value) => USER_REGEX.test(value);
const passwordValidation = (value) => PWD_REGEX.test(value);
const emailValidation = (value) => EMAIL_REGEX.test(value);

function AuthForm() {
  const errRef = useRef(null);

  const {
    enteredValue: enteredUsername,
    valueIsValid: enteredUsernameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    valueBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useForm(usernameValidation);

  const {
    enteredValue: enteredEmail,
    valueIsValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useForm(emailValidation);

  const {
    enteredValue: enteredPassword,
    valueIsValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    valueBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useForm(passwordValidation);

  
  const [rightPanel, setRightPanel] = useState(false);
  const [persist, setPersist] = usePersist();
  
  let auth;  
  let formIsValid = false;
  if (rightPanel) {
    auth = { username: enteredUsername, password: enteredPassword, email: enteredEmail };
    formIsValid = [enteredUsernameIsValid, enteredEmailIsValid, enteredPasswordIsValid].every(Boolean);
  }

  if (!rightPanel) {
    auth = { username: enteredUsername, password: enteredPassword };
    formIsValid = [enteredUsernameIsValid, enteredPasswordIsValid].every(Boolean);
  }

  const {
    loginErrMsg,
    registerHasError,
    registerError,
    registerIsLoading,
    loginIsLoading,
    handleSubmit
  } = useSubmit(
    auth,
    formIsValid,
    errRef,
    { resetNameInput, resetPasswordInput, resetEmailInput }
  );

  const switchAuthHandler = () => {
    setRightPanel((prevState) => !prevState);
  };

  const handleToggle = () => setPersist((prevState) => !prevState);

  let errClass = "offscreen"
  if((registerHasError && rightPanel) || (loginErrMsg && !rightPanel)) {
    errClass = "errmsg";
  }
  
  const validNameClass =
    nameInputHasError
      ? `${classes["form__input--incomplete"]}`
      : "";
  const validEmailClass =
    emailInputHasError
      ? `${classes["form__input--incomplete"]}`
      : "";
  const validPwdClass =
    passwordInputHasError
      ? `${classes["form__input--incomplete"]}`
      : "";

  let errorMessage = null;
  if (loginErrMsg && !rightPanel){
    errorMessage = loginErrMsg
  }
    
  if (registerError && rightPanel){
    errorMessage = registerError?.data.message
  }

  let containerClasses
  rightPanel 
    ? containerClasses = `${classes.container} ${classes["right-panel-active"]}`
    : containerClasses = classes.container

  return (
    <main className={classes.main}>
      <p ref={errRef} className={errClass} aria-live="assertive">
        {errorMessage}
      </p>
      <div className={containerClasses}>
        {/* <!-- Sign Up --> */}
        <div
          className={`${classes.container__form} ${classes["container--signup"]}`}
        >
          <form
            action="#"
            className={classes.form}
            id="register"
            onSubmit={handleSubmit}
          >
            <h2 className={classes.form__title}>Sign Up</h2>
            <input
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
              value={enteredUsername}
              type="text"
              placeholder="User"
              className={`${classes.input} ${validNameClass}`}
            />
            {nameInputHasError && (
              <p className="error-text">Please enter a valid Name!</p>
            )}
            <input
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              value={enteredEmail}
              type="email"
              placeholder="Email"
              className={`${classes.input} ${validEmailClass}`}
            />
            {emailInputHasError && (
              <p className="error-text">Please enter a valid Email!</p>
            )}
            <input
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              value={enteredPassword}
              type="password"
              placeholder="Password"
              className={`${classes.input} ${validPwdClass}`}
            />
            {passwordInputHasError && (
              <p className="error-text">
                The password should be at least 6 characters long!
              </p>
            )}
            <button
              disabled={!formIsValid}
              type="submit"
              className={classes.btn}
            >
              {registerIsLoading ? "Loading..." : <p>Sign Up</p>}
            </button>

            <label htmlFor="persistOnRegister" className={classes["form__form-persist"]}>
              <input
                type="checkbox"
                className={classes["form__form-persist_form-checkbox"]}
                id="persistOnRegister"
                onChange={handleToggle}
                checked={persist}
              />
              Trust This Device
            </label>
          </form>
        </div>

        {/* <!-- Sign In --> */}
        <div
          className={`${classes.container__form} ${classes["container--signin"]}`}
        >
          <form
            action="#"
            className={classes.form}
            id="login"
            onSubmit={handleSubmit}
          >
            <h2 className={classes.form__title}>Sign In</h2>
            <input
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
              value={enteredUsername}
              type="text"
              placeholder="Username"
              className={`${classes.input} ${validNameClass}`}
            />
            {nameInputHasError && (
              <p className="error-text">Please enter a valid Username!</p>
            )}
            <input
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              value={enteredPassword}
              type="password"
              placeholder="Password"
              className={`${classes.input} ${validPwdClass}`}
            />
            {passwordInputHasError && (
              <p className="error-text">Please enter a valid Password!</p>
            )}
            <a href="#" className={classes.link}>
              Forgot your password?
            </a>
            <button disabled={!formIsValid} className={classes.btn}>
            {loginIsLoading ? "Loading..." : <p>Sign In</p>}
            </button>

            <label htmlFor="persistOnLogin" className={classes["form__form-persist"]}>
              <input
                type="checkbox"
                className={classes["form__form-persist_form-checkbox"]}
                id="persistOnLogin"
                onChange={handleToggle}
                checked={persist}
              />
              Trust This Device
            </label>
          </form>
        </div>

        {/* <!-- Overlay --> */}
        <div className={classes.container__overlay}>
          <div className={classes.overlay}>
            <div
              className={`${classes.overlay__panel} ${classes["overlay--left"]}`}
            >
              <button
                className={classes.btn}
                onClick={switchAuthHandler}
                id="signIn"
              >
                Sign In
              </button>
            </div>
            <div
              className={`${classes.overlay__panel} ${classes["overlay--right"]}`}
            >
              <button
                className={classes.btn}
                onClick={switchAuthHandler}
                id="signUp"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthForm;
