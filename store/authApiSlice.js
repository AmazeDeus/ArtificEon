// extending apiSlice. some notes at the bottom for the sendLogout endpoint

import { apiSlice } from "./apiSlice";
import { logOut, setCredentials } from "./authSlice";
import { geoApiSlice } from "./geoData/geoDataSlice";

// injecting multiple endpoints
// credentials would be the username and password that gets sent with the query
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `/api/auth`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: `/api/auth/logout`,
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data);
          dispatch(logOut());

          // setTimeout prevents it from running into issues where it keep hanging onto the queries inside of notesList and membersList components when logging out from those components.
          // The RTK queries are supposed to unsubscribe the components when the component unmounts, but in strange cases where it wouldn't, a setTimeout gives the component the extra time it needs before resetting the api state.
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState()); // clear out the cache and the query subscriptions
            
            // Prefetch the Geo Data when redirected back to "/"
            dispatch(
              geoApiSlice.util.prefetch("getGeo", "geoData", { force: true })
            );
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    // getting the new access token
    refresh: builder.mutation({
      query: () => ({
        url: "/api/auth/refresh",
        method: "GET",
      }),
      // Refresh mutation for setting the credentials
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Accesstoken in Slice: ", data); // accesstoken
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;

// onQueryStarted note:
// Makes it easier to dispatch each one of the actions, without having to import useDispatch into every component
// Makes it easy to just call the sendLogout endpoint (the mutation) which would usually be imported into the component
// provides a dispatch and queryFulfilled
// await to verify that the query has been fulfilled, which would be the message from the REST API on signout
