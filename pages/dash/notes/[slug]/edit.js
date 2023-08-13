import { useRouter } from "next/router";
import EditNoteForm from "../../../../components/Notes/EditNoteForm";
import { getLayout } from "../../../../components/Layout/Dash/DashLayout";
import { useGetNotesQuery } from "../../../../store/notes/notesApiSlice";
import { useGetUsersQuery } from "../../../../store/users/usersApiSlice";
import useAuth from "../../../../hooks/use-auth";
import useTitle from "../../../../hooks/use-title";
import dynamic from 'next/dynamic';

const DynamicPulseLoader = dynamic(() => import("react-spinners/PulseLoader"));

const EditNote = () => {
  const router = useRouter();
  const { slug: id } = router.query;

  useTitle("Employee Lounge: Edit Note");

  const { username, isManager, isAdmin } = useAuth(); // Extra safety in cases where someone would type in a note id in the url to access the edit form

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  });

  // The ids are iterable, entities are not
  // For each id, grab the entity (the user), and putting it in a new users array
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!note || !users?.length) return <DynamicPulseLoader color={"#FFF"} />;

  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditNoteForm note={note} users={users} />;

  return content;
};

EditNote.getLayout = getLayout;

export default EditNote;
