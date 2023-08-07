import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TalentCard from "../../guest/talent/TalentCard";
import MyJobsCard from "./MyJobsCard";
import { useTheme } from "@mui/material/styles";
import SearchBar from "../../common/SearchBar";
import SwipeableViews from "react-swipeable-views";
import ButtonPanel from "../../common/ButtonPanel";
import {
  ALERT_TYPE,
  EMPLOYER_MY_JOBS_LEFT,
  EMPLOYER_MY_JOBS_RIGHT,
  JOBS_LEFT_INDUSTRIES_BUTTON_GROUP,
  JOBS_LEFT_TYPES_BUTTON_GROUP,
  JOBS_RIGHT_JOB_TYPES_BUTTON_GROUP,
  JOBS_RIGHT_POSTS_BUTTON_GROUP,
  JOBS_RIGHT_STAGES_BUTTON_GROUP,
} from "../../../utils/Constants";
import locale from "../../../i18n/locale";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllIndustries, setAlert } from "../../../redux/configSlice";
import {
  getCandidateFilteredJob,
  getCandidateJobs,
} from "../../../redux/candidate/candidateJobs";
import { getJobStatus } from "../../../redux/status";
import { useSelector } from "react-redux";
import { getMyStatusFilter } from "../../../redux/candidate/myStatusFilter";
export default function Talent() {
  const i18n = locale.en;
  const theme = useTheme();
  const dispatch = useDispatch();
  const jobStatus = useSelector((state) => state.configjobstatus.status);
  const myStatus = useSelector((state) => state.configMyStatus.mystatusfilter);
  const [candidateJobs, setCandidateJobs] = useState([]);
  const [myStatusFilter, setMyStatusFilter] = useState([myStatus[0]?.id]);
  const [jobStatusFilter, setJobStatusFilter] = useState([jobStatus[0]?.id]);

  const getStatus = async () => {
    await dispatch(getJobStatus());
  };

  const getmyStatus = async () => {
    await dispatch(getMyStatusFilter());
  };

  const getJobs = async (
    filterMyStatus = myStatusFilter,
    filterJobStatus = jobStatusFilter
  ) => {
    if (
      filterMyStatus.length == 1 &&
      filterMyStatus[0] == 1111 &&
      filterJobStatus == 1 &&
      filterJobStatus == 1111
    ) {
      const { payload } = await dispatch(getCandidateJobs());
      if (payload?.status == "success") {
        setCandidateJobs((prevState) => [...prevState, ...payload.data]);
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: payload?.message,
          })
        );
      }
    } else {
      const data = {
        filterMyStatus: filterMyStatus.toString(),
        filterJobStatus: filterJobStatus.toString(),
      };
      const { payload } = await dispatch(getCandidateFilteredJob(data));

      if (payload?.status == "success") {
        // setCandidateJobs((prevState) => [...prevState, ...payload.data]);
        setCandidateJobs(payload.data);
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
    getJobs();
    getStatus();
    getmyStatus();
  }, []);

  const leftStatusFilter = (selectedFilter) => {
    setCandidateJobs([]);
    setMyStatusFilter(selectedFilter);
    console.log("LEFT STATUS FILTER", selectedFilter);
    getJobs(selectedFilter, jobStatusFilter);
  };

  const rightStatusFilter = (selectedFilter) => {
    setCandidateJobs([]);
    setJobStatusFilter(selectedFilter);
    getJobs(myStatusFilter, selectedFilter);
  };

  return (
    <Grid
      container
      spacing={0}
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
    >
      <ButtonPanel
        panelData={myStatus}
        side="left"
        onChangeFilter={leftStatusFilter}
      />
      <Grid xs={12} sm={6} md={8} lg={9} xl={10}>
        <SearchBar placeholder={i18n["jobs.searchPlaceholder"]} />
        <InfiniteScroll
          key={`${jobStatusFilter}, ${myStatusFilter}`}
          style={{ overflow: "hidden" }}
          dataLength={candidateJobs.length}
          //   next={getJobs}
          hasMore={true}
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
            {candidateJobs.length > 0 ? (
              candidateJobs?.map((talent) => (
                <Grid xl={3} lg={4} md={6} xs={12} key={talent}>
                  <MyJobsCard index={talent} job={talent} getJobs={getJobs}/>
                </Grid>
              ))
            ) : (
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
            )}
          </Grid>
        </InfiniteScroll>
        {/*
      <Grid container spacing={2} sx={{ my: 2, display: { md: "none" } }}>
          <SwipeableViews enableMouseEvents onTouchStart={isolateTouch}>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <MyJobsCard index="11" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <MyJobsCard index="12" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <MyJobsCard index="13" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <MyJobsCard index="14" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <MyJobsCard index="15" />
            </Grid>
            <Grid xl={3} lg={4} md={6} xs={12} sx={{ px: 3 }}>
              <MyJobsCard index="16" />
            </Grid>
          </SwipeableViews>
        </Grid>
      */}
      </Grid>
      <ButtonPanel
        panelData={jobStatus}
        side="right"
        onChangeFilter={rightStatusFilter}
      />
    </Grid>
  );
}
