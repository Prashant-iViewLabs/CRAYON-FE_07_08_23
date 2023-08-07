import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { getApi, postApi } from "../../utils/Apis";
import { setLoading } from "../configSlice";
const initialState = {
  candidate: [],
};
export const getCandidateJobs = createAsyncThunk(
  "getCandidateJobs",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi(
      `/candidate/job?jobstatus_id=&candidatestatus_id=`,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const getCandidateFilteredJob = createAsyncThunk(
  "getCandidateFilteredJob",
  async ({ filterMyStatus, filterJobStatus }, { dispatch }) => {
    if (filterMyStatus === "1111" || filterMyStatus === "My Status") {
      filterMyStatus = "";
    }
    if (filterJobStatus === "1111" || filterJobStatus === "Job Status") {
      filterJobStatus = "";
    }
    dispatch(setLoading(true));
    const { data } = await getApi(
      `/candidate/job?jobstatus_id=${filterJobStatus}&candidatestatus_id=${filterMyStatus}`,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const changeStatus = createAsyncThunk(
  "changeStatus",
  async (payload, { dispatch }) => {
    console.log("CHANGE STATUS", payload);
    dispatch(setLoading(true));
    const { data } = await postApi("/candidate/statuschange", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

// export const getFilteredJobs = createAsyncThunk(
//   "getFilteredJobs",
//   async ({ selectedFilters, lastKey }, { dispatch }) => {
//     dispatch(setLoading(true));
//     const { data } = await getApi(
//       "/getjobslist/filter?industry_id=" +
//         selectedFilters +
//         "&lastKey=" +
//         lastKey
//     );
//     dispatch(setLoading(false));
//     return data;
//   }
// );
export const candidateJobs = createSlice({
  name: "configcandidatejobs",
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
export const {} = candidateJobs.actions;
export default candidateJobs.reducer;
