import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ALERT_TYPE, ERROR_MSG } from "../../utils/Constants";
import { getApi, postApi } from "../../utils/Apis";
import { useState } from "react";
// import { setLoading } from "./employerJobsConfigSlice";
import { setLoading } from "../configSlice";
const initialState = {
  myTeamsList: [],
};

export const getAllTeamMembers = createAsyncThunk(
  "getAllTeamMembers",
  async ({ job_id }, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi(
      "/employer/myteam?job_id=" + job_id + "&roleTypeId=&inviteStatusId=",
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const getTeamInfo = createAsyncThunk(
  "getTeamInfo",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await getApi(
      `/employer/teammemberjob?userid=${payload}`,
      true
    );
    dispatch(setLoading(false));
    return data;
  }
);

export const assignJobs = createAsyncThunk(
  "assignJobs",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/employer/assignedjob", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const editUserPassword = createAsyncThunk(
  "editUserPassword",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/employer/edituser", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const changeStatus = createAsyncThunk(
  "changeStatus",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/employer/changepermission", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const removeMember = createAsyncThunk(
  "removeMember",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/employer/deleteusers", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const removeMembersJobs = createAsyncThunk(
  "removeMembersJobs",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/employer/deletejobs", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const addNewMember = createAsyncThunk(
  "addNewMember",
  async (payload, { dispatch }) => {
    dispatch(setLoading(true));
    const { data } = await postApi("/employer/addnewuser", payload, true);
    dispatch(setLoading(false));
    return data;
  }
);

export const getPermissions = createAsyncThunk(
  "getPermissions",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/employer/roles", true);
    console.log(data);
    return data;
  }
);

export const getCompanies = createAsyncThunk(
  "getCompanies",
  async (payload, { dispatch }) => {
    const { data } = await getApi("/admin/employer/allCompanies", true);
    return data;
  }
);

export const myTeamsListing = createSlice({
  name: "configMyTeams",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCompanies.fulfilled, (state, action) => {
        console.log(action.payload.data);
        state.companies = action.payload.data.map((company) => {
          return {
            ...company,
            id: company.company_id,
            name: company.name,
          };
        });
      })
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.permission = action.payload.data.map((curr) => {
          return {
            ...curr,
            id: curr.role_type_id,
            name: curr.name,
          };
        });
      });
  },
});
// Action creators are generated for each case reducer function
export const {} = myTeamsListing.actions;
export default myTeamsListing.reducer;
