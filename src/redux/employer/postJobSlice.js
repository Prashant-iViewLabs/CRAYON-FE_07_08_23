import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApi, postApi } from "../../utils/Apis";
import { setLoading } from "../configSlice";

const initialState = {
  titles: [],
  skills: [],
  tools: [],
  workExperience: [],
  qualifications: [],
  requiredQua: [],
  currency: [],
  country: [],
  town: [],
  roleTypes: [],
  workSetup: [],
  salary: [],
  personalities: [],
  traits: [],
};

export const getJob = createAsyncThunk(
  "getJob",
  async (payload, { dispatch }) => {
    const endPoint = "/job/get?job_id=" + payload;
    const { data } = await getApi(endPoint, true);
    return data;
  }
);

export const getTitles = createAsyncThunk(
  "getTitles",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/job/titles", true);
    return data;
  }
);

export const getSkills = createAsyncThunk(
  "getSkills",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/skills", true);
    return data;
  }
);

export const getWorkExperience = createAsyncThunk(
  "getWorkExperience",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/experiences", true);
    return data;
  }
);

export const getQualification = createAsyncThunk(
  "getQualification",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/qualifications", true);
    return data;
  }
);

export const getRequiredQualification = createAsyncThunk(
  "getRequiredQualification",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/highestQual", true);
    return data;
  }
);

export const getCurrency = createAsyncThunk(
  "getCurrency",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/currencies", true);
    return data;
  }
);

export const getRoleTypes = createAsyncThunk(
  "getRoleTypes",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/job/roletypes", true);
    return data;
  }
);

export const getWorkSetup = createAsyncThunk(
  "getWorkSetup",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/job/worktypes", true);
    return data;
  }
);

export const getCountry = createAsyncThunk(
  "getCountry",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/regions", true);
    return data;
  }
);

export const getTown = createAsyncThunk(
  "getTown",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/towns", true);
    return data;
  }
);

export const getSalary = createAsyncThunk(
  "getSalary",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/salaries?currency_id=" + payload, true);
    return data;
  }
);

export const getPersonalities = createAsyncThunk(
  "getPersonalities",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/personalities", true);
    console.log(data);
    return data;
  }
);

export const getTraits = createAsyncThunk(
  "getTraits",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/job/trait", true);
    return data;
  }
);

export const getTools = createAsyncThunk(
  "getTools",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/tools", true);
    return data;
  }
);

export const getBasicData = createAsyncThunk(
  "getBasicData",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/job/getJobBasics?job_id=" + payload, true);
    return data;
  }
);

export const addBasicData = createAsyncThunk(
  "addBasicData",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/job/create/basics", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const getDetailData = createAsyncThunk(
  "getDetailData",
  async (payload, { dispatch }) => {
    const { data } = await getApi(
      "/job/getJobTheDetails?job_id=" + payload,
      true
    );
    return data;
  }
);

export const addDetailData = createAsyncThunk(
  "addDetailData",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/job/create/details", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const uploadSpecData = createAsyncThunk(
  "uploadSpecData",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi(
      "/upload/jobspec",
      payload,
      true,
      "multipart/form-data"
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const getCultureData = createAsyncThunk(
  "getCultureData",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/job/getJobCulture?job_id=" + payload, true);
    return data;
  }
);

export const addCultureData = createAsyncThunk(
  "addCultureData",
  async (payload, { dispatch }) => {
    console.log(payload);
    dispatch(setLoading(true));
    const { data } = await postApi("/job/create/culture", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const postJobSlice = createSlice({
  name: "postJob",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getTitles.fulfilled, (state, action) => {
        state.titles = action.payload.data.map((title) => {
          return {
            ...title,
            id: title.job_title_id,
            name: title.title,
          };
        });
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.skills = action.payload.data.map((skill) => {
          return {
            ...skill,
            id: skill.tag_id,
            name: skill.tag,
          };
        });
      })
      .addCase(getTools.fulfilled, (state, action) => {
        state.tools = action.payload.data.map((tool) => {
          return {
            ...tool,
            id: tool.tool_id,
            name: tool.name,
          };
        });
      })
      .addCase(getWorkExperience.fulfilled, (state, action) => {
        state.workExperience = action.payload.data.map((exp) => {
          return {
            ...exp,
            value: exp.experience_id,
            label: exp.year,
          };
        });
      })
      .addCase(getQualification.fulfilled, (state, action) => {
        state.qualifications = action.payload.data.map((qua) => {
          return {
            ...qua,
            id: qua.qualification_id,
            name: qua.name,
          };
        });
      })
      .addCase(getRequiredQualification.fulfilled, (state, action) => {
        state.requiredQua = action.payload.data.map((qua) => {
          return {
            ...qua,
            id: qua.highest_qualification_id,
            name: qua.description,
          };
        });
      })
      .addCase(getCurrency.fulfilled, (state, action) => {
        state.currency = action.payload.data.map((curr) => {
          return {
            ...curr,
            id: curr.currency_id,
            name: curr.currency,
          };
        });
      })
      .addCase(getCountry.fulfilled, (state, action) => {
        state.country = action.payload.data.map((curr) => {
          return {
            ...curr,
            id: curr.region_id,
            name: curr.name,
          };
        });
      })
      .addCase(getTown.fulfilled, (state, action) => {
        state.town = action.payload.data.map((curr) => {
          return {
            ...curr,
            id: curr.town_id,
            name: curr.name,
          };
        });
      })
      .addCase(getWorkSetup.fulfilled, (state, action) => {
        state.workSetup = action.payload.data.map((curr) => {
          return {
            ...curr,
            id: curr.job_work_type_id,
            name: curr.name,
          };
        });
      })
      .addCase(getRoleTypes.fulfilled, (state, action) => {
        state.roleTypes = action.payload.data.map((curr) => {
          return {
            ...curr,
            id: curr.job_role_type_id,
            name: curr.name,
          };
        });
      })
      .addCase(getPersonalities.fulfilled, (state, action) => {
        state.personalities = action.payload.data.map((curr) => {
          return {
            ...curr,
            id: curr.personality_id,
            name: curr.name,
          };
        });
      })
      .addCase(getTraits.fulfilled, (state, action) => {
        state.traits = action.payload.data.map((curr) => {
          return {
            ...curr,
            id: curr.trait_id,
            name: curr.name,
          };
        });
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = postJobSlice.actions;

export default postJobSlice.reducer;
