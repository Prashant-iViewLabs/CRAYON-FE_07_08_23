import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import job_logo from "../../../../assets/job_logo.svg";
import job_volume from "../../../../assets/job_volume.svg";
import job_exp from "../../../../assets/job_exp.png";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import locale from "../../../../i18n/locale";
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
import TextWrapper from "../../../common/TextWrapper";
import { convertDatetimeAgo, dateConverterMonth } from "../../../../utils/DateTime";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setAlert } from "../../../../redux/configSlice";
import { favouriteJob } from "../../../../redux/guest/talentSlice";
import jwt_decode from "jwt-decode";
import { formatCurrencyWithCommas } from "../../../../utils/Currency";
import DOMPurify from "dompurify";

import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import JobsDetailPage from "../JobsDetailPage";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Slider2 from "../../../common/Slider2";

const label1 = "applied";
const label2 = "shortlisted";
const label3 = "interviewed";

const JobCardFront = ({
  index,
  job,
  setQuestions,
  onHandleClose,
  setopenApplyJobDialog,
  setisFlipped,
}) => {
  const i18n = locale.en;
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isStar, setIsStarSelected] = useState(job?.favourite);
  const jobIndustries = job?.industry_jobs.map(industry => industry?.industry?.name)



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
  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

  // const handleJobTitle = () => {
  //   navigate(

  //   );
  // };
  return (
    <CustomCard
      handleMouseEnter={() => setIsHovered(true)}
      handleMouseLeave={() => setIsHovered(false)}
    >
      <Grid
        container
        // padding={1}
        justifyContent="space-between"
        alignItems="start"
        overflow={"hidden"}
        sx={{
          borderRadius: "25px 25px 0 0",
          //   gap: 2,
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
            borderRadius: 4
          }}
          alt="job_logo"
          src={job?.profile_url !== "No URL" ? job?.profile_url : job_logo}
        />
        <Box
          sx={{
            flexGrow: 0.5,
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

              <Button
                color="grayButton200"
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
              </Button>
              {/* {isStar ? (
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
                )} */}
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
      </Grid >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "280px",
        }}
      >
        <Grid
          paddingTop={0}
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
            <Link
              to={`/jobs/job-detail/${`${job?.town?.name + " " + job?.town?.region?.name
                }`}/${job?.job_id}`}
              target={"_blank"}
              style={{
                textDecoration: "none",
                color: theme.palette.black,
              }}
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
              // onClick={handleJobTitle}
              >
                {job?.title}
              </Typography>
            </Link>
          </Tooltip>
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
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1
          }}>
            <Slider2 items={[
              job?.type,
              job?.work_setup,
            ]} color={"blueButton700"} hideTagsAfter={2} />
            <Slider2 items={jobIndustries} color={"blueButton600"} hideTagsAfter={2} />
          </Box>

          <TextWrapper
            mt="12px"
            mb={1}
            color={theme.palette.black100}
            letterSpacing="0.25px"
          >
            <Box
              // letterSpacing="0.25px"
              sx={{
                background: "transparent"
              }}
              className="preview"
              m={0}
              p={0}
              dangerouslySetInnerHTML={createMarkup(job?.description)}
            ></Box>
          </TextWrapper>
        </Grid>
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
              borderRadius: "5px 0 0 5px",
            }}
            onClick={() => setisFlipped(true)}
          >
            <NavigateNextIcon
              sx={{
                margin: 0,
                padding: 0,
              }}
              fontSize="string"
            />
            {/* &#62; */}
          </Button>
        </Box>
      </Box>
      {/* <Grid
                container
                spacing={2}
                padding="0 8px 8px 0px"
                minHeight={45}
                sx={
                    arrSlider2.length >= 4
                        ? { justifyContent: "space-evenly", alignItems: "center" }
                        : { ml: 2 }
                }
            >
                {arrSlider2.length >= 4 ? (
                    <IconButton
                        sx={{
                            border: `1px solid ${theme.palette.grayBorder}`,
                            borderRadius: "8px",
                            width: "37px",
                            height: "37px",
                            ml: 1,
                        }}
                        color="redButton100"
                        aria-label="search job"
                        component="button"
                        onClick={handleLeftClick}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                ) : null}
                <Box
                    sx={
                        job?.job_traits.length <= 1 &&
                            job?.primary?.name !== "" &&
                            job?.shadow?.name !== ""
                            ? {
                                width: "65%",
                                display: "flex",
                            }
                            : {
                                width: "65%",
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
                                        color={
                                            item?.trait?.name
                                                ? "grayButton200"
                                                : index === 1
                                                    ? "brownButton"
                                                    : "purpleButton"
                                        }
                                        height={25}
                                        label={item?.trait ? item?.trait?.name : item}
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
                            width: "37px",
                            height: "37px",
                            mr: 1,
                        }}
                        color="redButton100"
                        aria-label="search job"
                        component="button"
                        onClick={handleRightClick}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                ) : null}
            </Grid> */}

      <Grid
        container
        spacing={2}
        padding="0 16px 8px 16px"
        justifyContent="space-around"
      >
        <Box sx={{ margin: "0 -22px 0 -22px" }}>
          <SingleRadialChart
            max={1000}
            labelsData={label1}
            series={[job?.TotalUserCount]}
            width={140}
            color={theme.palette.chart.red}
            index={index}
            isHovered={isHovered}
          />
        </Box>
        <Box sx={{ margin: "0 -22px 0 -22px" }}>
          <SingleRadialChart
            labelsData={label2}
            series={[job?.TotalUserShorlisted]}
            width={140}
            color={theme.palette.chart.green}
            index={index}
            isHovered={isHovered}
          />
        </Box>
        <Box sx={{ margin: "0 -22px 0 -22px" }}>
          <SingleRadialChart
            labelsData={label3}
            series={[job?.TotalUserInterviewed]}
            width={140}
            color={theme.palette.chart.yellow}
            index={index}
            isHovered={isHovered}
          />
        </Box>
      </Grid>
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
        <Link
          to={`/jobs/job-detail/${`${job?.town?.name + " " + job?.town?.region?.name
            }`}/${job?.job_id}`}
          target={"_blank"}
          style={{
            textDecoration: "none",
            color: theme.palette.black,
            width: "33.33%",
            height: "100%",
          }}
        >

          <Button
            variant="contained"
            sx={{
              borderRadius: 0,
              fontSize: "12px",
              height: "100%",
              width: "100%"
            }}
            color="grayButton200"
          >
            View More
          </Button>
        </Link>

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
    </CustomCard >
  );
};

export default JobCardFront;
