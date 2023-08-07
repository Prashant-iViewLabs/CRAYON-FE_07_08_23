import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@mui/material/styles";
import JobCard from "./JobCardNew";
import SearchBar from "../../common/SearchBar";
import ButtonPanel from "../../common/ButtonPanel";
import {
  JOBS_RIGHT_STAGES_BUTTON_GROUP,
  ALERT_TYPE,
} from "../../../utils/Constants";
import locale from "../../../i18n/locale";
import { getAllJobs, getFilteredJobs } from "../../../redux/guest/jobsSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAllIndustries } from "../../../redux/configSlice";
import { setAlert } from "../../../redux/configSlice";
import { getAllJobRoleType } from "../../../redux/jobRole";
import { getAllStages } from "../../../redux/stages";
import { getAllTypes } from "../../../redux/allTypes";
import jwt_decode from "jwt-decode";
import CustomDialog from "../../common/CustomDialog";
import ApplyJobs from "./ApplyJobs";

const JobListing = () => {
  const i18n = locale.en;
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const allIndustries = useSelector((state) => state.config.industries);
  const allJobTypes = useSelector((state) => state.jobtype.jobRoleType);
  const allStages = useSelector((state) => state.configstages.stages);
  const allTypes = useSelector((state) => state.configAllTypes?.types);
  const [allJobs, setAllJobs] = useState([]);
  const [filters, setFilters] = useState([allIndustries[0]?.id]);
  const [filtersJobType, setFiltersJobType] = useState([allJobTypes[0]?.id]);
  const [filtersJobStage, setFiltersJobStage] = useState([allStages[0]?.id]);
  const [filtersType, setFiltersType] = useState([allTypes[0]?.id]);
  const [favourite, setFavourite] = useState(false);
  const [lastKey, setLastKey] = useState("");
  const [searchedJobs, setSearchedJobs] = useState("");
  const [questions, setQuestions] = useState([]);
  const [openApplyJobDialog, setopenApplyJobDialog] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  const onHandleClose = () => {
    setopenApplyJobDialog(false);
  };

  const handleFilterSelection = (paramType, filterName) => {
    // Toggle filter selection
    // if (paramType === "filter") {
    const updatedFilters = selectedFilters.includes(filterName)
      ? selectedFilters.filter((filter) => filter !== filterName)
      : [filterName];
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set(paramType, updatedFilters.join(","));
    navigate(`${window.location.pathname}?${queryParams.toString()}`);
    setSelectedFilters(updatedFilters);
  };

  const getTypes = async () => {
    await dispatch(getAllTypes());
  };
  const getIndustries = async () => {
    await dispatch(getAllIndustries());
  };
  const getJobTypes = async () => {
    await dispatch(getAllJobRoleType());
  };
  const getStages = async () => {
    await dispatch(getAllStages());
  };
  const getJobList = async (
    selectedFilters = filters,
    jobtype = filtersJobType,
    jobstage = filtersJobStage,
    personalityType = filtersType,
    lastkeyy,
    title = searchedJobs,
    filteralltype
  ) => {
    if (selectedFilters.length === 0) {
      setAllJobs([]);
    } else if (
      selectedFilters.length === 1 &&
      selectedFilters[0] === 1111 &&
      jobtype.length === 1 &&
      jobtype[0] === 1111 &&
      jobstage.length === 1 &&
      jobstage[0] === 1111 &&
      personalityType.length === 1 &&
      personalityType[0] === 1111 &&
      title === ""
    ) {
      const data = {
        lastKey: lastkeyy,
        user_id: token ? decodedToken?.data?.user_id : "",
      };
      const { payload } = await dispatch(getAllJobs(data));
      if (payload?.status === "success") {
        setLastKey(payload.data[payload.data.length - 1]?.job_id);
        setAllJobs((prevState) => [...prevState, ...payload.data]);
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: "Something went wrong! please relaod the window",
          })
        );
      }
    } else {
      const data = {
        selectedFilters: selectedFilters.toString(),
        lastKey: lastkeyy?.toString(),
        jobtype: jobtype.toString(),
        jobstage: jobstage.toString(),
        personalityType: personalityType.toString(),
        title: title,
        user_id: token ? decodedToken?.data?.user_id : "",
        favourites: filteralltype.favourite || "",
        recentjob: filteralltype.recent || "",
        appliedjob: filteralltype.appliedJobs || "",
      };
      const { payload } = await dispatch(getFilteredJobs(data));
      if (payload?.status === "success") {
        setLastKey(payload.data[payload.data.length - 1]?.job_id);
        setAllJobs((prevState) => [...prevState, ...payload.data]);
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: payload?.message,
          })
        );
      }
    }
  };
  useEffect(() => {
    getIndustries();
    getJobTypes();
    getStages();
    getTypes();
    getJobList(
      [allIndustries[0]?.id],
      [allJobTypes[0]?.id],
      [allStages[0]?.id],
      [allTypes[0]?.id],
      "",
      searchedJobs,
      ""
    );
  }, []);
  // useEffect(() => {
  //   setAllJobs([]);
  //   setFilters([allIndustries[0]?.id]);
  //   setFiltersJobType([allJobTypes[0]?.id]);
  //   setFiltersJobStage([allStages[0]?.id]);
  //   setFiltersType([allTypes[0]?.id]);
  //   setSearchedJobs("");
  // }, []);
  const onChangeFilter = (selectedFilter) => {
    let industry = [];
    selectedFilter.map((type) => {
      let selectedJobType = allIndustries.find(
        (jobtype) => jobtype.id === type
      );
      industry.push(selectedJobType.name);
    });
    handleFilterSelection("filter", industry);
    setAllJobs([]);
    setLastKey("");
    setFilters(selectedFilter);
    getJobList(
      selectedFilter,
      filtersJobType,
      filtersJobStage,
      filtersType,
      "",
      searchedJobs,
      favourite
    );
  };
  const onChangeFilterJobType = (selectedFilter) => {
    let jobs = [];
    selectedFilter.map((type) => {
      let selectedJobType = allJobTypes.find((jobtype) => jobtype.id === type);
      jobs.push(selectedJobType.name);
    });
    setAllJobs([]);
    setLastKey("");
    setFiltersJobType(jobs);
    handleFilterSelection("jobType", jobs);
    getJobList(
      filters,
      jobs,
      filtersJobStage,
      filtersType,
      "",
      searchedJobs,
      favourite
    );
  };
  const onChangeFilterJobStage = (selectedFilter) => {
    let stage = [];
    selectedFilter.map((type) => {
      let selectedJobType = allStages.find(
        (stagetype) => stagetype.id === type
      );
      stage.push(selectedJobType.name);
    });
    handleFilterSelection("stage", stage);
    setAllJobs([]);
    setLastKey("");
    setFiltersJobStage(selectedFilter);
    getJobList(
      filters,
      filtersJobType,
      selectedFilter,
      filtersType,
      "",
      searchedJobs,
      favourite
    );
  };
  const onChangeFilterType = (selectedFilter) => {
    let selectedtypes = [];
    selectedFilter.map((types) => {
      let selectedJobType = allTypes.find((type) => type.id === types);
      selectedtypes.push(selectedJobType.name);
    });
    handleFilterSelection("Type", selectedtypes);
    setAllJobs([]);
    setLastKey("");
    setFiltersType(selectedFilter);
    getJobList(
      filters,
      filtersJobType,
      filtersJobStage,
      selectedFilter,
      "",
      searchedJobs,
      favourite
    );
  };

  const onChangefavourite = (selectedFilter) => {
    let posts = [];
    selectedFilter.map((types) => {
      let selectedJobType = JOBS_RIGHT_STAGES_BUTTON_GROUP.find(
        (type) => type.id === types
      );
      posts.push(selectedJobType.name);
    });
    handleFilterSelection("Posts", posts);
    setAllJobs([]);
    setLastKey("");
    const allTypeFilter = {
      recent: selectedFilter.includes(2) ? true : "",
      favourite: selectedFilter.includes(3) ? true : "",
      appliedJobs: selectedFilter.includes(4) ? true : "",
    };
    getJobList(
      filters,
      filtersJobType,
      filtersJobStage,
      filtersType,
      "",
      searchedJobs,
      allTypeFilter
    );
  };

  const getParams = () => {
    let params = new URLSearchParams(window.location.search);
    for (const [key, value] of params.entries()) {
      // console.log(`${key}: ${value}`);
      if (key === "filter") {
        let filters = value.split(",")?.map((value) => {
          let selectedJobType = allIndustries.find(
            (jobtype) => jobtype.name === value
          );
          return selectedJobType?.id;
        });
        console.log(filters);
      }
      if (key === "jobType") {
        let filters = value.split(",")?.map((value) => {
          let selectedJobType = allJobTypes.find(
            (jobtype) => jobtype.name === value
          );
          return selectedJobType?.id;
        });
        console.log(filters);
      }
      if (key === "stage") {
        let filters = value.split(",")?.map((value) => {
          let selectedJobType = allStages.find(
            (jobtype) => jobtype.name === value
          );
          return selectedJobType?.id;
        });
        console.log(filters);
      }
      if (key === "Posts") {
        let filters = value.split(",")?.map((value) => {
          let selectedJobType = JOBS_RIGHT_STAGES_BUTTON_GROUP.find(
            (jobtype) => jobtype.name === value
          );
          return selectedJobType?.id;
        });
        console.log(filters);
      }
      if (key === "Type") {
        let filters = value.split(",")?.map((value) => {
          let selectedJobType = allTypes.find(
            (jobtype) => jobtype.name === value
          );
          return selectedJobType?.id;
        });
        console.log(filters);
      }
    }
  };

  return (
    <Grid xs={12} sm={6} md={8} lg={9} xl={10}>
      <SearchBar
        placeholder={i18n["jobs.searchPlaceholder"]}
        setAllJobs={setAllJobs}
        setSearchedJobs={setSearchedJobs}
      />
      <InfiniteScroll
        key={`${filters} + ${filtersJobType} + ${filtersJobStage} + ${filtersType}+${searchedJobs} +${favourite}`}
        style={{ overflow: "hidden" }}
        dataLength={allJobs.length} //This is important field to render the next data
        next={() =>
          getJobList(
            filters,
            filtersJobType,
            filtersJobStage,
            filtersType,
            lastKey,
            searchedJobs,
            favourite
          )
        }
        hasMore={true} //{allJobs.length <= allJobs[0]?.TotalJobs}
        // loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Grid
          container
          spacing={2}
          flexDirection={{ sx: "column", md: "row" }}
          sx={{
            my: 2,
            display: { xs: "none", md: "flex" },
            marginTop: "60px",
          }}
        >
          {allJobs.length > 0
            ? allJobs?.map((job) => (
                <Grid xl={3} lg={4} md={6} xs={12} key={job.job_id}>
                  <JobCard
                    index={job.job_id}
                    job={job}
                    setQuestions={setQuestions}
                    onHandleClose={onHandleClose}
                    setopenApplyJobDialog={setopenApplyJobDialog}
                  />
                </Grid>
              ))
            : (allJobs.length = 0 ? (
                <Box
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    mt: 4,
                    color: theme.palette.placeholder,
                  }}
                >
                  {i18n["jobs.noData"]}
                </Box>
              ) : null)}
        </Grid>
      </InfiniteScroll>
      <Grid container spacing={2} sx={{ my: 2, display: { md: "none" } }}>
        {/* <SwipeableViews enableMouseEvents onTouchStart={isolateTouch}>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <JobCard index="11" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <JobCard index="12" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <JobCard index="13" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <JobCard index="14" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <JobCard index="15" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <JobCard index="16" />
            </Grid>
          </SwipeableViews> */}
      </Grid>
      <CustomDialog
        show={openApplyJobDialog}
        hideButton={false}
        onDialogClose={onHandleClose}
        dialogWidth="sm"
        showFooter={false}
        // title={isLoggedIn ? i18n["login.login"] : i18n["login.signUp"]}
        isApplyJob
      >
        <ApplyJobs
          questions={questions}
          setopenApplyJobDialog={setopenApplyJobDialog}
        />
      </CustomDialog>
    </Grid>
  );
};

export default JobListing;
