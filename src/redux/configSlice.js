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
  industries: [],
};
export const getAllIndustries = createAsyncThunk(
  "getAllIndustries",
  async (payload, { dispatch }) => {
    // dispatch(setLoading(true))
    const { data } = await getApi("/industries");
    // dispatch(setLoading(false))
    return data;
  }
);
export const configSlice = createSlice({
  name: "config",
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
      .addCase(getAllIndustries.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllIndustries.fulfilled, (state, action) => {
        const allIndustries = action.payload.data.map((industry, index) => {
          industry.id = industry.industry_id;
          industry.color = "blueButton600";
          industry.name = industry.name.toLowerCase();
          return industry;
        });
        state.loading = false;
        const obj = {
          id: 1111,
          name: "all industries",
          color: "blueButton600",
          title: true,
        };
        allIndustries.unshift(obj);
        state.industries = allIndustries;
      })
      .addCase(getAllIndustries.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
// Action creators are generated for each case reducer function
export const { setLoading, setAlert } = configSlice.actions;
export default configSlice.reducer;
