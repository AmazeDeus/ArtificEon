import { useRouter } from "next/router";
import { AiOutlineSave } from "@react-icons/all-files/ai/AiOutlineSave"
import EditDeletePost from "../Blog/actionButtons"

import classes from "./RichEditor.module.css";

function EditorForm({children, title, displayedUsername, submitHandler, formChangeHandler, formBlurHandler, existingPost}) {
  const router = useRouter();
  const { slug: id } = router.query;

  return (
    <form className="RichEditor-form" onSubmit={submitHandler}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={formChangeHandler("title")}
          onBlur={formBlurHandler("title")}
          value={title}
          type="text"
          className="form-control"
          placeholder="Post title"
          // required
        />
      </div>
      {children}
      <div className="form-group">
        <label className="text-muted">User</label>
        <input
          onChange={formChangeHandler("user")}
          onBlur={formBlurHandler("user")}
          value={displayedUsername}
          type="text"
          className="form-control"
          placeholder="Your name"
          // required
        />
      </div>
      <div className={`${classes["form-button"]}`}>
        <div className={`${classes["blog-post__save"]}`}>
        <button title="Save">
          <AiOutlineSave />
          <span>{!existingPost ? "Create" : "Save"}</span>
        </button>
      </div>
        <EditDeletePost postId={id} editHandler={false} deleteHandler={true} />
        <span className={`${classes["form-note"]}`}>*Temporary: first image becomes the banner.</span>
      </div>
    </form>
  );
}

export default EditorForm;
