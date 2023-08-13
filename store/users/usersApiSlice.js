import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

// Allows to get some normalized state (will use the ids array (iterable) to get data from entities (non-iterable))
// sortComparer - Like an ordinary js sort method => putting the inactive user at the bottom, otherwise the active user is on top.
const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1),
});

const initialState = usersAdapter.getInitialState();

// Injecting endpoints into the originial apiSlice (eg. localhost:8000/users)
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/api/members",
        // validateStatus - If an unexpected error occurs from "api/middleware/errorHandler", it will go through this validateStatus
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError; //!result.isError - Setting "isError: true" in "middleware/errorHandler" will allow it to catch here.
        },
      }),
      // keepUnusedDataFor: 5, // Testing purposes. Remove in deployment (default 60s)
      transformResponse: (responseData) => {
        // responseData - the response from the query
        const loadedUsers = responseData.map((user) => {
          user.id = user._id; // the normalized data is looking for an "id" property, instead of "_id" which MongoDB returns
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers); // Storing the responseData as normalized data with ids and entities in the usersAdapter
      },
      // provides the tags that could be invalidated - check the ids as a failsafe.
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }]; // If no id
      },
    }),
    // Employees, Managers, Admins
    addNewMember: builder.mutation({
      query: (initialUserData) => ({
        url: "/api/members",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    // Users
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/api/users",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/api/members",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/api/members`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

// RTK Query - Will automatically create a hook based on this endpoint
export const {
  useGetUsersQuery,
  useAddNewMemberMutation,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

//* Creating some Selectors
// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select(); // chaining select() to getUsers in order to get the query result

// creates memoized selector for use in getSelectors below
// -> optimizing applications
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors automatically -> rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState // if null: initialState
);
