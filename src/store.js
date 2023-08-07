import { configureStore } from "@reduxjs/toolkit";
import configReducer from "./redux/configSlice";
import loginReducer from "./redux/login/loginSlice";
import myCVReducer from "./redux/candidate/myCvSlice";
import handleSignReducer from "./redux/signUp/reducer";
import allGuestJobs from "./redux/guest/jobsSlice";
import talentTypes from "./redux/guest/talentTypes";
import jobTypeReducer from "./redux/jobRole";
import allStages from "./redux/stages";
import jobStatus from "./redux/status";
import myStatus from "./redux/candidate/myStatusFilter";
import allTypes from "./redux/allTypes";
import allEmployerJobs from "./redux/employer/employerJobsConfigSlice";
import allTeamMember from "./redux/employer/myTeams";
import allEmployerJoblisting from "./redux/employer/empJobListing";
import allQuesitons from "./redux/guest/getQuestions";
import candidateJobs from "./redux/candidate/candidateJobs";
import myCVNew from "./redux/candidate/myCVNew";
import empProfileSlice from "./redux/employer/empProfileSlice";
import postJobSlice from "./redux/employer/postJobSlice";

export const store = configureStore({
  reducer: {
    config: configReducer,
    login: loginReducer,
    myCv: myCVReducer,
    sign: handleSignReducer,
    jobtype: jobTypeReducer,
    talenttype: talentTypes,
    configstages: allStages,
    configjobstatus: jobStatus,
    configAllTypes: allTypes,
    configemployerjobs: allEmployerJobs,
    employerjoblisting: allEmployerJoblisting,
    configjobslice: allGuestJobs,
    configquestion: allQuesitons,
    configcandidatejobs: candidateJobs,
    configmycvnew: myCVNew,
    configMyStatus: myStatus,
    myProfile: empProfileSlice,
    postJobs: postJobSlice,
    configMyTeams: allTeamMember,
  },
});
