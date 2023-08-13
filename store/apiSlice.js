import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "./authSlice";
import { API } from "@/config";

// Applied to every req sent
const baseQuery = fetchBaseQuery({
  baseUrl: `${API}`,
  credentials: "include", // always send the cookie with refresh token
  // allows you to get the current state of the application. Checking the auth state and current token
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body (see "fetchBaseQuery()")
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  // result - the result from the first request using the original access token (might or might not succeed, if not, it reaches the if statement)
  // if it has expired (status:403) -> send refresh token -> new access token (setCredentials) -> retry original query
  let result = await baseQuery(args, api, extraOptions);

  // console.log(result)

  // Possible to handle other status codes as well
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    // the data should hold the access token
    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query/request (baseQuery above) with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // refresh token has expired
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired.";
      }
      
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User", "Post", "GeoData"],
  endpoints: (builder) => ({}),
});
