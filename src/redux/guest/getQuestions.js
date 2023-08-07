import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { getApi, postApi } from "../../utils/Apis";
import { setLoading } from "../configSlice";
const initialState = {};
export const getAllQuestions = createAsyncThunk(
  "getAllQuestions",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi(
      "/candidate/getquestion?job_id=" + payload,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);
export const getAllQuestionsWithoutLogin = createAsyncThunk(
  "getAllQuestionsWithoutLogin",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi(
      "/candidate/getquestionwithoutlogin?job_id=" + payload,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);
export const postAnswers = createAsyncThunk(
  "postAnswers",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/candidate/applywithlogin", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);
export const postAnswersWithoutLogin = createAsyncThunk(
  "postAnswersWithoutLogin",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi(
      "/candidate/applywithoutlogin",
      payload,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);
export const getQuestions = createSlice({
  name: "configquestion",
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
  // extraReducers(builder) {
  //   builder
  //     .addCase(getAllQuestions.pending, (state, action) => {
  //       state.loading = true;
  //     })
  //     .addCase(getAllQuestions.fulfilled, (state, action) => {
  //       console.log("GET QUESTION", action);
  //       state.loading = false;
  //     })
  //     .addCase(getAllQuestions.rejected, (state, action) => {
  //       state.loading = false;
  //     });
  // },
});
// Action creators are generated for each case reducer function
export const {} = getQuestions.actions;
export default getQuestions.reducer;
