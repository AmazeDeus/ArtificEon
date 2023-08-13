import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

// createEntityAdapter - Allows to get some normalized state (the id arrays (iterable) will be used to get data from entities (non-iterable))
// sortComparer - Like an ordinary js sort method => putting the completed note at the bottom, and the open status is on top.
const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

// Inject endpoints into the originial apiSlice (eg. localhost:8000/notes)
export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: "/api/notes",
        // validateStatus - If an unexpected error occurs from "api/middleware/errorHandler", it will go through this validateStatus
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError; //!result.isError - Setting "isError: true" in "middleware/errorHandler" will allow it to catch here.
        },
      }),
      // keepUnusedDataFor: 5, // Testing purposes. remove in development (default 60s)
      transformResponse: (responseData) => {
        // responseData - the response from the query
        const loadedNotes = responseData.map((note) => {
          note.id = note._id; // the normalized data is looking for an "id" property instead of "_id" which mongoDB returns
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes); // Storing the responseData as normalized data with ids and entities in the notesAdapter
      },
      // provides the tags that could be invalidated - check the ids as a failsafe.
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: "/api/notes",
        method: "POST",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: "/api/notes",
        method: "PATCH",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/api/notes`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

// RTK Query - Will automatically create a hook based on this endpoint
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

//* Create some Selectors
// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select(); // chaining select() to getNotes in order to get the query result

// creates memoized selector for use in getSelectors below
// -> optimizing applications
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors automatically -> rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState // if null: initialState
);
