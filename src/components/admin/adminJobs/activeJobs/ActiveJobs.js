import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import locale from "../../../../i18n/locale";
import { useDispatch } from "react-redux";
import {
  getAllComments,
  getAllJobs,
  getJobCount,
} from "../../../../redux/admin/jobsSlice";
import JobCard from "../JobCard";
import { setAlert } from "../../../../redux/configSlice";
import { ALERT_TYPE } from "../../../../utils/Constants";
import { Grid } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ActiveJobs() {
  const i18n = locale.en;
  const [allJobs, setAllJobs] = useState([]);
  const dispatch = useDispatch();
  const [lastKey, setLastKey] = useState("");
  const [totalJob, setTotalJob] = useState(0);
  const [comments, setComments] = useState([]);

  const getJobList = async (lastkeyy) => {
    console.log("LAST KEY", lastkeyy);
    const { payload } = await dispatch(getAllJobs(lastkeyy + "&status_id=2"));
    if (payload?.status == "success") {
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
  };

  const JobCount = async () => {
    const response = await dispatch(getJobCount(2));
    setTotalJob(response.payload.count);
  };

  const getComments = async (jobid) => {
    try {
      const { payload } = await dispatch(getAllComments(jobid));
      if (payload?.status == "success") {
        setComments(payload?.data);
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: payload?.message,
          })
        );
      }
    } catch (error) {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: error,
        })
      );
    }
  };

  

  useEffect(() => {
    getJobList(lastKey);
    JobCount();
  }, []);

  return (
    <Box sx={{ ml: 6 }}>
      <Typography
        sx={{
          fontSize: "36px",
          fontWeight: 700,
          // ml: 6
        }}
      >
        {i18n["activeJobs.title"]} ({totalJob})
      </Typography>
      {/* <Box sx={{
                mt: 1,
            }}>
                <StyledSelect
                    sx={{ mr: 1 }}
                    value={10}
                    // onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'stack' }}
                    size="small">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Quick search</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </StyledSelect>
                <StyledSelect
                    sx={{ ml: 1 }}
                    value={10}
                    // onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'filter' }}
                    size="small">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Select manager</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </StyledSelect>
            </Box>
            <Box sx={{
                mt: 1,
            }}>
                <StyledSelect
                    sx={{ mr: 1 }}
                    value={10}
                    // onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'stack' }}
                    size="small">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Select stage</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </StyledSelect>
                <StyledSelect
                    sx={{ ml: 1 }}
                    value={10}
                    // onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'filter' }}
                    size="small">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Select type</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </StyledSelect>
            </Box>
            <Button variant="contained" color="redButton" sx={{ width: '30%', mt: 2 }}>{i18n['activeJobs.update']}</Button> */}
      <Grid
        container
        spacing={2}
        flexDirection={"column"}
        sx={{
          display: { xs: "none", md: "flex" },
          marginTop: "30px",
        }}
      >
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={allJobs.length}
          next={() => getJobList(lastKey)}
          hasMore={true}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <Box
            sx={{
              mt: 2,
            }}
          >
            {allJobs?.map((job, index) => (
              <JobCard
                key={index}
                index={job.job_id}
                jobContent={job}
                comments={comments}
                setComments={setComments}
                getComments={getComments}
              />
            ))}
          </Box>
        </InfiniteScroll>
      </Grid>
    </Box>
  );
}
