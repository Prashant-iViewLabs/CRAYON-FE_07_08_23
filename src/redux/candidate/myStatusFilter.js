import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { getApi } from "../../utils/Apis";

const initialState = {
  loading: false,
  alert: {
    show: false,
    type: ALERT_TYPE.ERROR,
    msg: ERROR_MSG,
  },
  mystatusfilter: [],
};
export const getMyStatusFilter = createAsyncThunk(
  "getMyStatusFilter",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/candidate/getJobStatus", true);
    return { data };
  }
);
export const configMyStatus = createSlice({
  name: "configMyStatus",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAlert: (state, action) => {
      state.alert.show = action.payload.show;
      state.alert.type = action.payload.type;
      state.alert.msg = action.payload.msg;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getMyStatusFilter.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyStatusFilter.fulfilled, (state, action) => {
        console.log("ACTION PAYLOAD", action.payload.data);
        const jobStatus = action.payload.data.data?.map((type, index) => {
          type.id = type.candidate_job_status_id;
          type.color = "blueButton600";
          type.name = type.name.toLowerCase();
          return type;
        });
        state.loading = false;
        const obj = {
          id: 1111,
          name: "My Status",
          color: "blueButton600",
          title: true,
        };
        jobStatus?.unshift(obj);
        state.mystatusfilter = jobStatus;
      })
      .addCase(getMyStatusFilter.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export const { setLoading, setAlert } = configMyStatus.actions;
export default configMyStatus.reducer;
