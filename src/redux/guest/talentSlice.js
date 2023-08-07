import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { getApi, postApi } from "../../utils/Apis";
import { setLoading } from "../configSlice";
const initialState = {
  talent: [],
};
export const getTalentList = createAsyncThunk(
  "getTalentList",
  async ({ lastKey, user_id }, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi(
      "/gettalentslist?lastKey=" +
        lastKey +
        "&user_id=" +
        user_id +
        "&industry_id=&personalitytype_id=&jobtype_id="
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const favouriteJob = createAsyncThunk(
  "favouriteJob",
  async (payload, { dispatch }) => {
    console.log("FAVOURITE", payload);
    dispatch(setLoading(true));
    const { data } = await postApi("/favouritejob", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const getFilteredTalent = createAsyncThunk(
  "getFilteredTalent",
  async (
    { selectedFilters, lastKey, personalityType, user_id, jobtype },
    { dispatch }
  ) => {
    if (selectedFilters === "1111" || selectedFilters === "all industries") {
      selectedFilters = "";
    }
    if (jobtype === "1111" || jobtype === "all talent") {
      jobtype = "";
    }
    if (personalityType === "1111" || personalityType === "all types") {
      personalityType = "";
    }

    dispatch(setLoading(true));
    const { data } = await getApi(
      "/gettalentslist?lastKey=" +
        lastKey +
        "&user_id=" +
        user_id +
        "&industry_id=" +
        selectedFilters +
        "&personalitytype_id=" +
        personalityType +
        "&jobtype_id=" +
        jobtype
    );
    dispatch(setLoading(false));
    return data;
  }
);
export const talentSlice = createSlice({
  name: "configtalent",
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
export const {} = talentSlice.actions;
export default talentSlice.reducer;
