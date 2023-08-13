import NewNoteForm from "../../../components/Notes/NewNoteForm";
import { getLayout } from "../../../components/Layout/Dash/DashLayout";
import dynamic from 'next/dynamic';

import { useGetUsersQuery } from "../../../store/users/usersApiSlice";
import useTitle from "../../../hooks/use-title";

const DynamicPulseLoader = dynamic(() => import("react-spinners/PulseLoader"));

const NewNote = () => {
  useTitle("Employee Lounge: New Note");

  // The ids are iterable, entities are not
  // For each id, grab the entity (the user), and putting it in a new users array
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <DynamicPulseLoader color={"#FFF"} />;

  const content = <NewNoteForm users={users} />;

  return content;
};

NewNote.getLayout = getLayout;

export default NewNote;
