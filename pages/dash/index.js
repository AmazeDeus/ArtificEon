import Welcome from "../../components/Auth/Welcome";
import { getLayout } from "../../components/Layout/Dash/DashLayout";
import useTitle from "../../hooks/use-title";

function Index() {
  useTitle("Employee Lounge");
  return <Welcome />;
}

Index.getLayout = getLayout;

export default Index;
