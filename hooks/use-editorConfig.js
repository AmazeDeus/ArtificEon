// Handles all the configuration for the React Quill Editor and its pusher events.
// Uses the token from authSlice as a unique identifier for each user connected through the channel. User account is required.
// - Modify and use a different unique identifier for each connection, if integrated somewhere else where the user token is unavailable and using the image upload/callback.

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

// Helpers for submitting real time socket requests
import pusher, {
  subscribeToChannel,
  sendChanges,
  getDocument,
  postCreateUpdate,
} from "@/helpers/pusher";

// RTK Queries
import {
  useAddNewPostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../store/posts/postsApiSlice";

// Get current JWT Token
import { selectCurrentToken } from "../store/authSlice";

// Custom Hooks
import useEditorDeleteImages from "./use-editorDeleteImages";
import useClearStorageOnPathnameChange from "./use-clearStorageOnPathnameChange";
import useAuth from "./use-auth";

// URL/s containing React Quill Editor with Pusher communication
const BLOG_ROOM_REGEX = /^\/blog\/post\/.+\/(new|edit)(\/)?$/;
const BLOG_EDIT_REGEX = /^\/blog\/post\/.+\/edit(\/)?$/;

const useEditorConfig = (editData, quillLoaded) => {
  const { id: userId, username } = useAuth();

  // RTK Query (New Post)
  const [
    addNewPost,
    {
      data: newData,
      isLoading: newDataIsLoading,
      isSuccess: newDataIsSuccess,
      isError: newDataIsError,
      error: newDataError,
    },
  ] = useAddNewPostMutation();

  // RTK Query (Update Post)
  const [
    updatePost,
    {
      data: updateData,
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      isError: updateIsError,
      error: postUpdateError,
    },
  ] = useUpdatePostMutation();

  // RTK Query (Delete Post)
  const [deletePost, { isLoading: deleteIsLoading }] = useDeletePostMutation();

  // States
  const [channel, setChannel] = useState(null);
  /* const [pusher, setPusher] = useState(); */
  const [content, setContent] = useState(""); // For sending the whole (html) post to the final POST/PATCH Request.
  const [expectEditData, setExpectEditData] = useState(false);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [displayedUsername, setDisplayedUsername] = useState(username);
  const [encodedDocumentId, setEncodedDocumentId] = useState("");
  const [clientId, setClientId] = useState(null); // Unique identifier for performing changes only for client responsible for the image insert (avoid infinite loops/multiple channel calls) // -> quillImageCallback
  const [editorIsLoading, setEditorIsLoading] = useState(false);
  const [editorHasError, setEditorHasError] = useState(false);
  const [hideErrorOnChange, setHideErrorOnChange] = useState(false);
  const [titleChanged, setTitleChanged] = useState(false);
  const [displayedUsernameChanged, setDisplayedUsernameChanged] =
    useState(false);

  // Default Hooks
  const quillRef = useRef();
  const router = useRouter();
  const token = useSelector(selectCurrentToken);
  const { pathname } = router;
  const { slug: documentId } = router.query;

  useClearStorageOnPathnameChange(router.asPath, "editDataLoaded");

  // Detect what image was deleted from the editor
  const { onEditorDeleteImages, deletedImgUrls } = useEditorDeleteImages(
    quillRef,
    documentId
  );

  // Auto save: Modify as needed (Not yet implemented)
  const SAVE_INTERVAL_MS = 2000;

  // Allow for submitting Completed new/updated Post backend request
  const canSave =
    [title, content, displayedUsername, documentId].every(Boolean) &&
    !newDataIsLoading &&
    !updateIsLoading;

  // Currently there is an issue with how the useEditorConfig hook and/or the editor component handles un-mounting on successful Post submission or browser back button press.
  // router.replace() into a router.reload() in file "components/Blog/Posts/SinglePost/SinglePost.js" for brute handling said issue for now.
  useEffect(() => {
    if (!editData) return;
    const handlePopstate = () => {
      router.replace({
        pathname: `/blog/post/${editData.slug}/view`,
        query: { bid: true },
      });
    };
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [editData]);

  // Pusher Connection
  useEffect(() => {
    // console.log("DATA:", editData);
    if (!BLOG_ROOM_REGEX.test(pathname) || channel) return;

    !encodedDocumentId && setEncodedDocumentId(encodeURIComponent(documentId));

    // Pusher.logToConsole = true;

    if (
      token &&
      encodedDocumentId &&
      !pusher.channel(`private-${encodedDocumentId}`)
    ) {
      const channel = subscribeToChannel(encodedDocumentId);
      setChannel(channel);
    }

    return () => {
      setDocumentLoaded(false);
      setExpectEditData(false);
      setTitle("");
      setContent("");
    };
  }, [channel, encodedDocumentId, token]);

  // Error Handling
  useEffect(() => {
    if (!channel) return;

    if (!quillLoaded) {
      setEditorIsLoading(true);
    } else {
      setEditorIsLoading(false);
    }

    if (editData && content === "<p><br></p>") {
      setEditorHasError(true);
    }
  }, [channel, quillLoaded, editData, content]);

  // Expect an existing post to be fetched
  useEffect(() => {
    if (BLOG_EDIT_REGEX.test(pathname)) setExpectEditData(true);
  }, [pathname]);

  // Load Document
  useEffect(() => {
    if (
      !BLOG_ROOM_REGEX.test(pathname) ||
      !channel ||
      editorIsLoading ||
      (expectEditData && !editData)
    )
      return;
    // console.log("EDITDATA:", expectEditData, editData);
    const deltaFormat = editData ? true : false;
    const options = { documentId, userId, deltaFormat };

    const handleSubscriptionSucceeded = () => {
      if (!documentLoaded) {
        getDocument(options)
          .then((res) => res.json())
          .then((data) => {
            console.log("document loaded.");

            // On existing post: Set existing data first time only
            if (editData && !localStorage.getItem("editDataLoaded")) {
              setTitle(editData.title);
              setDisplayedUsername(editData.displayedUsername);
              localStorage.setItem("editDataLoaded", true);
            }

            if (typeof data === "object") {
              // In cases where the existing content does not get loaded, try increasing the delay.
              setTimeout(() => {
                const editor = quillRef?.current?.getEditor();
                editor?.setContents(data); // Quill Delta - set editor content
              }, 500);
            } else if (typeof data === "string") {
              setContent(data); // HTML Content - set editor content
            }
          });
        setDocumentLoaded(true);
      }
      channel.unbind(
        "pusher:subscription_succeeded",
        handleSubscriptionSucceeded
      );
    };

    channel.bind("pusher:subscription_succeeded", handleSubscriptionSucceeded);

    return () => {
      editorIsLoading && setEditorIsLoading(false);
      editorHasError && setEditorHasError(false);
    };
  }, [channel, editData, quillRef]);

  // Unsubscribe from channel
  useEffect(() => {
    if (
      !BLOG_ROOM_REGEX.test(pathname) &&
      channel &&
      pusher &&
      encodedDocumentId
    ) {
      pusher.unsubscribe(`private-${encodedDocumentId}`);
    }
  }, [encodedDocumentId, pathname, channel, pusher]);

  // On Change
  useEffect(() => {
    if (
      !BLOG_ROOM_REGEX.test(pathname) ||
      !channel ||
      !quillLoaded ||
      !encodedDocumentId ||
      titleChanged ||
      displayedUsernameChanged ||
      editorIsLoading
    )
      return;
    const handleTextChange = (delta, oldDelta, source) => {
      if (newDataIsError || updateIsError) setHideErrorOnChange(true);
      const content = quillRef?.current?.editor?.root.innerHTML;
      setContent(content);

      // console.log("DELTA:", delta, "CONTENT:", content);

      const options = { encodedDocumentId, delta };

      // Text insert/delete & formatting change
      if (
        source === "user" &&
        delta.ops.some(
          (op) =>
            (op.insert && typeof op.insert === "string") ||
            op.delete ||
            (op.retain &&
              op.attributes &&
              Object.keys(op.attributes).length > 0)
        )
      ) {
        // console.log("REACHED USER TEXT CHANGE");

        sendChanges(options, pusher);
      }

      // Image insert
      else if (
        source === "api" &&
        delta.ops.some((op) => op.insert?.image) &&
        clientId
      ) {
        console.log("CLIENT ID:", clientId, "TOKEN:", token);
        if (!clientId || clientId !== token) return;
        // console.log("REACHED IMAGE INSERT");
        // console.log("API DELTA:", delta, "API CONTENT:", content);
        // const insertedImage = delta.ops.find((op) => op.insert?.image).insert.image;
        // setContent(content);
        sendChanges(options, pusher);
      }

      // Image delete
      if (
        source === "user" &&
        delta.ops.some((op) => op.delete) &&
        oldDelta.ops.some((op) => op.insert?.image)
      ) {
        // console.log("REACHED IMAGE DELETION");
        onEditorDeleteImages(oldDelta);
        sendChanges(options, pusher);
      }

      // setContent(content);
    };
    // console.log("CONTENT CHANGE VALUE:", content.substring(-1, -11) + "...");
    quillRef?.current?.editor?.on("text-change", handleTextChange);

    return () => {
      quillRef?.current?.editor?.off("text-change", handleTextChange);
    };
  }, [
    channel,
    quillLoaded,
    encodedDocumentId,
    clientId,
    editData,
    newDataIsError,
    updateIsError,
    titleChanged,
    displayedUsernameChanged,
    editorIsLoading,
  ]);

  // Save document (Not yet implemented)
  useEffect(() => {
    if (
      !BLOG_ROOM_REGEX.test(pathname) ||
      !channel ||
      !quillLoaded ||
      !documentId ||
      editorIsLoading ||
      newData ||
      updateData
    )
      return;

    let timeout;
    const saveDocument = async () => {
      console.log("saved");
      const editor = quillRef?.current?.editor;
      await fetch("/api/pusher/saveDocument", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: documentId,
          data: editor?.getContents(),
        }),
      });
    };

    const interval = setInterval(() => {
      clearTimeout(timeout);
      timeout = setTimeout(saveDocument, 1000);
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [
    channel,
    documentId,
    quillLoaded,
    editData,
    editorIsLoading,
    newData,
    updateData,
  ]);

  // On Receive Changes
  useEffect(() => {
    if (
      !BLOG_ROOM_REGEX.test(pathname) ||
      !channel ||
      !quillLoaded ||
      editorIsLoading
    )
      return;

    const handler = (changesResponse) => {
      // console.log("RESPONSE:", changesResponse);
      const { delta } = changesResponse;

      // console.log("received delta:", delta);

      const editor = quillRef?.current?.getEditor();
      editor?.updateContents(delta); // set editor content
      console.log("updated editor contents");
    };

    channel.bind("receive-changes", (changesResponse) => {
      // Exclude user who emitted the change event
      if (changesResponse.socketId !== pusher.connection.socket_id) {
        // console.log("REACHED RECEVIED CHANGES:", changesResponse.socketId, pusher.connection.socket_id);
        handler(changesResponse);
      }
    });

    return () => {
      channel.unbind("receive-changes");
    };
  }, [channel, quillLoaded, editData, editorIsLoading]);

  // Broadcasted event to re-route all users on successful POST/PATCH request
  useEffect(() => {
    if (
      !BLOG_ROOM_REGEX.test(pathname) ||
      !channel ||
      !quillLoaded ||
      editorIsLoading
    )
      return;
    const handlePostCreatedOrUpdated = (data) => {
      console.log("RE-ROUTE ALL USERS", data);
      router.replace({
        pathname: `/blog/post/${data.slug}/view`,
        query: { pid: true },
      });
    };

    channel.bind("postCreatedOrUpdated", (data) => {
      handlePostCreatedOrUpdated(data);
    });

    return () => {
      channel.unbind("postCreatedOrUpdated");
      pusher.unsubscribe(`document-${encodedDocumentId}`);
    };
  }, [channel, encodedDocumentId, quillLoaded, editData, editorIsLoading]);

  // On successful post request
  useEffect(() => {
    if (
      BLOG_ROOM_REGEX.test(pathname) &&
      encodedDocumentId &&
      channel &&
      pusher &&
      (newDataIsSuccess || updateIsSuccess)
    ) {
      // empty state
      setTitle("");
      setDisplayedUsername("");
      setContent("");

      // Perform delete fetch request for each value in deletedImgUrls array
      if (deletedImgUrls.length > 0) {
        // console.log("DELETED IMG URLS:", deletedImgUrls);
        if (!documentId) return;
        deletedImgUrls.forEach(async (deletedImgUrl) => {
          await fetch(
            `/api/imageHandler?imgUrl=${encodeURIComponent(
              deletedImgUrl
            )}&postId=${encodeURIComponent(documentId)}`,
            { method: "DELETE" }
          );
        });
      }

      // Example: show success alert
      newDataIsSuccess && alert(`${newData.title} Post has been Created!`);
      updateIsSuccess && alert(`${updateData.message}`);

      // Emit event to server
      postCreateUpdate(pusher, encodedDocumentId, {
        slug: newDataIsSuccess ? newData.slug : updateData.slug,
      });

      newDataIsSuccess &&
        router.replace({
          pathname: `/blog/post/${newData.slug}/view`,
          query: { pid: true },
        });
      updateIsSuccess &&
        router.replace({
          pathname: `/blog/post/${updateData.slug}/view`,
          query: { pid: true },
        });

      pusher.unsubscribe(`private-${encodedDocumentId}`);
    }
  }, [channel, encodedDocumentId, pusher, newDataIsSuccess, updateIsSuccess]);

  // Image Upload Function
  const quillImageCallback = async () => {
    if (!BLOG_ROOM_REGEX.test(pathname) || !channel || !documentId || !token)
      return;
    function selectLocalImage() {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("multiple", "multiple");
      input.setAttribute(
        "accept",
        "image/png, image/gif, image/jpeg, image/webp"
      );
      input.click();

      // Listen upload local image and save to server
      input.onchange = () => {
        const fileList = Array.from(input.files);
        saveToServer(fileList);
      };
    }

    function saveToServer(files) {
      setClientId(token);
      const formData = new FormData();
      formData.append("documentId", documentId);
      files.forEach((file) => formData.append("images[]", file));
      fetch(`/api/imageHandler/${documentId}`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          data?.data?.forEach((url, index) => {
            insertToEditor(url);
          });
          setClientId(null);
        });
    }

    function insertToEditor(url) {
      // push image url to editor.
      const quillObj = quillRef?.current?.getEditor();
      const range = quillObj.getSelection();
      quillObj.insertEmbed(range.index, "image", url);
    }
    selectLocalImage();
  };

  // Post Title/User State Handler
  const formChangeHandler = (name) => (e) => {
    const value = e.target.value;
    if (newDataIsError || updateIsError) setHideErrorOnChange(true);
    if (name === "title") {
      setTitle(value); // Update title state
      setTitleChanged(true);
    } else if (name === "user") {
      setDisplayedUsername(value); // Update user state
      setDisplayedUsernameChanged(true);
    }
  };

  const formBlurHandler = (name) => (e) => {
    if (name === "title") {
      setTitleChanged(false);
    } else if (name === "user") {
      setDisplayedUsernameChanged(false);
    }
  };

  // Post Submit Handler
  const submitHandler = async (e) => {
    // if (!content || !title || !displayedUsername) return;
    if (!BLOG_ROOM_REGEX.test(pathname) || deleteIsLoading) return;
    e.preventDefault();

    hideErrorOnChange && setHideErrorOnChange(false);

    // console.log("CONTENT IN POST:", content);

    const editor = quillRef?.current?.editor;

    const data = editor?.getContents()

    // console.table({ documentId, title, content, displayedUsername });
    if (canSave && !editData) {
      await addNewPost({
        documentId,
        title,
        content,
        data,
        displayedUsername,
        userId,
      });
    } else if (canSave && editData) {
      await updatePost({
        documentId,
        title,
        content,
        data,
        displayedUsername,
        userId,
      });
    }
  };

  return {
    channel,
    pusher,
    formChangeHandler,
    formBlurHandler,
    submitHandler,
    quillImageCallback,
    content,
    quillRef,
    title,
    displayedUsername,
    documentId,
    editorIsLoading,
    editorHasError,
    newDataIsError,
    newDataError,
    updateIsError,
    postUpdateError,
    hideErrorOnChange,
  };
};

export default useEditorConfig;
