import Link from "next/link";
import useFormattedDate from "../../hooks/use-formattedDate";
import useAuth from "../../hooks/use-auth";

import classes from "./Welcome.module.css";

function Welcome() {
  const { isManager, isAdmin } = useAuth();

  const date = new Date();

  const today = useFormattedDate(
    { dateStyle: "full", timeStyle: "long" },
    date
  );

  const content = (
    <section className={classes.welcome}>
      <p>{today}</p>
      <h1>Welcome!</h1>
      <p>
        <Link href="/dash/notes">View all Notes</Link>
      </p>
      <p>
        <Link href="/dash/notes/new">Add New Note</Link>
      </p>
      {(isManager || isAdmin) && (
        <p>
          <Link href="/dash/members">View Member Settings</Link>
        </p>
      )}
      {(isManager || isAdmin) && (
        <p>
          <Link href="/dash/members/new">Add New Member</Link>
        </p>
      )}
    </section>
  );

  return content;
}
export default Welcome;
