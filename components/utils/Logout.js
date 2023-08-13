import { useEffect } from "react";
import { FiLogOut } from "@react-icons/all-files/fi/FiLogOut"
import { useRouter } from "next/router";

import { useSendLogoutMutation } from "../../store/authApiSlice";

const ROOT_REGEX = /^\/*$/;

function Logout() {
  const { pathname } = useRouter();
  const router = useRouter();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (ROOT_REGEX.test(pathname) && isSuccess) {
      return;
    } else if (isSuccess) router.replace("/");
  }, [isSuccess]);

  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FiLogOut />
    </button>
  );

  const content = (
    <>
      {/* add more buttons later */}
      {logoutButton}
    </>
  );

  return content;
}

export default Logout;
