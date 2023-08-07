import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { getApi } from "../../utils/Apis";
import { setLoading } from "../configSlice";
import { useState } from "react";
const initialState = {
  jobs: [],
};
export const getAllJobs = createAsyncThunk(
  "getAllJobs",
  async ({ lastKey, user_id }, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi(
      "/getjobslist/filter?industry_id=&lastKey=" +
        lastKey +
        "&jobtype_id=&jobstage_id=&personalitytype_id=&title=&user_id=" +
        user_id +
        "&favourite=&appliedjobs=&recent="
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const getFilteredJobs = createAsyncThunk(
  "getFilteredJobs",
  async (
    {
      selectedFilters,
      lastKey,
      jobtype,
      jobstage,
      personalityType,
      title,
      user_id,
      favourites,
      recentjob,
      appliedjob,
    },
    { dispatch }
  ) => {
    if (selectedFilters === "1111" || selectedFilters === "all industries") {
      selectedFilters = "";
    }
    if (jobtype === "1111" || jobtype === "all job types") {
      jobtype = "";
    }
    if (jobstage === "1111" || jobstage === "all stages") {
      jobstage = "";
    }
    if (personalityType === "1111" || personalityType === "all types") {
      personalityType = "";
    }
    dispatch(setLoading(true));
    const { data } = await getApi(
      "/getjobslist/filter?industry_id=" +
        selectedFilters +
        "&lastKey=" +
        lastKey +
        "&jobtype_id=" +
        jobtype +
        "&jobstage_id=" +
        jobstage +
        "&personalitytype_id=" +
        personalityType +
        "&title=" +
        title +
        "&user_id=" +
        user_id +
        "&favourite=" +
        favourites +
        "&appliedjobs=" +
        appliedjob +
        "&recent=" +
        recentjob
    );
    dispatch(setLoading(false));
    console.log("PAYLOAD DATA", data);
    return data;
  }
);

export const getJobDetail = createAsyncThunk(
  "getJobDetail",
  async ({ job_id }, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi("/jobs/getjob?job_id=" + job_id);
    dispatch(setLoading(false));
    return data;
  }
);

export const jobsSlice = createSlice({
  name: "configjobslice",
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
export const {} = jobsSlice.actions;
export default jobsSlice.reducer;
