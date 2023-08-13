import { useGetPostsQuery } from "../store/posts/postsApiSlice";

// Pass in either the post id or slug to find a specific post.
export const useGetSinglePost = (postId, postSlug) => {
  const { post } = useGetPostsQuery("postsList", {
    selectFromResult: ({ data }) => ({
      post:
        data && data.entities
          ? postId
            ? data.entities[postId]
            : Object.values(data.entities).find(
                (post) => post.slug === postSlug
              )
          : undefined,
    }),
    refetchOnMountOrArgChange: true,
  });
  
  return post;
};
