import { useRouter } from "next/router";
import Editor from "../../../../Editor/Editor";

function EditPost() {
  const router = useRouter();
  const { slug } = router.query;

  const content = (
      <Editor postId={slug} />
  );

  return content;
}

export default EditPost;
