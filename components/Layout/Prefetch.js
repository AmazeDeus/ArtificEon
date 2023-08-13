import { useEffect } from "react";
import { store } from "../../store";
import { notesApiSlice } from "../../store/notes/notesApiSlice";
import { usersApiSlice } from "../../store/users/usersApiSlice";
import { getLayout as getRequireAuthLayout } from "./Auth/RequireAuth";

/* A layout for routes with a presistent subscription to notes and users slice */
/* -> Prefetching the hooks so these queries have all their data ahead of time */

const Prefetch = ({ children }) => {
  useEffect(() => {
    // Defining subscriptions // Subscribing to certain data in Redux while component is mounted - After unmount, data is held by default for 60 s.
    // getNotes/getUsers = endpoints
    // notesList/usersList = arguments for naming these endpoints
    // force: true - force the query, even if Prefetch has the previous data.
    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", "notesList", { force: true })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "membersList", { force: true })
    );
  }, []);

  return <>{children}</>;
};

export const getLayout = (page) =>
  getRequireAuthLayout(<Prefetch>{page}</Prefetch>);

export default Prefetch;
