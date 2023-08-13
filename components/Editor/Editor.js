import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import { useGetSinglePost } from "../../hooks/use-getSinglePost";
import useEditorConfig from "../../hooks/use-editorConfig";
import QuillEditor from "./QuillEditor";
import EditorForm from "./EditorForm";
import DynamicWrapper from "../ui/DynamicWrapper";
import Modal from "../ui/Modal";

import defaultClasses from "./RichEditor.module.css";
const BLOG_EDIT_REGEX = /^\/blog\/post\/.+\/edit(\/)?$/;

export default function Editor({ postId, postSlug, wrappers, classes }) {
  const [postIsLoading, setPostIsLoading] = useState(false);
  const [quillLoaded, setQuillLoaded] = useState(false);
  const [quillInitialized, setQuillInitialized] = useState(false);

  const existingPost = useGetSinglePost(
    postId ? postId : null,
    postSlug ? postSlug : null
  );

  useEffect(() => {
    if (postId || postSlug) setPostIsLoading(true);

    if (existingPost) setPostIsLoading(false);
  }, [postId, postSlug, existingPost]);

  const {
    channel,
    pusher,
    documentId,
    quillRef,
    formChangeHandler,
    formBlurHandler,
    submitHandler,
    quillImageCallback,
    content,
    title,
    displayedUsername,
    editorIsLoading,
    editorHasError,
    postAddError,
    isError,
    hideErrorOnChange,
    newDataIsError,
    newDataError,
    updateIsError,
    postUpdateError,
  } = useEditorConfig(existingPost ? existingPost : null, quillLoaded);


  useEffect(() => {
    if(quillLoaded) return;
    const checkQuillRef = async () => {
      while (!quillRef.current) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      setQuillLoaded(true);
    };
    checkQuillRef();
  }, []);

  const editorClasses = !classes
    ? `${defaultClasses["richEditor__wrapper-default"]}`
    : classes;

  const errClass =
    (newDataIsError || updateIsError) && !hideErrorOnChange
      ? "errmsg"
      : "offscreen";

  let errorMessage;
  if (newDataError?.data?.error) {
    errorMessage = newDataError?.data?.error;
  } else if (postUpdateError?.data?.error) {
    errorMessage = postUpdateError?.data?.error;
  }

  let editorContent;
  let tempEditorContent;
/* console.log("QUILL:", existingPost.data, content !== "") */
  if (postIsLoading || editorIsLoading || !quillLoaded)
    tempEditorContent = <RingLoader color="#36d7b7" size={30} />;
  else if (editorHasError && !postIsLoading && !editorIsLoading)
    tempEditorContent = <span className={defaultClasses.errorText}>A Timeout Error Occured... Please Wait 3 seconds before Refreshing The Page.</span>;

  editorContent = (
    <Modal>
      <EditorForm
        title={title}
        displayedUsername={displayedUsername}
        submitHandler={submitHandler}
        formChangeHandler={formChangeHandler}
        formBlurHandler={formBlurHandler}
        existingPost={existingPost && true}
      >
        <p className={`${errClass} ${defaultClasses["addPost-error"]}`}>
          {!hideErrorOnChange && errorMessage}
        </p>
        <DynamicWrapper
          wrapperTags={!wrappers ? null : wrappers}
          classes={!wrappers ? null : editorClasses}
        >
          <QuillEditor
            socket={channel}
            documentId={documentId}
            quillLoaded={quillInitialized}
            quillRef={quillRef}
            quillImageCallback={quillImageCallback}
            content={content}
            onInit={() => setQuillInitialized(true)}
          />
        </DynamicWrapper>
      </EditorForm>
      <div className={`${defaultClasses["richEditor__fallback"]}`}>
        {tempEditorContent}
      </div>
    </Modal>
  );

  return editorContent;
}
