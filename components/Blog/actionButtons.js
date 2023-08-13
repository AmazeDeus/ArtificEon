import { Fragment, useEffect, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import useAuth from "../../hooks/use-auth";
import useEditorConfig from "../../hooks/use-editorConfig";
import { useDeletePostMutation } from "../../store/posts/postsApiSlice";
import pusher, { postDelete } from "@/helpers/pusher";
const GoTrashcan = dynamic(() => 
  import("@react-icons/all-files/go/GoTrashcan").then((mod) => mod.GoTrashcan)
);
const AiOutlineEdit = dynamic(() => 
  import("@react-icons/all-files/ai/AiOutlineEdit").then((mod) => mod.AiOutlineEdit)
);

import classes from "./actionButtons.module.css";

function ActionButtons({ post, postId, newHandler, editHandler, deleteHandler }) {
  const { isManager, isAdmin } = useAuth();
  const { channel, documentId } = useEditorConfig(null);
  const [id, setId] = useState("");

  const router = useRouter();

  // Delete Post
  const [
    deletePost,
    {
      data: deleteData,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeletePostMutation();

  useEffect(() => {
    if (post && post.id) {
      setId(post.id);
    }
    if (postId) {
      setId(postId);
    }
  }, [channel, post, postId]);

  useEffect(() => {
    if (!channel) return;

    // Listen for event from server and re-route all users
    const handlePostDeleted = (data) => {
      if (data !== id) return;
      router.replace({
        pathname: "/blog",
        query: { pid: id },
      });
    };

    channel.bind('postDeleted', (data) => {
      handlePostDeleted(data)
    });

    return () => {
      channel.unbind('postDeleted');
    };
  }, [channel, id]);

  useEffect(() => {
    if (isDelSuccess && channel && pusher) {
      alert(deleteData);

      postDelete(id, pusher)

      router.replace({
        pathname: "/blog",
        query: { pid: id },
      });
    }
  }, [isDelSuccess, channel, pusher, id]);

  const onDeletePostClicked = async () => {
    await deletePost({ documentId: id });
  };

  let newButton = null;
  let deleteButton = null;
  let editButton = null;
  if ((isManager || isAdmin) && newHandler) {
    newButton = (
      <div className={`${classes["blog-post__edit"]}`}>
        <Link href={`/blog/post/${nanoid()}/new`}>
          <AiOutlineEdit />
          <span>New</span>
        </Link>
      </div>
    );
  }
  if ((isManager || isAdmin) && editHandler && id) {
    editButton = (
      <div className={`${classes["blog-post__edit"]}`}>
        <Link href={`/blog/post/${id}/edit`}>
          <AiOutlineEdit />
          <span>Edit</span>
        </Link>
      </div>
    );
  }
  if ((isManager || isAdmin) && deleteHandler) {
    deleteButton = (
      <div className={`${classes["blog-post__edit"]}`}>
        <button title="Delete" onClick={onDeletePostClicked}>
          <GoTrashcan />
          <span>Delete</span>
        </button>
      </div>
    );
  }
  return (
    <Fragment>
      {newHandler && newButton}
      {editHandler && editButton}
      {deleteHandler && deleteButton}
    </Fragment>
  );
}

export default ActionButtons;
