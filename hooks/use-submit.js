// Depends on the value in the "id" field of the form (login/register)

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useLoginMutation } from "../store/authApiSlice";
import { useAddNewUserMutation } from "../store/users/usersApiSlice";

const useSubmit = (userObj = null, canSave = false, errRef, reset = {}) => {
  const [loginErrMsg, setLoginErrMsg] = useState("");

  const router = useRouter();

  const dispatch = useDispatch();

  const [login, { isLoading: loginIsLoading }] = useLoginMutation();
  const [
    addNewUser,
    { isLoading: registerIsLoading, isSuccess: registerIsSuccess, isError: registerHasError, error: registerError},
  ] = useAddNewUserMutation();

  const hasData = [Object.keys(userObj).length].every(Boolean);

  if (!hasData) return;

  useEffect(() => {
    router.prefetch("/");
  }, []);

  useEffect(() => {
    if (registerIsSuccess) {
      reset.resetNameInput();
      reset.resetEmailInput();
      reset.resetPasswordInput();
      router.push("/");
    }
  }, [registerIsSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id } = e.target;
    try {
      if (id === "login") {
        const { accessToken } = await login(userObj).unwrap(); // .unwrap - If we aren't using an RTK query state from Redux (isError in this case). In cases for handling the error inside of a try/catch block instead.
        // console.log(accessToken);
        dispatch(setCredentials({ accessToken }));
        reset.resetNameInput();
        reset.resetPasswordInput();
        router.replace("/");
      } else if (id === "register" && canSave) {
        await addNewUser(userObj);
      }
    } catch (err) {
      if (!err.status) {
        setLoginErrMsg("No Server Response");
      } else if (err.status === 400) {
        setLoginErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setLoginErrMsg("Invalid Username or Password");
      } else {
        setLoginErrMsg(err.data?.message);
      }
      errRef.current.focus(); // Set focus to screen reader error msg.
    }
  };

  return {
    loginErrMsg,
    registerHasError,
    registerError,
    registerIsLoading,
    loginIsLoading,
    handleSubmit,
  };
};

export default useSubmit;
