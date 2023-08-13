import { useEffect } from "react";
import { useRouter } from "next/router";
import { BsGear } from "@react-icons/all-files/bs/BsGear"
import { BsPencilSquare } from "@react-icons/all-files/bs/BsPencilSquare"
import { FaUserPlus } from "@react-icons/all-files/fa/FaUserPlus"
import { FiLogOut } from "@react-icons/all-files/fi/FiLogOut"
import { AiOutlinePlusCircle } from "@react-icons/all-files/ai/AiOutlinePlusCircle"
import { useSendLogoutMutation } from "../../../store/authApiSlice";

import useAuth from "../../../hooks/use-auth";

const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

function DashButtons({ hasError }) {
  const { isManager, isAdmin } = useAuth();

  const router = useRouter();
  const { pathname } = router;

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      router.replace("/");
    }
  }, [isSuccess, router]);

  const onNewNoteClicked = () => router.push("/dash/notes/new");
  const onNewUserClicked = () => router.push("/dash/users/new");
  const onNotesClicked = () =>
    pathname.includes("/edit")
      ? router.replace({
          pathname: "/dash/notes",
          query: { nid: true },
        })
      : router.push("/dash/notes");
  const onUsersClicked = () =>
    pathname.includes("/edit")
      ? router.replace({
          pathname: "/dash/members",
          query: { nid: true },
        })
      : router.push("/dash/members");

  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        className="icon-button"
        title="New Note"
        onClick={onNewNoteClicked}
      >
        <AiOutlinePlusCircle />
      </button>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <FaUserPlus />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <BsGear />
        </button>
      );
    }
  }

  let notesButton = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <button className="icon-button" title="Notes" onClick={onNotesClicked}>
        <BsPencilSquare />
      </button>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FiLogOut />
    </button>
  );

  if (isError) {
    hasError(true, error?.data?.message);
  }

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>;
  } else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  return buttonContent;
}

export default DashButtons;
