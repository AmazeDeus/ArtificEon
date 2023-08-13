import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "../../../hooks/use-auth";
import { ROLES } from "../../../config/roles";
import { getLayout as getPersistLoginLayout } from "../PersistLogin";
import { getLayout as getSimplePersistLogin } from "../SimplePersistLogin";

const ROOT_REGEX = /^\/*$/;
const DASH_REGEX = /^\/dash(\/)?$/;
const USERS_REGEX = /^\/dash\/members(\/)?$/;
const BLOG_ROOT_REGEX = /^\/blog(\/)?$/;
const BLOG_ROOM_REGEX = /^\/blog\/post\/.+\/(new|edit)(\/)?$/;

const RequireAuth = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  const { pathname } = router;
  const location = router.asPath;
  const { roles } = useAuth();

  let allowedRoles;
  if (ROOT_REGEX.test(pathname) || BLOG_ROOT_REGEX.test(pathname)) {
    allowedRoles = [...Object.values(ROLES)];
  }

  if (DASH_REGEX.test(pathname)) {
    allowedRoles = [ROLES.Manager, ROLES.Admin, ROLES.Employee];
  }

  if (USERS_REGEX.test(pathname) || BLOG_ROOM_REGEX.test(pathname)) {
    allowedRoles = [ROLES.Manager, ROLES.Admin];
  }

  // console.log("ALLOWED:", allowedRoles, "ROLES:", roles)

  useEffect(() => {
    if (!allowedRoles) {
      return;
    }
    if (!roles.some((role) => allowedRoles.includes(role))) {
      setRedirect(true);
    }
  }, []);

  let content;

  redirect
    ? router.replace(`/user/login?from=${location}`)
    : (content = children);

  return content;
};

export const getLayout = (page) =>
  getPersistLoginLayout(<RequireAuth>{page}</RequireAuth>);

export const getSimpleLayout = (page) =>
  getSimplePersistLogin(<RequireAuth>{page}</RequireAuth>);

export default RequireAuth;
