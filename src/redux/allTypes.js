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
  types: [],
};
export const getAllTypes = createAsyncThunk(
  "getAllTypes",
  async (payload, { dispatch }) => {
    // dispatch(setLoading(true))
    const { data } = await getApi("/personalities");
    // dispatch(setLoading(false))
    return data;
  }
);
export const configAllTypes = createSlice({
  name: "configtypes",
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
      .addCase(getAllTypes.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllTypes.fulfilled, (state, action) => {
        const allTypes = action.payload.data.map((type, index) => {
          type.id = type.personality_id;
          // type.color =
          //   (type?.name == "challenger" && "purpleButton") ||
          //   (type?.name == "character" && "yellowButton200") ||
          //   (type?.name == "contemplator" && "blueButton500") ||
          //   (type?.name == "collaborator" && "pinkButton");
          type.color = "purpleButton";
          type.name = type.name.toLowerCase();
          return type;
        });
        state.loading = false;
        const obj = {
          id: 1111,
          name: "all types",
          color: "purpleButton",
          title: true,
        };
        allTypes.unshift(obj);
        state.types = allTypes;
      })
      .addCase(getAllTypes.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
// Action creators are generated for each case reducer function
export const { setLoading, setAlert } = configAllTypes.actions;
export default configAllTypes.reducer;
