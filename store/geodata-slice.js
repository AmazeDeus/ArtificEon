import { createSlice } from "@reduxjs/toolkit";

const geoSlice = createSlice({
  name: "cart",
  initialState: { data: null, changed: false },
  reducers: {
    fetchGeo(state, action) {
      // for use when fetching data
      state.data = action.payload.data;
    },
  },
});

export const geoActions = geoSlice.actions;

export default geoSlice;