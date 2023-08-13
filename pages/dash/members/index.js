import MembersList from "../../../components/Members/MembersList";
import { getLayout } from "../../../components/Layout/Dash/DashLayout";

function Index() {
  return <MembersList />;
}

Index.getLayout = getLayout;

export default Index;
