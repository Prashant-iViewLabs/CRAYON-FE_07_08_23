import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../utils/Constants";
import { getApi } from "../utils/Apis";
const initialState = {
  loading: false,
  alert: {
    show: false,
    type: ALERT_TYPE.ERROR,
    msg: ERROR_MSG,
  },
  status: [],
};
export const getJobStatus = createAsyncThunk(
  "getJobStatus",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/job/getAllStatus", true);
    return { data };
  }
);
export const configJobStatus = createSlice({
  name: "configjobstatus",
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
      .addCase(getJobStatus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getJobStatus.fulfilled, (state, action) => {
        const jobStatus = action.payload.data.data?.map((type, index) => {
          type.id = type.job_status_id;
          type.color = "lightBlueJobButton300";
          type.name = type.name.toLowerCase();
          return type;
        });
        state.loading = false;
        const obj = {
          id: 1111,
          name: "Job Status",
          color: "lightBlueJobButton300",
          title: true,
        };
        jobStatus?.unshift(obj);
        state.status = jobStatus;
      })
      .addCase(getJobStatus.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export const { setLoading, setAlert } = configJobStatus.actions;
export default configJobStatus.reducer;
