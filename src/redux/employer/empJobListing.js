import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { getApi } from "../../utils/Apis";
import { useState } from "react";
// import { setLoading } from "./employerJobsConfigSlice";
import { setLoading } from "../configSlice";
const initialState = {
  employerjobs: [],
};
export const getAllJobsListing = createAsyncThunk(
  "getAllJobsListing",
  async (payload, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const { data } = await getApi(
        `/admin/employer/job?jobstage_id=&jobstatus_id=`,
        true
      );
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      // Handle the error appropriately (e.g., display an error message)
      alert("Error occurred while fetching job listings:", error);
      throw error;
    }
  }
);

export const getFilteredJobsListing = createAsyncThunk(
  "getFilteredJobsListing",
  async ({ selectedFilters, selectedStatusFilter }, { dispatch }) => {
    if (selectedFilters === "1111" || selectedFilters === "all") {
      selectedFilters = "";
    }
    if (selectedStatusFilter === "1111" || selectedStatusFilter === "all") {
      selectedStatusFilter = "";
    }
    dispatch(setLoading(true));
    const { data } = await getApi(
      `/admin/employer/job?jobstage_id=${selectedFilters}&jobstatus_id=${selectedStatusFilter}`,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);
export const empJobListing = createSlice({
  name: "configemployerjobs",
  initialState,
  reducers: {
    // setLoading: (state, action) => {
    //     state.loading = action.payload
    // },
    // setAlert: (state, action) => {
    //     state.alert.show = action.payload.show;
    //     state.alert.type = action.payload.type;
    //     state.alert.msg = action.payload.msg;
    // }
  },
  // extraReducers(builder) {
  //     builder
  //         .addCase(signup.pending, (state, action) => {
  //             // state.status = 'loading'
  //         })
  //         .addCase(signup.fulfilled, (state, action) => {
  //             // state.status = 'succeeded'
  //         })
  //         .addCase(signup.rejected, (state, action) => {
  //             // state.status = 'failed'
  //         })
  // }
});
// Action creators are generated for each case reducer function
export const {} = empJobListing.actions;
export default empJobListing.reducer;
