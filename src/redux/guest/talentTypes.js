import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { getApi } from "../../utils/Apis";
const initialState = {
  loading: false,
  alert: {
    show: false,
    type: ALERT_TYPE.ERROR, // set default type to avoid warning in console
    msg: ERROR_MSG,
  },
  talentType: [],
};
export const getAllTalentType = createAsyncThunk(
  "getAllTalentType",
  async (payload, { dispatch }) => {
    // dispatch(setLoading(true))
    const { data } = await getApi("/job/types");
    // dispatch(setLoading(false))
    return data;
  }
);
export const configTalenType = createSlice({
  name: "talenttype",
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
      .addCase(getAllTalentType.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllTalentType.fulfilled, (state, action) => {
        const allTalentType = action.payload.data.map((type, index) => {
          // type.id = type.job_role_type_id;
          type.id = index + 1;
          type.color = "blueButton700";
          type.name = type.name.toLowerCase();
          return type;
        });
        state.loading = false;
        const obj = {
          id: 1111,
          name: "all talent",
          color: "blueButton700",
          title: true,
        };
        allTalentType.unshift(obj);
        state.talentType = allTalentType.filter(
          (item) => !item.job_crayon_type_id
        );
      })
      .addCase(getAllTalentType.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
// Action creators are generated for each case reducer function
export const { setLoading, setAlert } = configTalenType.actions;
export default configTalenType.reducer;
