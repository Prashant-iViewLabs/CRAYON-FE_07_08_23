import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { postApi, getApi } from "../../utils/Apis";
import { setLoading } from "../configSlice";
const initialState = {};
export const getManage = createAsyncThunk(
  "getManage",
  async (payload, { dispatch }) => {
    const { data } = await getApi(
      `/admin/employer/jobstatus?job_id=${payload}`,
      true
    );
    return data;
  }
);

export const getQandA = createAsyncThunk(
  "getQandA",
  async ({ job_id, user_id }, { dispatch }) => {
    const { data } = await getApi(
      `/admin/employer/questionanswer?job_id=${job_id}&user_id=${user_id}`,
      true
    );
    return data;
  }
);

export const getCandidateCV = createAsyncThunk(
  "getCandidateCV",
  async ({ user_id }, { dispatch }) => {
    const { data } = await getApi(`/cv/getcvpage?user_id=${user_id}`, true);
    return data;
  }
);

export const statusChange = createAsyncThunk(
  "statusChange",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/admin/updatestatusjob", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);
export const duplicateThejob = createAsyncThunk(
  "duplicateThejob",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/admin/duplicatejob", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);
export const getTalentJobStatusCount = createAsyncThunk(
  "getTalentJobStatusCount",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi(
      `/admin/employer/talentstatuscount`,
      payload,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);
export const getTalentJobStatusApplications = createAsyncThunk(
  "getTalentJobStatusApplications",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi(
      `/admin/employer/getTalent?lastKey=`,
      payload,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);
export const changeJobApplicationStatus = createAsyncThunk(
  "changeApplicationStatus",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi(
      `/admin/employer/statusChange`,
      payload,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);
export const getMyJobTeamMemebers = createAsyncThunk(
  "getMyJobTeamMembers",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi(`/admin/employer/getTeams`, payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const myJobsSlice = createSlice({
  name: "myjobs",
  initialState,
  reducers: {},
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
export const {} = myJobsSlice.actions;
export default myJobsSlice.reducer;
