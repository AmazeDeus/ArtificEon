import { apiSlice } from "../apiSlice";
import { feature } from "topojson-client";

export const geoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeo: builder.query({
      query: () => ({
        url: "/api/geoData",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),

      transformResponse: (responseData) => {
        const loadedData = feature(
          responseData.geoData,
          responseData.geoData.objects.ne_110m_admin_0_countries
        );
        // console.log(loadedData);
        return loadedData;
      },
      providesTags: (result, error, arg) => [{ type: "GeoData", id: "GEO" }],
    }),
  }),
});

export const { useGetGeoQuery } = geoApiSlice;
