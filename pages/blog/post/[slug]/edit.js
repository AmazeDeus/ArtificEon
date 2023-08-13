import EditPost from "../../../../components/Blog/Posts/SinglePost/Edit/EditPost";
import useAuth from "../../../../hooks/use-auth";
// import { getLayout } from "../../../../components/Layout/Blog/PostRoomLayout";
import { getProtectedLayout } from "../../../../components/Layout/Blog/PostRoomLayout";

function Edit() {
  const { isManager, isAdmin } = useAuth(); // Extra safety in cases where someone would type in a post id in the url to gain access

  if (!isManager && !isAdmin) {
    return <p className="errmsg">No access</p>
  }

  const content = (
      <EditPost />
  );

  return content;
}

// Edit.getLayout = getLayout;
Edit.getLayout = getProtectedLayout;

export default Edit;
