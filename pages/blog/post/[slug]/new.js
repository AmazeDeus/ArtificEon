import { useRouter } from "next/router";
import Editor from "../../../../components/Editor/Editor";
import useAuth from "../../../../hooks/use-auth";
import { getLayout } from "../../../../components/Layout/SimplePersistLogin";
// import { getProtectedLayout } from "../../../../components/Layout/Blog/PostRoomLayout";

function New() {
  const { isManager, isAdmin } = useAuth(); // Extra safety in cases where a someone would type in a note id in the url to gain access

  const router = useRouter();
  const { slug: id } = router.query;

  if (!isManager && !isAdmin) {
    return <p className="errmsg">No access</p>;
  }

  const content = (
      <Editor />
  );

  return content;
}

New.getLayout = getLayout;
// New.getLayout = getProtectedLayout;

export default New;
