import NewMemberForm from "../../../components/Members/NewMemberForm";
import { getLayout } from "../../../components/Layout/Dash/DashLayout";

function NewMember() {
  return <NewMemberForm />;
}

NewMember.getLayout = getLayout;

export default NewMember;
