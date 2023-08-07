import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import job_logo from "../../../../assets/job_logo.svg";
import job_volume from "../../../../assets/job_volume.svg";
import job_star from "../../../../assets/job_star.svg";
import job_star_selected from "../../../../assets/job_star_selected.svg";
import job_exp from "../../../../assets/job_exp.png";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  getAllQuestions,
  getAllQuestionsWithoutLogin,
} from "../../../../redux/guest/getQuestions";
import { ALERT_TYPE } from "../../../../utils/Constants";
import Tooltip from "@mui/material/Tooltip";
import SingleRadialChart from "../../../common/SingleRadialChart";
import SmallButton from "../../../common/SmallButton";
import CustomCard from "../../../common/CustomCard";
import PlaceIcon from "@mui/icons-material/Place";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { convertDatetimeAgo,dateConverterMonth } from "../../../../utils/DateTime";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAlert } from "../../../../redux/configSlice";
import { favouriteJob } from "../../../../redux/guest/talentSlice";
import jwt_decode from "jwt-decode";
import { formatCurrencyWithCommas } from "../../../../utils/Currency";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import profile_challenger from "../../../../assets/Profile Icons_Challenger.svg";
import profile_character from "../../../../assets/Profile Icons_Charater.svg";
import profile_collaborator from "../../../../assets/Profile Icons_Collaborator.svg";
import profile_contemplator from "../../../../assets/Profile Icons_Contemplator.svg";
import JobsDetailPage from "../JobsDetailPage";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";


const JobCardFront = ({
  index,
  job,
  setQuestions,
  onHandleClose,
  setopenApplyJobDialog,
  setisFlipped,
  setIsExpanded
}) => {
  const theme = useTheme();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isStar, setIsStarSelected] = useState(job?.favourite);
  const [arrSlider, setArrSlider] = useState([
    job?.industry_jobs[0],
    job?.type,
    job?.work_setup,
  ]);
  // console.log(job?.job_traits[0].trait?.name)
  const [jobTagsArr, setJobTags] = useState([...(job?.job_tags || [])]);
  const [arrSlider2, setArrSlider2] = useState([...(job?.job_traits || [])]);
  const [toolsArr, setToolsArr] = useState([...(job?.job_tools || [])]);
  const [isExpandedData, setIsExpandedData] = useState(false)

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  const handleStar = async () => {
    setIsStarSelected(!isStar);
    decodedToken?.data?.role_id === 3 &&
      (await dispatch(favouriteJob({ reqid: job?.job_id })));
  };
  const getquestions = async () => {
    const { payload } = await dispatch(getAllQuestions(job?.job_id));
    if (payload?.status === "success") {
      setQuestions(payload.data);
    } else {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: payload?.message,
        })
      );
    }
  };
  const getquestionswithoutlogin = async () => {
    const { payload } = await dispatch(
      getAllQuestionsWithoutLogin(job?.job_id)
    );
    if (payload?.status === "success") {
      setQuestions(payload.data);
    } else {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: payload?.message,
        })
      );
    }
  };
  const handleClick = () => {
    if (decodedToken?.data?.role_id !== 4) {
      console.log(decodedToken?.data?.role_id);
      setopenApplyJobDialog(true);
      if (decodedToken?.data?.role_id === undefined) {
        getquestionswithoutlogin();
      } else {
        getquestions();
      }
    } else {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: "Login as candidate to apply for this job",
        })
      );
    }
  };

  const handleRightClick = (setFunc, arrName) => {
    setFunc([...arrName.slice(1), ...arrName.slice(0, 1)]);
  };
  const handleLeftClick = (setFunc, arrName) => {
    setFunc([
      ...arrName.slice(arrName.length - 1),
      ...arrName.slice(0, arrName.length - 1),
    ]);
  };
  const handleJobTitle = () => {
    // navigate(
    //   `/jobs/job-detail/${`${
    //     job?.town?.name + " " + job?.town?.region?.name
    //   }`}/${job?.job_id}`
    // );
    setIsExpanded(index)
    setIsExpandedData(true)
  };

  return (
    <CustomCard
      handleMouseEnter={() => setIsHovered(true)}
      handleMouseLeave={() => setIsHovered(false)}
    >
      {isExpandedData ? (
        // Render expanded content here
        // You can create a new component or JSX directly
        <JobsDetailPage id={index} jobDetails={job} setIsExpanded={setIsExpanded} setIsExpandedData={setIsExpandedData} />

      ) : (
        <>
          {/* Header Section */}
          <Grid
            container
            // padding={1}
            justifyContent="space-between"
            alignItems="start"
            overflow={"hidden"}
            sx={{
              borderRadius: "25px 25px 0 0",
              //   gap: 3,
            }}
          >
            <Box
              component="img"
              sx={{
                height: 40,
                width: 40,
                maxHeight: { xs: 40 },
                maxWidth: { xs: 40 },
                ml: 2,
                mt: 1,
                p: 1,
              }}
              alt="job_logo"
              src={job?.profile_url !== "No URL" ? job?.profile_url : job_logo}
            />
            <Box
              sx={{
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  {job?.job_type === "crayon recruit" ? (
                    <SmallButton
                      color="yellowButton100"
                      label={job?.job_type?.slice(6)}
                      mr={1}
                    />
                  ) : job?.job_type === "crayon lite" ? (
                    <SmallButton
                      color="orangeButton"
                      label={job?.job_type?.slice(6)}
                      mr={1}
                    />
                  ) : null}
                  {job?.stage?.name && (
                    <SmallButton
                      color="lightGreenButton300"
                      mr={1}
                      label={job?.stage?.name}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      height: 43,
                      width: 50,
                      maxHeight: { xs: 43 },
                      maxWidth: { xs: 50 },
                      borderRadius: "0 0 0 10px",
                      background: theme.palette.purpleButton300.main,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      sx={{
                        height: 25,
                        width: 25,
                        maxHeight: { xs: 25 },
                        maxWidth: { xs: 25 },
                      }}
                      alt="job_volume"
                      src={job_volume}
                      onClick={handleClick}
                    />
                  </Box>
                  {/* 
              <Button
                color="grayButton"
                onClick={() =>
                  decodedToken?.data?.role_id === "undefined"
                    ? handleClick
                    : handleStar(job?.job_id)
                }
                sx={{
                  height: "auto",
                  minWidth: 50,
                  background: "#c9c9c9",
                  borderRadius: 0,
                  padding: 0,
                }}
              >
                <StarRoundedIcon color={isStar ? "error" : "disabled"} />
              </Button> */}
                  {isStar ? (
                    <Box
                      component="img"
                      sx={{
                        height: 43,
                        width: 50,
                        maxHeight: { xs: 43 },
                        maxWidth: { xs: 50 },
                      }}
                      alt="job_star_selected"
                      src={job_star_selected}
                      onClick={() =>
                        decodedToken?.data?.role_id === "undefined"
                          ? handleClick
                          : handleStar(job?.job_id)
                      }
                    />
                  ) : (
                    <Box
                      component="img"
                      sx={{
                        height: 43,
                        width: 50,
                        maxHeight: { xs: 43 },
                        maxWidth: { xs: 50 },
                        borderRadius: 0
                      }}
                      alt="job_star"
                      src={job_star}
                      onClick={() =>
                        decodedToken?.data?.role_id === "undefined"
                          ? handleClick
                          : handleStar(job?.job_id)
                      }
                    />
                  )}
                </Box>
              </Box>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: 12,
                  letterSpacing: "0.75px",
                  opacity: 0.8,
                  marginBottom: "8px",
                }}
              >
                posted {convertDatetimeAgo(job?.updated_at)}
              </Typography>
            </Box>
          </Grid>
          {/* Header Section */}

          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "280px",
            }}
          >
            {/* Name and Info Section */}
            <Grid
              marginLeft={1}
              marginRight={1}
              sx={{
                flexGrow: 1,
              }}
            >
              <Tooltip
                arrow
                // TransitionComponent={"Fade"}
                // TransitionProps={{ timeout: 600 }}
                title={job?.title}
                placement="top"
              >
                <Typography
                  sx={{
                    // minHeight: "60px",
                    fontWeight: 700,
                    fontSize: 20,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                  }}
                  gutterBottom
                  onClick={handleJobTitle}
                >
                  {job?.title}
                </Typography>
              </Tooltip>
              {/* <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  marginBottom: "4px",
                  letterSpacing: "0.25px",
                }}
              >
                {job?.salary?.currency?.symbol}
                {formatCurrencyWithCommas(job?.salary?.max)} per month
              </Typography>
              <Box sx={{ display: "flex", alignItems: "baseline" }}>
                <Box
                  component="img"
                  sx={{
                    height: 16,
                    width: 16,
                    maxHeight: { xs: 15 },
                    maxWidth: { xs: 15 },
                    mr: 1,
                  }}
                  alt="job_exp"
                  src={job_exp}
                />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.25px",
                  }}
                >
                  {job?.experience?.year} years Experience
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: "12px" }}
              >
                <IconButton
                  sx={{ padding: 0, marginLeft: "-5px", marginRight: "4px" }}
                  color="redButton100"
                  aria-label="search job"
                  component="button"
                >
                  <PlaceIcon />
                </IconButton>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.25px",
                  }}
                >
                  {job?.town?.name}, {job?.town?.region?.name}
                </Typography>
              </Box> */}
              <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "12px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", gap: 1 }}>
                <AccountBalanceWalletIcon fontSize="string"
                  color="primary" />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.25px",
                  }}
                >
                  {job?.salary?.currency?.symbol}
                  {formatCurrencyWithCommas(job?.salary?.max)} per month
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", gap: 1 }}>
                <PlaceIcon fontSize="string" color="error" />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.25px",
                  }}
                >
                  {job?.town?.name}, {job?.town?.region?.name}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", gap: 1 }}>
                <Box
                  component="img"
                  sx={{
                    height: 16,
                    width: 16,
                    maxHeight: { xs: 15 },
                    maxWidth: { xs: 15 },
                  }}
                  alt="job_exp"
                  src={job_exp}
                />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.25px",
                  }}
                >
                  {job?.experience?.year} years Experience
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", gap: 1 }}>
                <CalendarMonthIcon fontSize="string" color="warning" />

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.25px",
                  }}
                >
                  {dateConverterMonth(job?.created_at)}
                </Typography>
              </Box>
            </Box>


              {/* Tags section */}
              <Grid
                container
                spacing={2}
                padding="0 8px 8px 0px"
                // minHeight={45}
                // mt={3}
                sx={
                  toolsArr.length >= 4
                    ? { justifyContent: "space-between", alignItems: "center" }
                    : {}
                }
              >
                {jobTagsArr.length >= 4 ? (
                  <IconButton
                    sx={{
                      border: `1px solid ${theme.palette.grayBorder}`,
                      borderRadius: "8px",
                      width: "27px",
                      height: "27px",
                    }}
                    color="redButton100"
                    aria-label="search job"
                    component="button"
                    onClick={() => handleLeftClick(setJobTags, jobTagsArr)}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                ) : null}
                <Box
                  sx={
                    job?.job_tags.length >= 4
                      ? {
                        width: "75%",
                        display: "flex",
                        overflow: "hidden",
                      }
                      : {
                        width: "90%",
                        display: "flex",
                        overflow: "hidden",
                        alignItems: "center",
                      }
                  }
                >
                  {jobTagsArr
                    .filter((item) => item !== null)
                    .map((item, index) => {
                      if (item !== undefined) {
                        return (
                          <SmallButton
                            color="yellowButton200"
                            height={25}
                            value={item?.tag?.tag}
                            label={item?.tag?.tag.split(" ")[0]}
                            mr="4px"
                          />
                        );
                      }
                    })}
                </Box>
                {jobTagsArr.length >= 4 ? (
                  <IconButton
                    sx={{
                      border: `1px solid ${theme.palette.grayBorder}`,
                      borderRadius: "8px",
                      width: "27px",
                      height: "27px",
                    }}
                    color="redButton100"
                    aria-label="search job"
                    component="button"
                    onClick={() => handleRightClick(setJobTags, jobTagsArr)}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                ) : null}
              </Grid>
              {/* Tags section */}
              {/* Tools Section */}

              <Grid
                container
                spacing={2}
                padding="0 8px 8px 0px"
                minHeight={45}
                // mt={3}
                sx={
                  toolsArr.length >= 4
                    ? { justifyContent: "space-between", alignItems: "center" }
                    : {}
                }
              >
                {toolsArr.length >= 4 ? (
                  <IconButton
                    sx={{
                      border: `1px solid ${theme.palette.grayBorder}`,
                      borderRadius: "8px",
                      width: "27px",
                      height: "27px",
                    }}
                    color="redButton100"
                    aria-label="search job"
                    component="button"
                    onClick={() => handleLeftClick(setToolsArr, toolsArr)}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                ) : null}

                <Box
                  sx={
                    job?.job_tools.length >= 4
                      ? {
                        width: "75%",
                        display: "flex",
                        overflow: "hidden",
                      }
                      : {
                        width: "90%",
                        display: "flex",
                        overflow: "hidden",
                        alignItems: "center",
                      }
                  }
                >
                  {toolsArr
                    .filter((item) => item !== null)
                    .map((item, index) => {
                      if (item !== undefined) {
                        return (
                          <SmallButton
                            color="yellowButton100"
                            height={25}
                            value={item?.tool?.name}
                            label={item?.tool?.name.split(" ")[0]}
                            mr="4px"
                          />
                        );
                      }
                    })}
                </Box>
                {toolsArr.length >= 4 ? (
                  <IconButton
                    sx={{
                      border: `1px solid ${theme.palette.grayBorder}`,
                      borderRadius: "8px",
                      width: "27px",
                      height: "27px",
                    }}
                    color="redButton100"
                    aria-label="search job"
                    component="button"
                    onClick={() => handleRightClick(setToolsArr, toolsArr)}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                ) : null}
              </Grid>
              {/* Tools Section */}
              {/* Trait Section */}

              <Grid
                container
                spacing={2}
                padding="0 8px 8px 0px"
                minHeight={45}
                // mt={3}
                sx={
                  arrSlider2.length >= 4 && {
                    justifyContent: "space-between",
                    alignItems: "center",
                  }
                }
              >
                {arrSlider2.length >= 4 ? (
                  <IconButton
                    sx={{
                      border: `1px solid ${theme.palette.grayBorder}`,
                      borderRadius: "8px",
                      width: "27px",
                      height: "27px",
                    }}
                    color="redButton100"
                    aria-label="search job"
                    component="button"
                    onClick={() => handleLeftClick(setArrSlider2, arrSlider2)}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                ) : null}
                <Box
                  sx={
                    job?.job_traits.length >= 4
                      ? {
                        width: "65%",
                        display: "flex",
                      }
                      : {
                        width: "100%",
                        display: "flex",
                        overflow: "hidden",
                      }
                  }
                >
                  {arrSlider2
                    .filter((item) => item !== null)
                    .map((item, index) => {
                      if (item !== undefined) {
                        return (
                          <SmallButton
                            color={"grayButton200"}
                            height={25}
                            label={item?.trait?.name}
                            mr="4px"
                          />
                        );
                      }
                    })}
                </Box>
                {arrSlider2.length >= 4 ? (
                  <IconButton
                    sx={{
                      border: `1px solid ${theme.palette.grayBorder}`,
                      borderRadius: "8px",
                      width: "27px",
                      height: "27px",
                    }}
                    color="redButton100"
                    aria-label="search job"
                    component="button"
                    onClick={() => handleRightClick(setArrSlider2, arrSlider2)}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                ) : null}
              </Grid>
              {/* Trait Section */}
            </Grid>
            {/* Name and Info Section */}
            {/* flip Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "end",
              }}
            >
              <Button
                variant="contained"
                color="redButton"
                sx={{
                  width: "100%",
                  height: 150,
                  padding: 0,
                  minWidth: "15px",
                  marginBottom: 2,
                  fontSize: "20px",
                  borderRadius: "10px 0 0 10px",
                }}
                onClick={() => setisFlipped(false)}
              >
                <KeyboardArrowLeftOutlinedIcon
                  sx={{
                    margin: 0,
                    padding: 0,
                  }}
                  fontSize="string"
                />
              </Button>
            </Box>
            {/* flip Button */}
          </Box>
          {/* Radial Chart Section */}
          <Grid
            container
            spacing={2}
            padding="0 16px 8px 16px"
            justifyContent="space-around"
            alignItems="center"
          >
            <Box sx={{ margin: "0 -22px 0 -22px" }}>
              <SingleRadialChart
                max={1000}
                labelsData={"grit score"}
                series={[job?.grit_score]}
                width={140}
                color={theme.palette.chart.red}
                index={index}
                isHovered={isHovered}
              />
            </Box>
            {/* <Box sx={{ margin: "0 -22px 0 -22px" }}> */}
            {job?.primary?.name && (
              <Box
                component="img"
                height={90}
                // sx={{ margin: "0 -22px 0 -22px" }}
                alt="job_exp"
                src={
                  (job?.primary?.name == "collaborator" && profile_collaborator) ||
                  (job?.primary?.name == "challenger" && profile_challenger) ||
                  (job?.primary?.name == "character" && profile_character) ||
                  (job?.primary?.name == "contemplator" && profile_contemplator)
                }
              />
            )}
            {/* </Box> */}
            {job?.primary?.name && (
              <Box
                component="img"
                height={90}
                // sx={{ margin: "0 -22px 0 -22px" }}
                alt="job_exp"
                src={
                  (job?.shadow?.name == "collaborator" && profile_collaborator) ||
                  (job?.shadow?.name == "challenger" && profile_challenger) ||
                  (job?.shadow?.name == "character" && profile_character) ||
                  (job?.shadow?.name == "contemplator" && profile_contemplator)
                }
              />
            )}
          </Grid>
          {/* Radial Chart Section */}
          {/* Footer Section */}
          <Grid
            container
            // padding="0 8px 8px 8px"
            alignItems="center"
            overflow={"hidden"}
            sx={{
              background: "green",
              width: "100%",
              borderRadius: "0 0 25px 25px",
              height: 50,
            }}
          >
            {/* <Box
                    sx={{
                        height: 43,
                        width: 43,
                        maxHeight: { xs: 43 },
                        maxWidth: { xs: 43 },
                        borderRadius: "6px",
                        background: theme.palette.chart.yellow,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        component="img"
                        sx={{
                            height: 25,
                            width: 25,
                            maxHeight: { xs: 25 },
                            maxWidth: { xs: 25 },
                        }}
                        alt="job_apply"
                        src={job_apply}
                    />
                </Box>
                <Grid sx={{ width: "33.33%", padding: 0, ml: 1 }}>
                    <Button
                        sx={{
                            boxShadow: 0,
                            fontSize: "12px",
                            width: "100%",
                            height: "43px",
                        }}
                        variant="contained"
                        color="redButton100"
                        onClick={handleClick}
                    >
                        {i18n["jobCard.apply"]}
                    </Button>
                </Grid> */}
            <Button
              variant="contained"
              sx={{
                borderRadius: 0,
                width: "33.33%",
                height: "100%",
                fontSize: "12px",
              }}
              color="blueButton200"
            >
              Match me
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: 0,
                width: "33.33%",
                height: "100%",
                fontSize: "12px",
              }}
              color="grayButton200"
            >
              View More
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: 0,
                width: "33.33%",
                height: "100%",
                fontSize: "12px",
              }}
              color="redButton"
              onClick={handleClick}
            >
              apply
            </Button>
          </Grid>
          {/* Footer Section */}
        </>)}
    </CustomCard>

  );
};

export default JobCardFront;
