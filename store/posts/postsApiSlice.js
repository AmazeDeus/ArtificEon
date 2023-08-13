import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

// createEntityAdapter - Allows to get some normalized state (the id arrays (iterable) will be used to get data from entities (non-iterable))
// sortComparer - Like an ordinary js sort method => putting the most recent posts at the top.
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
   new Date(a.updatedAt) - new Date(b.updatedAt)
});

const initialState = postsAdapter.getInitialState();

// Injecting endpoints into the originial apiSlice (eg. /posts)
export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => ({
        url: "/api/posts",
        // validateStatus - If an unexpected error occurs from "api/middleware/errorHandler", it will go through this validateStatus
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError; //!result.isError - Setting "isError: true" in "middleware/errorHandler" will allow it to catch here.
        },
      }),
      // keepUnusedDataFor: 5, // Testing purposes. remove in development (default 60s)
      transformResponse: (responseData) => {
        // responseData - the response from the query
        const loadedPosts = responseData.map((post) => {
          post.id = post._id; // the normalized data is looking for an "id" property instead of "_id" which MongoDB returns
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts); // Storing the responseData as normalized data with ids and entities in the postsAdapter
      },
      // provides the tags that could be invalidated - check the ids as a failsafe.
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Post", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Post", id })),
          ];
        } else return [{ type: "Post", id: "LIST" }]; // If no id
      },
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/api/posts",
        method: "POST",
        body: {
          ...initialPost,
        },
        transformResponse: (responseData) => {
          // responseData - the response from our query
          const newPost = responseData;
          return postsAdapter.setAll(initialState, newPost); // Storing the responseData as normalized data with ids and entities in the postsAdapter
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: "/api/posts",
        method: "PATCH",
        body: {
          ...initialPost,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    deletePost: builder.mutation({
      query: ({ documentId }) => ({
        url: `/api/posts/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
  }),
});

// RTK Query - Will automatically create a hook based on this endpoint
export const {
  useGetPostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApiSlice;

//* Creating some Selectors
// returns the query result object
export const selectPostsResult = postsApiSlice.endpoints.getPosts.select(); // chaining select() to getPosts in order to get the query result

// creates memoized selector for use in getSelectors below
// -> optimizing applications
const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors automatically -> rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState // if null: initialState
);