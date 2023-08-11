import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import job_logo from "../../../assets/job_logo.svg";
import job_volume from "../../../assets/job_volume.svg";
import education_type from "../../../assets/Padding Included/Crayon Icon_Education Type.svg";
import own_equipment from "../../../assets/Padding Included/Crayon Icon_Own Equipment.svg";
import own_vehicle from "../../../assets/Padding Included/Crayon Icon_Own Vehicle.svg";
import dollar_sign from "../../../assets/dollar-sign.svg";
import start_date from "../../../assets/Padding Included/Crayon Icon_Start Date.svg";
import own_internet from "../../../assets/Padding Included/Crayon Icon_Own Internet.svg";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import job_exp from "../../../assets/job_exp.png";
import profile_challenger from "../../../assets/Profile Icons_Challenger.svg";
import profile_character from "../../../assets/Profile Icons_Charater.svg";
import profile_collaborator from "../../../assets/Profile Icons_Collaborator.svg";
import profile_contemplator from "../../../assets/Profile Icons_Contemplator.svg";
import SmallButton from "../../common/SmallButton";
import { useTheme } from "@emotion/react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PlaceIcon from "@mui/icons-material/Place";
import SingleRadialChart from "../../common/SingleRadialChart";
import locale from "../../../i18n/locale";
import Button from "@mui/material/Button";
import VerticalStepper from "./VerticalStepper";
import { useDispatch } from "react-redux";
import {
  getAllQuestions,
  getAllQuestionsWithoutLogin,
} from "../../../redux/guest/getQuestions";
import { setAlert } from "../../../redux/configSlice";
import {
  ALERT_TYPE,
  AUTHORIZED_TAB_ITEMS_CANDIDATE,
  AUTHORIZED_TAB_ITEMS_EMPLOYER,
  ERROR_MSG,
} from "../../../utils/Constants";
import CustomDialog from "../../common/CustomDialog";
import ApplyJobs from "./ApplyJobs";
import Login from "../../login/login";
import { login } from "../../../redux/login/loginSlice";
import { getLocalStorage, setLocalStorage } from "../../../utils/Common";
import { getJobDetail } from "../../../redux/guest/jobsSlice";
import DOMPurify from "dompurify";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  convertDatetimeAgo,
  dateConverterMonth,
} from "../../../utils/DateTime";
import { formatCurrencyWithCommas } from "../../../utils/Currency";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const label1 = "applied";
const label2 = "shortlisted";
const label3 = "interviewed";
const label4 = "grit score";
const label5 = "month contract";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export default function JobsDetailPage() {
  const theme = useTheme();
  const i18n = locale.en;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isStar, setIsStarSelected] = useState(false);
  const [job, setJob] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [openApplyJobDialog, setopenApplyJobDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(getLocalStorage("isLoggedIn"))
  );

  const { id } = useParams();

  const getquestions = async () => {
    const { payload } = await dispatch(getAllQuestions(job?.job_id));
    if (payload?.status == "success") {
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

  // const handleClick = () => {
  //   setOpenLoginDialog(true);
  //   getquestions();
  // };

  const handleClick = () => {
    setopenApplyJobDialog(true);
    getquestionswithoutlogin();
  };
  const onHandleClose = () => {
    setOpenLoginDialog(false);
  };

  const onHandleLogin = async (loginData) => {
    try {
      const { payload } = await dispatch(login(loginData));
      if (payload?.status == "success" && payload?.token) {
        const user = payload.data.role_id;
        setLocalStorage("token", payload?.token);
        onHandleClose();
        const jwt = localStorage?.getItem("token");
        const parts = jwt?.split(".");
        if (parts?.length != 3) {
          throw new Error("Invalid JWT");
        }
        const encodedPayload = parts[1];
        const decodedPayload = atob(encodedPayload);
        const payloadData = JSON.parse(decodedPayload);
        const profileCompletion = payloadData.data?.profile_percent_complete;
        let tabs;
        if (user === 4) {
          if (profileCompletion === 100) {
            tabs = AUTHORIZED_TAB_ITEMS_EMPLOYER;
            navigate("/employer/my-jobs", { replace: true });
          } else {
            tabs = AUTHORIZED_TAB_ITEMS_EMPLOYER;
            navigate("/employer/my-profile", { replace: true });
          }
        } else {
          if (profileCompletion === 0) {
            tabs = AUTHORIZED_TAB_ITEMS_CANDIDATE;
            navigate("/candidate/my-jobs", { replace: true });
          } else {
            tabs = AUTHORIZED_TAB_ITEMS_CANDIDATE;
            navigate("/candidate/my-profile", { replace: true });
          }
        }
        setLocalStorage("isLoggedIn", true);
        setLocalStorage("userType", user);
        setIsLoggedIn(true);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Successfully Login!",
          })
        );
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
      dispatch(setAlert({ show: true }));
    }
  };

  const handleCardClick = async () => {
    try {
      const { payload } = await dispatch(getJobDetail({ job_id: id }));
      if (payload?.status == "success") {
        setJob(payload?.data);
      }
    } catch (error) {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: ERROR_MSG,
        })
      );
    }
  };

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

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

  const onApplyHandleClose = () => {
    setopenApplyJobDialog(false);
  };

  useEffect(() => {
    handleCardClick();
  }, []);

  return (
    <Grid
      container
      sx={{
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        width: "80%",
        margin: "auto",
        padding: " 0 50px 10px 15px",
        justifyContent: "space-between",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Section Starts */}
      <Grid
        container
        paddingBottom={1}
        justifyContent="space-between"
        alignItems="start"
      >
        <Box
          component="img"
          sx={{
            height: 40,
            width: 40,
            maxHeight: { xs: 40 },
            maxWidth: { xs: 40 },
            paddingTop: "20px",
            borderRadius: "10px",
          }}
          alt="job_logo"
          src={job?.profile_url != "No URL" ? job?.profile_url : job_logo}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {job?.job_type === "crayon recruit" ? (
            <SmallButton
              color="yellowButton100"
              label={job?.job_type?.slice(6)}
            />
          ) : job?.job_type === "crayon lite" ? (
            <SmallButton
              color="orangeButton"
              label={job?.job_type?.slice(6)}
              mr={1}
            />
          ) : null}
          {job?.stage?.name && (
            <SmallButton color="lightGreenButton300" label={job?.stage?.name} />
          )}

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
            <Button
              color="grayButton200"
              // onClick={() =>
              //   decodedToken?.data?.role_id === "undefined"
              //     ? handleClick
              //     : handleStar(job?.job_id)
              // }
              sx={{
                height: "auto",
                minWidth: 50,
                background: theme.palette.grayBackground,
                borderRadius: "0 0 10px 0",
                padding: 0,
              }}
            >
              <StarRoundedIcon color={isStar ? "error" : "disabled"} />
            </Button>
          </Box>
          {/* {isStar ? (
            <Box
              component="img"
              sx={{
                height: 43,
                width: 43,
                maxHeight: { xs: 43 },
                maxWidth: { xs: 43 },
                mr: 1,
              }}
              alt="job_star_selected"
              src={job_star_selected}
              onClick={() => handleClick}
            />
          ) : (
            <Box
              component="img"
              sx={{
                height: 43,
                width: 43,
                maxHeight: { xs: 43 },
                maxWidth: { xs: 43 },
                mr: 1,
              }}
              alt="job_star"
              src={job_star}
              onClick={handleClick}
            />
          )} */}
        </Box>
        <Box />
      </Grid>
      {/* Header Section Ends */}
      {/* left Body Starts */}
      <Grid item md={7}>
        <Grid marginRight={1}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.75px",
              opacity: 0.8,
              marginBottom: "5px",
            }}
          >
            posted {convertDatetimeAgo(job?.updated_at)}
          </Typography>

          <Tooltip arrow title={job?.title} placement="top">
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
              }}
              gutterBottom
            >
              {job?.title}
            </Typography>
          </Tooltip>
          <Box
            sx={{
              display: "flex",
              marginBottom: "12px",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                gap: 0.5,
              }}
            >
              <AccountBalanceWalletIcon fontSize="string" color="primary" />
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                gap: 0.5,
              }}
            >
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                gap: 0.5,
              }}
            >
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                gap: 0.5,
              }}
            >
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
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              gap: 4,
              alignItems: "flex-start",
              marginBottom: "12px",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.25px",
              }}
            >
              {job?.salary?.currency?.symbol}
              {job?.Salary} per month
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
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
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{ padding: 0 }}
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
            </Box>
          </Box> */}
        </Grid>

        <Grid
          sx={{
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: 15,
              fontWeight: 900,
              mb: 0.5,
            }}
          >
            Work Type
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <SmallButton
              color={"blueButton700"}
              height={25}
              value={job?.type}
              label={job?.type?.split(" ")[0]}
            />
            <SmallButton
              color={"blueButton700"}
              height={25}
              value={job?.work_setup}
              label={job?.work_setup}
            />
          </Box>
        </Grid>
        <Grid
          sx={{
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: 15,
              fontWeight: 900,
              mb: 0.5,
            }}
          >
            Industry
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {job?.employer_industries?.map((item) => {
              return (
                <SmallButton
                  color={"blueButton600"}
                  height={25}
                  value={item?.industry?.name}
                  label={item?.industry?.name?.split(" ")[0]}
                />
              );
            })}
          </Box>
        </Grid>
        <Grid
          sx={{
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: 15,
              fontWeight: 900,
              mb: 0.5,
            }}
          >
            Skills
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {job?.job_tags?.map((item) => {
              return (
                <SmallButton
                  color={"orangeButton"}
                  height={25}
                  value={item?.tag?.tag}
                  label={item?.tag?.tag}
                />
              );
            })}
          </Box>
        </Grid>
        <Grid
          sx={{
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: 15,
              fontWeight: 900,
              mb: 0.5,
            }}
          >
            Tools
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {job?.job_tools?.map((item) => {
              return (
                <SmallButton
                  color={"yellowButton300"}
                  height={25}
                  value={item?.tool?.name}
                  label={item?.tool?.name}
                />
              );
            })}
          </Box>
        </Grid>
        <Grid
          sx={{
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: 15,
              fontWeight: 900,
              mb: 0.5,
            }}
          >
            Personality
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {job?.job_traits?.map((item) => {
              return (
                <SmallButton
                  color={"grayButton200"}
                  height={25}
                  value={item?.trait?.name}
                  label={item?.trait?.name}
                />
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            {/* <Grid sx={{
                        display: "flex",
                    }}> */}
            <Box
              sx={{
                width: "16.6%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SingleRadialChart
                max={1000}
                labelsData={label4}
                series={[job?.grit_score]}
                width={130}
                color={theme.palette.chart.red}
                // index={index}
                isHovered={isHovered}
              />
            </Box>
            <Box
              sx={{
                width: "16.6%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                sx={{
                  height: 70,
                  width: 70,
                }}
                alt="job_exp"
                src={
                  (job?.primary?.name == "collaborator" &&
                    profile_collaborator) ||
                  (job?.primary?.name == "challenger" && profile_challenger) ||
                  (job?.primary?.name == "character" && profile_character) ||
                  (job?.primary?.name == "contemplator" && profile_contemplator)
                }
              />
            </Box>
            <Box
              sx={{
                width: "16.6%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                sx={{
                  height: 70,
                  width: 70,
                }}
                alt="job_exp"
                src={
                  (job?.shadow?.name == "collaborator" &&
                    profile_collaborator) ||
                  (job?.shadow?.name == "challenger" && profile_challenger) ||
                  (job?.shadow?.name == "character" && profile_character) ||
                  (job?.shadow?.name == "contemplator" && profile_contemplator)
                }
              />
            </Box>

            {/* <Box
              sx={{
                width: "16.6%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SingleRadialChart
                max={1000}
                labelsData={label1}
                series={[job?.TotalUserCount]}
                width={130}
                color={theme.palette.chart.red}
                // index={index}
                isHovered={isHovered}
              />
            </Box>
            <Box
              sx={{
                width: "16.6%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SingleRadialChart
                labelsData={label2}
                series={[job?.TotalUserShorlisted]}
                width={130}
                color={theme.palette.chart.green}
                // index={index}
                isHovered={isHovered}
              />
            </Box>
            <Box
              sx={{
                width: "16.6%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SingleRadialChart
                labelsData={label3}
                series={[job?.TotalUserInterviewed]}
                width={130}
                color={theme.palette.chart.yellow}
                // index={index}
                isHovered={isHovered}
              />
            </Box> */}
          </Box>
        </Grid>

        <Grid
          sx={{
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "0.75px",
              //   opacity: 0.8,
              marginBottom: "8px",
            }}
          >
            How you'll role
          </Typography>
          <Box
            // letterSpacing="0.25px"
            className="preview"
            m={0}
            p={0}
            dangerouslySetInnerHTML={createMarkup(job?.description)}
          ></Box>
        </Grid>

        <Grid
          sx={{
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "0.75px",
              marginBottom: "8px",
            }}
          >
            What you'll do
          </Typography>
          <Box
            // letterSpacing="0.25px"
            className="preview"
            m={0}
            p={0}
            dangerouslySetInnerHTML={createMarkup(job?.role_responsibilty)}
          ></Box>
        </Grid>

        <Grid
          sx={{
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "0.75px",
              marginBottom: "8px",
            }}
          >
            What you'll need
          </Typography>
          <Box
            // letterSpacing="0.25px"
            className="preview"
            m={0}
            p={0}
            dangerouslySetInnerHTML={createMarkup(job?.role_requirements)}
          ></Box>
        </Grid>

        <Grid>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "0.75px",
              marginBottom: "10px",
            }}
          >
            What you'll be asked
          </Typography>
          {job?.job_questions?.map((question, index) => {
            return (
              <>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: "0.75px",
                    marginBottom: "8px",
                  }}
                >
                  Question {index + 1}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: 14,
                    letterSpacing: "0.75px",
                    marginBottom: "8px",
                  }}
                >
                  {question.question}
                </Typography>
              </>
            );
          })}
        </Grid>
      </Grid>
      {/* left Body Ends */}
      {/* right body Starts */}
      <Grid
        item
        md={4}
        marginLeft={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <Box
          sx={{
            background: "#f0f0f0",
            padding: 3,
            borderRadius: "15px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
            gutterBottom
          >
            Application Requirements
          </Typography>

          <Grid width={"95%"}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <Box
                width={"25%"}
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
              >
                <Box
                  component="img"
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                  alt="own_vehicle"
                  src={own_vehicle}
                />
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: "Bold",
                  }}
                  paragraph
                >
                  Own Transport
                </Typography>
              </Box>
              <Box
                width={"25%"}
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
              >
                <Box
                  component="img"
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                  alt="own_vehicle"
                  src={own_equipment}
                />
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: "Bold",
                  }}
                  paragraph
                >
                  own equipment
                </Typography>
              </Box>
              <Box
                width={"25%"}
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
              >
                <Box
                  component="img"
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                  alt="own_vehicle"
                  src={own_internet}
                />
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: "Bold",
                  }}
                  paragraph
                >
                  Internet Access
                </Typography>
              </Box>
              <Box
                width={"25%"}
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
              >
                <Box
                  component="img"
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                  alt="own_vehicle"
                  src={dollar_sign}
                />
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: "Bold",
                  }}
                  paragraph
                >
                  currency
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "25%",
                }}
              >
                <SingleRadialChart
                  max={1000}
                  labelsData={label5}
                  series={"6"}
                  color={theme.palette.chart.red}
                  isHovered={isHovered}
                />
              </Box>
              <Box
                width={"25%"}
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
                textAlign={"center"}
              >
                <Box
                  component="img"
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                  alt="start_date"
                  src={start_date}
                />
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: "Bold",
                  }}
                  paragraph
                >
                  Job starts: 13 September 2023
                </Typography>
              </Box>
              <Box
                width={"25%"}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Box
                  component="img"
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                  alt="education_type"
                  src={education_type}
                />
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: "Bold",
                  }}
                  paragraph
                >
                  National diploma
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Box>

        <Grid
          sx={{
            border: "2px solid lightgray",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: "16.6%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SingleRadialChart
                max={1000}
                labelsData={label1}
                series={[job?.TotalUserCount]}
                width={130}
                color={theme.palette.chart.red}
                // index={index}
                isHovered={isHovered}
              />
            </Box>
            <Box
              sx={{
                width: "16.6%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SingleRadialChart
                labelsData={label2}
                series={[job?.TotalUserShorlisted]}
                width={130}
                color={theme.palette.chart.green}
                // index={index}
                isHovered={isHovered}
              />
            </Box>
            <Box
              sx={{
                width: "16.6%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SingleRadialChart
                labelsData={label3}
                series={[job?.TotalUserInterviewed]}
                width={130}
                color={theme.palette.chart.yellow}
                // index={index}
                isHovered={isHovered}
              />
            </Box>
          </Box>
          <Typography
            sx={{
              padding: "20px 20px 0 20px",
            }}
            textAlign={"center"}
            paragraph
          >
            <strong> Note:</strong> For{" "}
            <SmallButton
              color="yellowButton100"
              label={i18n["jobCard.recruit"]}
              mr={1}
            />{" "}
            You'll be dealing via the Crayon team and not with the client
            directly until appropriate.
          </Typography>
          <Typography
            sx={{
              padding: "0 20px ",
            }}
            textAlign={"center"}
            paragraph
          >
            For{" "}
            <SmallButton
              color="orangeButton"
              label={i18n["jobCard.lite"]}
              mr={1}
            />{" "}
            you'll be dealing directly with the client and not via crayon
          </Typography>
          <Grid container display={"flex"} flexWrap={"nowrap"}>
            <Grid sx={{ width: "50%", padding: 0 }}>
              <Button
                sx={{
                  boxShadow: 0,
                  fontSize: "20px",
                  width: "100%",
                  borderRadius: 0,
                  height: "43px",
                }}
                color="blueButton600"
                variant="contained"
                onClick={handleClick}
              >
                {i18n["jobCard.matchnow"]}
              </Button>
            </Grid>
            <Grid sx={{ width: "50%", padding: 0 }}>
              <Button
                sx={{
                  boxShadow: 0,
                  fontSize: "20px",
                  width: "100%",
                  borderRadius: 0,
                  height: "43px",
                }}
                variant="contained"
                color="redButton100"
                onClick={handleClick}
              >
                {i18n["jobCard.apply"]}
              </Button>
            </Grid>
            <CustomDialog
              show={openLoginDialog}
              hideButton={false}
              onDialogClose={onHandleClose}
              dialogWidth="sm"
              showFooter={false}
              title={isLoggedIn ? i18n["login.login"] : i18n["login.signUp"]}
              isApplyJob
            >
              <Typography
                sx={{ fontSize: "19px", color: "red", mb: 3, ml: 12 }}
              >
                {localStorage.getItem("isLoggedIn")
                  ? ""
                  : "To proceed further You need to login first!"}
              </Typography>
              {isLoggedIn ? (
                <ApplyJobs questions={questions} />
              ) : (
                <Login handleLogin={onHandleLogin} />
              )}
            </CustomDialog>
          </Grid>
        </Grid>

        <Grid
          sx={{
            background: "#f0f0f0",
            padding: 3,
            borderRadius: "15px",
          }}
        >
          <Grid container>
            <Box
              component="img"
              sx={{
                height: 40,
                width: 40,
                maxHeight: { xs: 40 },
                maxWidth: { xs: 40 },
              }}
              alt="job_logo"
              src={job?.profile_url != "No URL" ? job?.profile_url : job_logo}
            />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "0.75px",
                //   opacity: 0.8,
                marginLeft: "16px",
                mt: 0.5,
              }}
            >
              {job?.employer_profile?.company_name}
            </Typography>
          </Grid>

          <Grid marginTop={4}>
            <Typography
              sx={{
                fontWeight: "Bold",
                fontSize: 16,
                letterSpacing: "0.75px",  
              }}
            >
              About
            </Typography>
            <Typography>{job?.employer_profile?.notes}
              Ozow links bussinesses of all sizes in South Africa
              with 47 million bank account holders to transact simply and securly.
            </Typography>
            <Typography mt={2}>
              Millions of South Africans can use Ozow to make lightning-fast bank-to-bank payments with their smart devices, without the need for a card
            </Typography>

            <Button sx={{
              color: "black",
              marginTop: 1
            }} startIcon={<ExpandMoreIcon />}>View More</Button>
          </Grid>
        </Grid>

        <Grid>
          <Typography
            sx={{
              fontWeight: "Bold",
              fontSize: 16,
              letterSpacing: "0.75px",
              //   opacity: 0.8,
              // marginBottom: "2px",
            }}
          >
            What to expect if you're interested:
          </Typography>
          <VerticalStepper />
        </Grid>

      </Grid>
      {/* right body Ends */}
      <CustomDialog
        show={openApplyJobDialog}
        hideButton={false}
        onDialogClose={onApplyHandleClose}
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
      <Grid
        item
        xs={12}
        my={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end"
        }}
        justifyContent={"center"}
      >
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <IconButton
            onClick={scrollToTop}
            sx={{
              height: 40, // Adjust the height to make the button smaller
              width: 40, // Adjust the width to make the button smaller
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: "red",
              color: "wheat"
            }}
          >
            <ExpandLessIcon fontSize="large" sx={{ fontSize: 30 }} />
          </IconButton>
          <Typography variant="body2" sx={{ mt: 1 }}  >Back To Top</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

// import { Box, Grid } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import job_logo from "../../../assets/job_logo.svg";
// import job_volume from "../../../assets/job_volume.svg";
// import job_star from "../../../assets/job_star.svg";
// import education_type from "../../../assets/Padding Included/Crayon Icon_Education Type.svg";
// import own_equipment from "../../../assets/Padding Included/Crayon Icon_Own Equipment.svg";
// import own_vehicle from "../../../assets/Padding Included/Crayon Icon_Own Vehicle.svg";
// import dollar_sign from "../../../assets/dollar-sign.svg";
// import start_date from "../../../assets/Padding Included/Crayon Icon_Start Date.svg";
// import own_internet from "../../../assets/Padding Included/Crayon Icon_Own Internet.svg";
// import job_star_selected from "../../../assets/job_star_selected.svg";
// import job_exp from "../../../assets/job_exp.png";
// import profile_challenger from "../../../assets/Profile Icons_Challenger.svg";
// import profile_character from "../../../assets/Profile Icons_Charater.svg";
// import profile_collaborator from "../../../assets/Profile Icons_Collaborator.svg";
// import profile_contemplator from "../../../assets/Profile Icons_Contemplator.svg";
// import cross from "../../../assets/cross.svg";
// import SmallButton from "../../common/SmallButton";
// import { useTheme } from "@emotion/react";
// import { convertDatetimeAgo } from "../../../utils/DateTime";
// import Typography from "@mui/material/Typography";
// import Tooltip from "@mui/material/Tooltip";
// import IconButton from "@mui/material/IconButton";
// import PlaceIcon from "@mui/icons-material/Place";
// import SingleRadialChart from "../../common/SingleRadialChart";
// import locale from "../../../i18n/locale";
// import Button from "@mui/material/Button";
// import VerticalStepper from "./VerticalStepper";
// import { useDispatch } from "react-redux";
// import { getAllQuestions } from "../../../redux/guest/getQuestions";
// import { setAlert } from "../../../redux/configSlice";
// import {
//   ALERT_TYPE,
//   AUTHORIZED_TAB_ITEMS_CANDIDATE,
//   AUTHORIZED_TAB_ITEMS_EMPLOYER,
//   ERROR_MSG,
// } from "../../../utils/Constants";
// import CustomDialog from "../../common/CustomDialog";
// import ApplyJobs from "./ApplyJobs";
// import Login from "../../login/login";
// import { login } from "../../../redux/login/loginSlice";
// import { getLocalStorage, setLocalStorage } from "../../../utils/Common";
// import { getJobDetail } from "../../../redux/guest/jobsSlice";
// import DOMPurify from "dompurify";
// import { formatCurrencyWithCommas } from "../../../utils/Currency";
// import { getAllQuestionsWithoutLogin } from "../../../redux/guest/getQuestions";

// const label1 = "applied";
// const label2 = "shortlisted";
// const label3 = "interviewed";
// const label4 = "grit score";
// const label5 = "month contract";

// export default function JobsDetailPage({
//   jobDetails
// }) {
//   const theme = useTheme();
//   const i18n = locale.en;
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [openLoginDialog, setOpenLoginDialog] = useState(false);
//   const [isStar, setIsStarSelected] = useState(false);
//   const [job, setJob] = useState(jobDetails);
//   const [isHovered, setIsHovered] = useState(false);
//   const [questions, setQuestions] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     Boolean(getLocalStorage("token"))
//   );

//   const [openApplyJobDialog, setopenApplyJobDialog] = useState(false);
//   const { id } = useParams();

//   const getquestions = async () => {
//     const { payload } = await dispatch(getAllQuestions(job?.job_id));
//     if (payload?.status === "success") {
//       setQuestions(payload.data);
//     } else {
//       dispatch(
//         setAlert({
//           show: true,
//           type: ALERT_TYPE.ERROR,
//           msg: payload?.message,
//         })
//       );
//     }
//   };

//   const handleCancel = () => {
//     navigate("/jobs", { replace: true });

//   };
//   const getquestionswithoutlogin = async () => {
//     const { payload } = await dispatch(
//       getAllQuestionsWithoutLogin(job?.job_id)
//     );
//     if (payload?.status === "success") {
//       setQuestions(payload.data);
//     } else {
//       dispatch(
//         setAlert({
//           show: true,
//           type: ALERT_TYPE.ERROR,
//           msg: payload?.message,
//         })
//       );
//     }
//   };
//   const handleClick = () => {
//     setopenApplyJobDialog(true);
//     getquestionswithoutlogin();
//   };
//   const onApplyHandleClose = () => {
//     setopenApplyJobDialog(false);
//   };

//   const onHandleClose = () => {
//     setOpenLoginDialog(false);
//   };

//   const onHandleLogin = async (loginData) => {
//     try {
//       const { payload } = await dispatch(login(loginData));
//       if (payload?.status == "success" && payload?.token) {
//         const user = payload.data.role_id;
//         setLocalStorage("token", payload?.token);
//         onHandleClose();
//         const jwt = localStorage?.getItem("token");
//         const parts = jwt?.split(".");
//         if (parts?.length !== 3) {
//           throw new Error("Invalid JWT");
//         }
//         const encodedPayload = parts[1];
//         const decodedPayload = atob(encodedPayload);
//         const payloadData = JSON.parse(decodedPayload);
//         const profileCompletion = payloadData.data?.profile_percent_complete;
//         let tabs;
//         if (user === 4) {
//           if (profileCompletion === 100) {
//             tabs = AUTHORIZED_TAB_ITEMS_EMPLOYER;
//             navigate("/employer/my-jobs", { replace: true });
//           } else {
//             tabs = AUTHORIZED_TAB_ITEMS_EMPLOYER;
//             navigate("/employer/my-profile", { replace: true });
//           }
//         } else {
//           if (profileCompletion === 0) {
//             tabs = AUTHORIZED_TAB_ITEMS_CANDIDATE;
//             navigate("/candidate/my-jobs", { replace: true });
//           } else {
//             tabs = AUTHORIZED_TAB_ITEMS_CANDIDATE;
//             navigate("/candidate/my-profile", { replace: true });
//           }
//         }
//         // setLocalStorage("isLoggedIn", true);
//         // setLocalStorage("userType", user);
//         setIsLoggedIn(true);
//         dispatch(
//           setAlert({
//             show: true,
//             type: ALERT_TYPE.SUCCESS,
//             msg: "Successfully Login!",
//           })
//         );
//       } else {
//         dispatch(
//           setAlert({
//             show: true,
//             type: ALERT_TYPE.ERROR,
//             msg: payload?.message,
//           })
//         );
//       }
//     } catch (error) {
//       dispatch(setAlert({ show: true }));
//     }
//   };

//   // const handleCancel = () => {
//   //   navigate("/jobs", { replace: true });
//   // };

//   const handleCardClick = async () => {
//     try {
//       const { payload } = await dispatch(getJobDetail({ job_id: id }));
//       if (payload?.status == "success") {
//         setJob(payload?.data);
//       }
//     } catch (error) {
//       dispatch(
//         setAlert({
//           show: true,
//           type: ALERT_TYPE.ERROR,
//           msg: ERROR_MSG,
//         })
//       );
//     }
//   };

//   function createMarkup(html) {
//     return {
//       __html: DOMPurify.sanitize(html),
//     };
//   }

//   useEffect(() => {
//     // handleCardClick();
//   }, []);

//   return (
//     <Grid
//       container
//       sx={{
//         height: "fit-content",
//         padding: "10px 50px",
//         justifyContent: "space-between",
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Header Section Starts */}
//       <Grid
//         container
//         paddingTop={1}
//         paddingBottom={1}
//         justifyContent="space-between"
//         alignItems="center"
//       >
//         <Box
//           component="img"
//           sx={{
//             height: 40,
//             width: 40,
//             maxHeight: { xs: 40 },
//             maxWidth: { xs: 40 },
//           }}
//           alt="job_logo"
//           src={job?.profile_url != "No URL" ? job?.profile_url : job_logo}
//         />

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           {job?.job_type === "crayon recruit" ? (
//             <SmallButton
//               color="yellowButton100"
//               label={job?.job_type?.slice(6)}
//               mr={1}
//             />
//           ) : job?.job_type === "crayon lite" ? (
//             <SmallButton
//               color="orangeButton"
//               label={job?.job_type?.slice(6)}
//               mr={1}
//             />
//           ) : null}
//           {job?.stage?.name && (
//             <SmallButton color="lightGreenButton300" label={job?.stage?.name} />
//           )}
//           <Box
//             sx={{
//               height: 43,
//               width: 43,
//               maxHeight: { xs: 43 },
//               maxWidth: { xs: 43 },
//               borderRadius: "6px",
//               background: theme.palette.purpleButton300.main,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               margin: "0 8px",
//             }}
//           >
//             <Box
//               component="img"
//               sx={{
//                 height: 25,
//                 width: 25,
//                 maxHeight: { xs: 25 },
//                 maxWidth: { xs: 25 },
//               }}
//               alt="job_volume"
//               src={job_volume}
//               onClick={handleClick}
//             />
//           </Box>
//           {isStar ? (
//             <Box
//               component="img"
//               sx={{
//                 height: 43,
//                 width: 43,
//                 maxHeight: { xs: 43 },
//                 maxWidth: { xs: 43 },
//                 mr: 1,
//               }}
//               alt="job_star_selected"
//               src={job_star_selected}
//               onClick={() => handleClick}
//             />
//           ) : (
//             <Box
//               component="img"
//               sx={{
//                 height: 43,
//                 width: 43,
//                 maxHeight: { xs: 43 },
//                 maxWidth: { xs: 43 },
//                 mr: 1,
//               }}
//               alt="job_star"
//               src={job_star}
//               onClick={handleClick}
//             />
//           )}
//         </Box>
//         <Box
//           component="img"
//           sx={{
//             height: 15,
//             width: 15,
//             padding: 1,
//             borderRadius: 1,
//             color: "white",
//             background: "gray",
//             mr: 1,
//             cursor: "pointer",
//           }}
//           alt="close"
//           src={cross}
//           onClick={handleCancel}
//         />
//       </Grid>
//       {/* Header Section Ends */}
//       {/* left Body Starts */}
//       <Grid item md={6}>
//         <Grid marginRight={1}>
//           <Typography
//             sx={{
//               fontWeight: 500,
//               fontSize: 12,
//               letterSpacing: "0.75px",
//               opacity: 0.8,
//               marginBottom: "5px",
//             }}
//           >
//             posted {convertDatetimeAgo(job?.updated_at)}
//           </Typography>

//           <Tooltip arrow title={job?.title} placement="top">
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: 800,
//                 overflow: "hidden",
//                 display: "-webkit-box",
//                 WebkitBoxOrient: "vertical",
//                 WebkitLineClamp: 1,
//               }}
//               gutterBottom
//             >
//               {job?.title}
//             </Typography>
//           </Tooltip>

//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "start",
//               gap: 4,
//               alignItems: "flex-start",
//               marginBottom: "12px",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontWeight: 700,
//                 fontSize: 12,
//                 letterSpacing: "0.25px",
//               }}
//             >
//               {job?.salary?.currency?.symbol}
//               {formatCurrencyWithCommas(job?.salary?.max)} per month
//             </Typography>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <Box
//                 component="img"
//                 sx={{
//                   height: 16,
//                   width: 16,
//                   maxHeight: { xs: 15 },
//                   maxWidth: { xs: 15 },
//                   mr: 1,
//                 }}
//                 alt="job_exp"
//                 src={job_exp}
//               />
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   fontSize: 12,
//                   letterSpacing: "0.25px",
//                 }}
//               >
//                 {job?.experience?.year} years Experience
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               <IconButton
//                 sx={{ padding: 0 }}
//                 aria-label="search job"
//                 component="button"
//               >
//                 <PlaceIcon />
//               </IconButton>
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   fontSize: 12,
//                   letterSpacing: "0.25px",
//                 }}
//               >
//                 {job?.town?.name}, {job?.town?.region?.name}
//               </Typography>
//             </Box>
//           </Box>
//         </Grid>

//         <Grid
//           sx={{
//             mb: 1,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontSize: 15,
//               fontWeight: 900,
//               mb: 0.5,
//             }}
//           >
//             Work Type
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 1,
//             }}
//           >
//             <SmallButton
//               color={"blueButton700"}
//               height={25}
//               value={job?.type}
//               label={job?.type?.split(" ")[0]}
//             />
//             <SmallButton
//               color={"blueButton700"}
//               height={25}
//               value={job?.work_setup}
//               label={job?.work_setup}
//             />
//           </Box>
//         </Grid>

//         <Grid
//           sx={{
//             mb: 1,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontSize: 15,
//               fontWeight: 900,
//               mb: 0.5,
//             }}
//           >
//             Industry
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 1,
//             }}
//           >
//             {job?.employer_industries?.map((item) => {
//               return (
//                 <SmallButton
//                   color={"blueButton600"}
//                   height={25}
//                   value={item?.industry?.name}
//                   label={item?.industry?.name?.split(" ")[0]}
//                 />
//               );
//             })}
//           </Box>
//         </Grid>

//         <Grid
//           sx={{
//             mb: 1,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontSize: 15,
//               fontWeight: 900,
//               mb: 0.5,
//             }}
//           >
//             Skills
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 1,
//             }}
//           >
//             {job?.job_tags?.map((item) => {
//               return (
//                 <SmallButton
//                   color={"orangeButton"}
//                   height={25}
//                   value={item?.tag?.tag}
//                   label={item?.tag?.tag}
//                 />
//               );
//             })}
//           </Box>
//         </Grid>

//         <Grid
//           sx={{
//             mb: 1,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontSize: 15,
//               fontWeight: 900,
//               mb: 0.5,
//             }}
//           >
//             Tools
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 1,
//             }}
//           >
//             {job?.job_tools?.map((item) => {
//               return (
//                 <SmallButton
//                   color={"yellowButton300"}
//                   height={25}
//                   value={item?.tool?.name}
//                   label={item?.tool?.name}
//                 />
//               );
//             })}
//           </Box>
//         </Grid>

//         <Grid
//           sx={{
//             mb: 1,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontSize: 15,
//               fontWeight: 900,
//               mb: 0.5,
//             }}
//           >
//             Personality
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 1,
//             }}
//           >
//             {job?.job_traits?.map((item) => {
//               return (
//                 <SmallButton
//                   color={"grayButton200"}
//                   height={25}
//                   value={item?.trait?.name}
//                   label={item?.trait?.name}
//                 />
//               );
//             })}
//           </Box>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-evenly",
//             }}
//           >
//             {/* <Grid sx={{
//                         display: "flex",
//                     }}> */}
//             <Box
//               sx={{
//                 width: "16.6%",
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <SingleRadialChart
//                 max={1000}
//                 labelsData={label4}
//                 series={[job?.grit_score]}
//                 width={130}
//                 color={theme.palette.chart.red}
//                 // index={index}
//                 isHovered={isHovered}
//               />
//             </Box>
//             <Box
//               sx={{
//                 width: "16.6%",
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <Box
//                 component="img"
//                 sx={{
//                   height: 70,
//                   width: 70,
//                 }}
//                 alt="job_exp"
//                 src={
//                   (job?.primary?.name == "collaborator" &&
//                     profile_collaborator) ||
//                   (job?.primary?.name == "challenger" && profile_challenger) ||
//                   (job?.primary?.name == "character" && profile_character) ||
//                   (job?.primary?.name == "contemplator" && profile_contemplator)
//                 }
//               />
//             </Box>
//             <Box
//               sx={{
//                 width: "16.6%",
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <Box
//                 component="img"
//                 sx={{
//                   height: 70,
//                   width: 70,
//                 }}
//                 alt="job_exp"
//                 src={
//                   (job?.shadow?.name == "collaborator" &&
//                     profile_collaborator) ||
//                   (job?.shadow?.name == "challenger" && profile_challenger) ||
//                   (job?.shadow?.name == "character" && profile_character) ||
//                   (job?.shadow?.name == "contemplator" && profile_contemplator)
//                 }
//               />
//             </Box>

//             <Box
//               sx={{
//                 width: "16.6%",
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <SingleRadialChart
//                 max={1000}
//                 labelsData={label1}
//                 series={[job?.TotalUserCount]}
//                 width={130}
//                 color={theme.palette.chart.red}
//                 // index={index}
//                 isHovered={isHovered}
//               />
//             </Box>
//             <Box
//               sx={{
//                 width: "16.6%",
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <SingleRadialChart
//                 labelsData={label2}
//                 series={[job?.TotalUserShorlisted]}
//                 width={130}
//                 color={theme.palette.chart.green}
//                 // index={index}
//                 isHovered={isHovered}
//               />
//             </Box>
//             <Box
//               sx={{
//                 width: "16.6%",
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <SingleRadialChart
//                 labelsData={label3}
//                 series={[job?.TotalUserInterviewed]}
//                 width={130}
//                 color={theme.palette.chart.yellow}
//                 // index={index}
//                 isHovered={isHovered}
//               />
//             </Box>
//           </Box>
//         </Grid>

//         <Grid
//           sx={{
//             mb: 4,
//           }}
//         >
//           <Typography
//             sx={{
//               fontWeight: 700,
//               fontSize: 16,
//               letterSpacing: "0.75px",
//               //   opacity: 0.8,
//               marginBottom: "8px",
//             }}
//           >
//             How you'll role
//           </Typography>
//           <Box
//             // letterSpacing="0.25px"
//             className="preview"
//             m={0}
//             p={0}
//             dangerouslySetInnerHTML={createMarkup(job?.description)}
//           ></Box>
//         </Grid>

//         <Grid
//           sx={{
//             mb: 4,
//           }}
//         >
//           <Typography
//             sx={{
//               fontWeight: 700,
//               fontSize: 16,
//               letterSpacing: "0.75px",
//               marginBottom: "8px",
//             }}
//           >
//             What you'll do
//           </Typography>
//           <Box
//             // letterSpacing="0.25px"
//             className="preview"
//             m={0}
//             p={0}
//             dangerouslySetInnerHTML={createMarkup(job?.role_responsibilty)}
//           ></Box>
//         </Grid>

//         <Grid
//           sx={{
//             mb: 4,
//           }}
//         >
//           <Typography
//             sx={{
//               fontWeight: 700,
//               fontSize: 16,
//               letterSpacing: "0.75px",
//               marginBottom: "8px",
//             }}
//           >
//             What you'll need
//           </Typography>
//           <Box
//             // letterSpacing="0.25px"
//             className="preview"
//             m={0}
//             p={0}
//             dangerouslySetInnerHTML={createMarkup(job?.role_requirements)}
//           ></Box>
//         </Grid>

//         <Grid>
//           <Typography
//             sx={{
//               fontWeight: 700,
//               fontSize: 16,
//               letterSpacing: "0.75px",
//               marginBottom: "10px",
//             }}
//           >
//             What you'll be asked
//           </Typography>
//           {job?.job_questions?.map((question, index) => {
//             return (
//               <>
//                 <Typography
//                   sx={{
//                     fontWeight: 700,
//                     fontSize: 16,
//                     letterSpacing: "0.75px",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   Question {index + 1}
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontWeight: 400,
//                     fontSize: 14,
//                     letterSpacing: "0.75px",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   {question.question}
//                 </Typography>
//               </>
//             );
//           })}
//         </Grid>
//       </Grid>
//       {/* left Body Ends */}
//       {/* right body Starts */}
//       <Grid item md={5} marginLeft={0}>
//         <Grid>
//           <Typography
//             variant="h5"
//             sx={{
//               fontWeight: 800,
//               overflow: "hidden",
//               display: "-webkit-box",
//               WebkitBoxOrient: "vertical",
//               WebkitLineClamp: 1,
//               mb: 5,
//             }}
//             gutterBottom
//           >
//             Application Requirements
//           </Typography>

//           <Grid minHeight={"200px"} width={"85%"}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexWrap: "wrap",
//               }}
//             >
//               <Box
//                 width={"25%"}
//                 display={"flex"}
//                 alignItems={"center"}
//                 flexDirection={"column"}
//               >
//                 <Box
//                   component="img"
//                   sx={{
//                     height: 50,
//                     width: 50,
//                   }}
//                   alt="own_vehicle"
//                   src={own_vehicle}
//                 />
//                 <Typography
//                   sx={{
//                     fontSize: 9,
//                     fontWeight: "Bold",
//                   }}
//                   paragraph
//                 >
//                   Own Transport
//                 </Typography>
//               </Box>
//               <Box
//                 width={"25%"}
//                 display={"flex"}
//                 alignItems={"center"}
//                 flexDirection={"column"}
//               >
//                 <Box
//                   component="img"
//                   sx={{
//                     height: 50,
//                     width: 50,
//                   }}
//                   alt="own_vehicle"
//                   src={own_equipment}
//                 />
//                 <Typography
//                   sx={{
//                     fontSize: 9,
//                     fontWeight: "Bold",
//                   }}
//                   paragraph
//                 >
//                   own equipment
//                 </Typography>
//               </Box>
//               <Box
//                 width={"25%"}
//                 display={"flex"}
//                 alignItems={"center"}
//                 flexDirection={"column"}
//               >
//                 <Box
//                   component="img"
//                   sx={{
//                     height: 50,
//                     width: 50,
//                   }}
//                   alt="own_vehicle"
//                   src={own_internet}
//                 />
//                 <Typography
//                   sx={{
//                     fontSize: 9,
//                     fontWeight: "Bold",
//                   }}
//                   paragraph
//                 >
//                   Internet Access
//                 </Typography>
//               </Box>
//               <Box
//                 width={"25%"}
//                 display={"flex"}
//                 alignItems={"center"}
//                 flexDirection={"column"}
//               >
//                 <Box
//                   component="img"
//                   sx={{
//                     height: 50,
//                     width: 50,
//                   }}
//                   alt="own_vehicle"
//                   src={dollar_sign}
//                 />
//                 <Typography
//                   sx={{
//                     fontSize: 9,
//                     fontWeight: "Bold",
//                   }}
//                   paragraph
//                 >
//                   currency
//                 </Typography>
//               </Box>
//               <Box
//                 sx={{
//                   width: "25%",
//                 }}
//               >
//                 <SingleRadialChart
//                   max={1000}
//                   labelsData={label5}
//                   series={"6"}
//                   color={theme.palette.chart.red}
//                   isHovered={isHovered}
//                 />
//               </Box>
//               <Box
//                 width={"25%"}
//                 display={"flex"}
//                 alignItems={"center"}
//                 flexDirection={"column"}
//                 textAlign={"center"}
//               >
//                 <Box
//                   component="img"
//                   sx={{
//                     height: 50,
//                     width: 50,
//                   }}
//                   alt="start_date"
//                   src={start_date}
//                 />
//                 <Typography
//                   sx={{
//                     fontSize: 9,
//                     fontWeight: "Bold",
//                   }}
//                   paragraph
//                 >
//                   Job starts: 13 September 2023
//                 </Typography>
//               </Box>
//               <Box
//                 width={"25%"}
//                 display={"flex"}
//                 flexDirection={"column"}
//                 alignItems={"center"}
//               >
//                 <Box
//                   component="img"
//                   sx={{
//                     height: 50,
//                     width: 50,
//                   }}
//                   alt="education_type"
//                   src={education_type}
//                 />
//                 <Typography
//                   sx={{
//                     fontSize: 9,
//                     fontWeight: "Bold",
//                   }}
//                   paragraph
//                 >
//                   National diploma
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>

//           <Grid
//             sx={{
//               border: "2px solid lightgray",
//               borderRadius: "20px",
//               margin: "auto",
//               overflow: "hidden",
//               mb: 5,
//             }}
//           >
//             <Typography
//               sx={{
//                 padding: "20px 20px 0 20px",
//               }}
//               paragraph
//             >
//               <strong> Note:</strong> For{" "}
//               <SmallButton
//                 color="yellowButton100"
//                 label={i18n["jobCard.recruit"]}
//                 mr={1}
//               />{" "}
//               You'll be dealing via the Crayon team and not with the client
//               directly until appropriate.
//             </Typography>
//             <Typography
//               sx={{
//                 padding: "0 20px ",
//               }}
//               paragraph
//             >
//               For{" "}
//               <SmallButton
//                 color="orangeButton"
//                 label={i18n["jobCard.lite"]}
//                 mr={1}
//               />{" "}
//               you'll be dealing directly with the client and not via crayon
//             </Typography>
//             <Grid
//               container
//               display={"flex"}
//               flexWrap={"nowrap"}
//               sx={{
//                 background: "green",
//               }}
//             >
//               <Grid sx={{ width: "50%", padding: 0 }}>
//                 <Button
//                   sx={{
//                     boxShadow: 0,
//                     fontSize: "20px",
//                     width: "100%",
//                     borderRadius: 0,
//                     height: "43px",
//                     background: "lightgray",
//                     color: "black",
//                   }}
//                   variant="contained"
//                   onClick={handleClick}
//                 >
//                   {i18n["jobCard.matchnow"]}
//                 </Button>
//               </Grid>
//               <Grid sx={{ width: "50%", padding: 0 }}>
//                 <Button
//                   sx={{
//                     boxShadow: 0,
//                     fontSize: "20px",
//                     width: "100%",
//                     borderRadius: 0,
//                     height: "43px",
//                   }}
//                   variant="contained"
//                   color="redButton100"
//                   onClick={handleClick}
//                 >
//                   {i18n["jobCard.apply"]}
//                 </Button>
//               </Grid>
//               <CustomDialog
//                 show={openLoginDialog}
//                 hideButton={false}
//                 onDialogClose={onHandleClose}
//                 dialogWidth="sm"
//                 showFooter={false}
//                 title={isLoggedIn ? i18n["login.login"] : i18n["login.signUp"]}
//                 isApplyJob
//               >
//                 <Typography
//                   sx={{ fontSize: "19px", color: "red", mb: 3, ml: 12 }}
//                 >
//                   {Boolean(getLocalStorage("token"))
//                     ? ""
//                     : "To proceed further You need to login first!"}
//                 </Typography>
//                 {isLoggedIn ? (
//                   <ApplyJobs questions={questions} />
//                 ) : (
//                   <Login handleLogin={onHandleLogin} />
//                 )}
//               </CustomDialog>
//             </Grid>
//           </Grid>

//           <Grid>
//             <Grid container>
//               <Box
//                 component="img"
//                 sx={{
//                   height: 40,
//                   width: 40,
//                   maxHeight: { xs: 40 },
//                   maxWidth: { xs: 40 },
//                 }}
//                 alt="job_logo"
//                 src={job?.profile_url != "No URL" ? job?.profile_url : job_logo}
//               />
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   fontSize: 18,
//                   letterSpacing: "0.75px",
//                   //   opacity: 0.8,
//                   marginLeft: "16px",
//                   mt: 0.5,
//                 }}
//               >
//                 {job?.employer_profile?.company_name}
//               </Typography>
//             </Grid>

//             <Grid marginTop={1}>
//               <Typography
//                 sx={{
//                   fontWeight: "Bold",
//                   fontSize: 16,
//                   letterSpacing: "0.75px",
//                   //   opacity: 0.8,
//                   // marginBottom: "2px",
//                 }}
//               >
//                 About
//               </Typography>
//               <Typography>{job?.employer_profile?.notes}</Typography>
//             </Grid>
//           </Grid>

//           <Grid marginTop={5}>
//             <Typography
//               sx={{
//                 fontWeight: "Bold",
//                 fontSize: 16,
//                 letterSpacing: "0.75px",
//                 //   opacity: 0.8,
//                 // marginBottom: "2px",
//               }}
//             >
//               What to expect if you're interested:
//             </Typography>
//             <VerticalStepper />
//           </Grid>
//         </Grid>
//       </Grid>
//       {/* right body Ends */}
//       <CustomDialog
//         show={openApplyJobDialog}
//         hideButton={false}
//         onDialogClose={onApplyHandleClose}
//         dialogWidth="sm"
//         showFooter={false}
//         // title={isLoggedIn ? i18n["login.login"] : i18n["login.signUp"]}
//         isApplyJob
//       >
//         <ApplyJobs
//           questions={questions}
//           setopenApplyJobDialog={setopenApplyJobDialog}
//         />
//       </CustomDialog>
//     </Grid>
//   );
// }
