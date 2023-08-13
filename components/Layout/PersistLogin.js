import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import usePersist from "../../hooks/use-persist";
import { useRefreshMutation } from "../../store/authApiSlice";
import { selectCurrentToken } from "../../store/authSlice";
import Link from "next/link";
import { PulseLoader } from "react-spinners";
import { getLayout as getSiteLayout } from "./SiteLayout";

const PersistLogin = ({ children }) => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  // "isSuccess" status from useRefreshMutation hook can be true even before credentials get set.
  // -> need one more flag that tells we have the data from "refresh()" and those credentials have been set
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    console.log("Ref in useEffect: ", effectRan.current);
    // Handling React 18 Strict Mode (and when not in dev) for refresh token:
    // In Strict Mode - useEffect runs twice
    // "effectRan.current = true" will only be true the second time the component mounts (cleanup function below).
    // Wouldn't normally be a problem with the component mounting twice, but when using the refresh token, it should only be sent once.

    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          //const response =
          await refresh();
          //const { accessToken } = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      // !token - When refreshing the page, the state is wiped out (no accesstoken our any other state is defined)
      // -> need to verify the refresh token by sending cookie back (which contains the refresh token)
      // -> Gives access to all other states again since it gives a new accesstoken
      if (!token && persist) verifyRefreshToken();
    }

    // cleanup function
    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;
  // persist login: no
  if (!persist) {
    console.log("no persist");
    content = children;
    //persist login: yes, token: no (refresh mutation will only be called if there is no token)
  } else if (isLoading) {
    console.log("loading");
    content = <PulseLoader color={"#FFF"} />;
    //persist login: yes, token: no (eg. when refresh token expires // status-403)
  } else if (isError) {
    console.log("error");
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link href="/user/signin">Please login again</Link>.
      </p>
    );
    //persist login: yes, token: yes
  } else if (isSuccess && trueSuccess) {
    console.log("success");
    content = children;
    console.log(content);
    //persist: yes, token: yes (refresh mutation not called yet)
  } else if (token && isUninitialized) {
    console.log("token and uninit");
    console.log(isUninitialized);
    content = children;
  }

  return content;
};

export const getLayout = (page) =>
  getSiteLayout(<PersistLogin>{page}</PersistLogin>);

export default PersistLogin;
