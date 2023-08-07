import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApi, postApi } from "../../utils/Apis";
import { setLoading } from "../configSlice";

const initialState = {
  titles: [],
  industries: [],
  skills: [],
  experiences: [],
  noticePeriod: [],
  qualifications: [],
  currency: [],
  salary: [],
  school: [],
  institution: [],
  qualification: [],
  typeOfQualification: [],
  association: [],
};
export const getCV = createAsyncThunk(
  "getCV",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/cv/get", true);
    return data;
  }
);

export const uploadCv = createAsyncThunk(
  "uploadCv",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi(
      "/upload/cv",
      payload,
      true,
      "multipart/form-data"
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const uploadCvWithoutLogin = createAsyncThunk(
  "uploadCvWithoutLogin",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi(
      "/upload/cvwithoutlogin",
      payload,
      true,
      "multipart/form-data"
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const uploadPortfolio = createAsyncThunk(
  "uploadPortfolio",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi(
      "/upload/portfolio",
      payload,
      true,
      "multipart/form-data"
    );
    dispatch(setLoading(false));
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

export const getIndustries = createAsyncThunk(
  "getIndustries",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/industries");
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

export const getNoticePeriod = createAsyncThunk(
  "getNoticePeriod",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/noticeperiod", true);
    return data;
  }
);

export const getQualifications = createAsyncThunk(
  "getQualifications",
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

export const getSalary = createAsyncThunk(
  "getSalary",
  async (payload, { dispatch }) => {
    const endPoint = "/salaries?currency_id=" + payload;
    const { data } = await getApi(endPoint, true);
    return data;
  }
);

export const addBasicData = createAsyncThunk(
  "addBasicData",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/cv/basics", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const addWorkData = createAsyncThunk(
  "addWorkData",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/cv/worklife", payload, true);
    dispatch(setLoading(false));
    console.log(data);
    return data;
  }
);

export const addStudyData = createAsyncThunk(
  "addStudyData",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/cv/qualification/add", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const getSchool = createAsyncThunk(
  "getSchool",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/schools", true);
    return data;
  }
);

export const getTypeQualificationValue = createAsyncThunk(
  "getTypeQualificationValue",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/qualificationtypes", true);
    return data;
  }
);

export const getAssociation = createAsyncThunk(
  "getAssociation",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/association", true);
    return data;
  }
);

export const getInstitute = createAsyncThunk(
  "getInstitute",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/institutions", true);
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

export const myCvSlice = createSlice({
  name: "myCv",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getTitles.fulfilled, (state, action) => {
        state.titles = action.payload.data.map((title) => {
          title.id = title.job_title_id;
          title.name = title.title;
          return title;
        });
      })
      .addCase(getIndustries.fulfilled, (state, action) => {
        state.industries = action.payload.data.map((industry) => {
          industry.id = industry.industry_id;
          return industry;
        });
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.skills = action.payload.data.map((skill) => {
          skill.id = skill.tag_id;
          skill.name = skill.tag;
          return skill;
        });
      })
      .addCase(getWorkExperience.fulfilled, (state, action) => {
        state.experiences = action.payload.data.map((exp) => {
          exp.id = exp.experience_id;
          exp.name = exp.year;
          return exp;
        });
      })
      .addCase(getNoticePeriod.fulfilled, (state, action) => {
        state.noticePeriod = action.payload.data.map((period) => {
          period.id = period.notice_period_id;
          period.name = period.description;
          return period;
        });
      })
      .addCase(getQualifications.fulfilled, (state, action) => {
        state.qualifications = action.payload.data.map((qua) => {
          qua.id = qua.highest_qualification_id;
          qua.name = qua.description;
          return qua;
        });
      })
      .addCase(getCurrency.fulfilled, (state, action) => {
        state.currency = action.payload.data.map((curr) => {
          curr.id = curr.currency_id;
          curr.name = curr.currency;
          return curr;
        });
      })
      .addCase(getSalary.fulfilled, (state, action) => {
        state.salary = action.payload.data;
      })
      .addCase(getSchool.fulfilled, (state, action) => {
        state.school = action.payload.data.map((sch) => {
          sch.id = sch.school_id;
          return sch;
        });
      })
      .addCase(getInstitute.fulfilled, (state, action) => {
        state.institution = action.payload.data.map((inst) => {
          inst.id = inst.institution_id;
          return inst;
        });
      })
      .addCase(getTypeQualificationValue.fulfilled, (state, action) => {
        state.typeOfQualification = action.payload.data.map((inst) => {
          inst.id = inst.id;
          return inst;
        });
      })
      .addCase(getAssociation.fulfilled, (state, action) => {
        state.association = action.payload.data.map((inst) => {
          inst.id = inst.id;
          return inst;
        });
      })
      .addCase(getQualification.fulfilled, (state, action) => {
        state.qualification = action.payload.data.map((qua) => {
          qua.id = qua.qualification_id;
          return qua;
        });
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = myCvSlice.actions;

export default myCvSlice.reducer;
