import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../utils/Constants";
import { getApi } from "../utils/Apis";
const initialState = {
  loading: false,
  alert: {
    show: false,
    type: ALERT_TYPE.ERROR, // set default type to avoid warning in console
    msg: ERROR_MSG,
  },
  stages: [],
};
export const getAllStages = createAsyncThunk(
  "getAllStages",
  async (payload, { dispatch }) => {
    // dispatch(setLoading(true))
    const { data } = await getApi("/job/stages");
    // dispatch(setLoading(false))
    return data;
  }
);
export const configStages = createSlice({
  name: "configstages",
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
    // increment: (state) => {
    //     // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //     // doesn't actually mutate the state because it uses the Immer library,
    //     // which detects changes to a "draft state" and produces a brand new
    //     // immutable state based off those changes
    //     state.value += 1
    // },
    // decrement: (state) => {
    //     state.value -= 1
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //     state.value += action.payload
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllStages.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllStages.fulfilled, (state, action) => {
        const allStages = action.payload.data?.map((type, index) => {
          type.id = type.job_stage_id;
          type.color = "lightGreenButton300";
          type.name = type.name.toLowerCase();
          return type;
        });
        state.loading = false;
        const obj = {
          id: 1111,
          name: "all stages",
          color: "lightGreenButton300",
          title: true,
        };
        allStages?.unshift(obj);
        state.stages = allStages;
      })
      .addCase(getAllStages.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
// Action creators are generated for each case reducer function
export const { setLoading, setAlert } = configStages.actions;
export default configStages.reducer;