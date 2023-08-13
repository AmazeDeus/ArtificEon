import Layout from "../../../../components/Layout/Layout";
import Footer from "../../../../containers/Footer/Footer";
import SinglePost from "../../../../components/Blog/Posts/SinglePost/SinglePost";
import { getSimpleLayout } from "../../../../components/Layout/Blog/PostRoomLayout";

function index() {
  return (
    <Layout>
      <SinglePost  />
      <Footer />
    </Layout>
  );
}

index.getLayout = getSimpleLayout

export default index;