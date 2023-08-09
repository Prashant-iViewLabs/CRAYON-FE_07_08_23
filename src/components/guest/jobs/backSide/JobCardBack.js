import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import job_logo from "../../../../assets/job_logo.svg";
import job_volume from "../../../../assets/job_volume.svg";
import job_exp from "../../../../assets/job_exp.png";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
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
import {
  convertDatetimeAgo,
  dateConverterMonth,
} from "../../../../utils/DateTime";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import Slider2 from "../../../common/Slider2";
import Slider from "../../../common/Slider";


const JobCardFront = ({
  index,
  job,
  setQuestions,
  onHandleClose,
  setopenApplyJobDialog,
  setisFlipped,
}) => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isStar, setIsStarSelected] = useState(job?.favourite);

  const jobTags = job?.job_tags.map(tag => tag?.tag?.tag)
  const jobTools = job?.job_tools.map(tool => tool?.tool?.name)
  const jobTraits = job?.job_traits.map(trait => trait?.trait?.name)

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

  return (
    <CustomCard
      handleMouseEnter={() => setIsHovered(true)}
      handleMouseLeave={() => setIsHovered(false)}
    >
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
          paddingTop={0}
          marginLeft={1}
          marginRight={1}
          sx={{
            flexGrow: 1,
          }}
        >
          <Tooltip
            arrow
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                gap: 1,
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
                gap: 1,
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
                gap: 1,
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
                gap: 1,
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
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1
          }}>
            {/* Tags section */}
            <Slider2 items={jobTags} color={"yellowButton200"} hideTagsAfter={2} />
            {/* Tags section */}
            {/* Tools Section */}
            <Slider2 items={jobTools} color={"yellowButton100"} hideTagsAfter={2} />
            {/* Tools Section */}
            {/* Trait Section */}
            <Slider items={jobTraits} color={"grayButton200"} theme={theme} />
            {/* Trait Section */}
          </Box>
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
        {job?.primary?.name && (
          <Box
            component="img"
            height={90}
            alt="job_exp"
            src={
              (job?.primary?.name === "collaborator" && profile_collaborator) ||
              (job?.primary?.name === "challenger" && profile_challenger) ||
              (job?.primary?.name === "character" && profile_character) ||
              (job?.primary?.name === "contemplator" && profile_contemplator)
            }
          />
        )}
        {/* </Box> */}
        {job?.shadow?.name && (
          <Box
            component="img"
            height={90}
            alt="job_exp"
            src={
              (job?.shadow?.name === "collaborator" && profile_collaborator) ||
              (job?.shadow?.name === "challenger" && profile_challenger) ||
              (job?.shadow?.name === "character" && profile_character) ||
              (job?.shadow?.name === "contemplator" && profile_contemplator)
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
          // background: "green",
          width: "100%",
          borderRadius: "0 0 25px 25px",
          height: 50,
        }}
      >
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
      {/* Footer Section */}
    </CustomCard>
  );
};

export default JobCardFront;
