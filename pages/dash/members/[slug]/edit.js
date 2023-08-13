import { useRouter } from "next/router";
import { getLayout } from "../../../../components/Layout/Dash/DashLayout";
import EditMemberForm from "../../../../components/Members/EditMemberForm";
import dynamic from 'next/dynamic';
import { useGetUsersQuery } from "../../../../store/users/usersApiSlice";
import useTitle from "../../../../hooks/use-title";

const DynamicPulseLoader = dynamic(() => import("react-spinners/PulseLoader"));

const EditMember = () => {
  useTitle('Employee Lounge: Edit Member')
  const router = useRouter();
  const { slug: id } = router.query;

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  if (!user) return <DynamicPulseLoader color={"#FFF"} />;

  const content = <EditMemberForm user={user} />;

  return content;
};

EditMember.getLayout = getLayout;

export default EditMember;
