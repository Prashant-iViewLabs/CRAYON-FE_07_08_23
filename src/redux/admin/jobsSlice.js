import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { getApi, postApi } from "../../utils/Apis";
import { setLoading } from "../configSlice";

const initialState = {
  jobs: [],
};

export const getAllJobs = createAsyncThunk(
  "getAllJobs",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi("/admin/job?lastKey=" + payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const getJobCount = createAsyncThunk(
  "getJobCount",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi(`/admin/getcount?status_id=${payload}`, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const approveJob = createAsyncThunk(
  "approveJob",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/admin/approvejob", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const talentPersonality = createAsyncThunk(
  "talentPersonality",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/admin/talentPersonality", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const addJobComment = createAsyncThunk(
  "addJobComment",
  async (payload, { dispatch }) => {
    // dispatch(setLoading(true));
    const { data } = await postApi("/admin/addJobComment", payload, true);
    // dispatch(setLoading(false));
    return data;
  }
);

export const getAllComments = createAsyncThunk(
  "getAllComments",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi(
      `/admin/allJobComment?job_id=${payload}`,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const getAllTalentJobs = createAsyncThunk(
  "getAllTalentJobs",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi("/admin/talent?lastKey=" + payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const jobsSlice = createSlice({
  name: "config",
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
