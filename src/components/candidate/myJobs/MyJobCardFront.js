import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import job_logo from "../../../assets/job_logo.svg";
import job_exp from "../../../assets/job_exp.png";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import SingleRadialChart from "../../common/SingleRadialChart";
import SmallButton from "../../common/SmallButton";
import CustomCard from "../../common/CustomCard";
import PlaceIcon from "@mui/icons-material/Place";
import TextWrapper from "../../common/TextWrapper";
import {
  convertDatetimeAgo,
  dateConverterMonth,
} from "../../../utils/DateTime";
import { Tooltip } from "@mui/material";
import SelectMenu from "../../common/SelectMenu";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changeStatus } from "../../../redux/candidate/candidateJobs";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE } from "../../../utils/Constants";
import TrackButton from "./TrackButton";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { formatCurrencyWithCommas } from "../../../utils/Currency";
import {
  AccountBalanceWallet,
  CalendarMonth,
  NavigateNext,
  Circle
} from "@mui/icons-material";
import Slider2 from "../../common/Slider2";

const label1 = "applicants";
const label2 = "shortlisted";
const label3 = "interviews";

export default function MyJobsCard({ index, job, getJobs, setisFlipped }) {
  const i18n = locale.en;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [colorKey, setColorKey] = useState("color");
  const [chartData1, setChartData1] = useState([11]);
  const [chartData2, setChartData2] = useState([78]);
  const [chartData3, setChartData3] = useState([30]);
  const [isHovered, setIsHovered] = useState(false);
  const [isStar, setIsStarSelected] = useState(false);
  const [candidate_status, setCandidate_status] = useState(
    job?.candidate_status
  );
  const [openManageJobDialog, setOpenManageJobDialog] = useState(false);
  const myStatus = useSelector((state) => state.configMyStatus.mystatusfilter);

  const industries = job?.industry_jobs.map(industry => industry?.industry.name)
  console.log(industries)
  const [arrSlider2, setArrSlider2] = useState([
    job?.primary?.name,
    job?.shadow?.name,
    ...(job?.job_traits || []),
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCandidateStatus = async (event) => {
    const {
      target: { value },
      target: { name },
      target: { id },
    } = event;

    const data = {
      job_id: job?.job_id,
      status_id: value,
    };

    const { payload } = await dispatch(changeStatus(data));
    if (payload?.status == "success") {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.SUCCESS,
          msg: "Status Changed Successfully",
        })
      );
      await getJobs();
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


  const showManageJob = () => {
    setOpenManageJobDialog(true);
  };
  const onHandleClose = () => {
    setOpenManageJobDialog(false);
  };
  const handleHoverEnter = () => {
    setColorKey("hover");
  };
  const handleHoverLeave = () => {
    setColorKey("color");
  };
  const handleStar = () => {
    setIsStarSelected(!isStar);
  };

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

  return (
    <CustomCard
      handleMouseEnter={() => setIsHovered(true)}
      handleMouseLeave={() => setIsHovered(false)}
    >
      <Grid
        container
        // padding={1}
        justifyContent="space-between"
        alignItems="center"
        overflow={"hidden"}
        sx={{
          borderRadius: "25px 25px 0 0",
          // gap: 3,
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
            borderRadius: 4,
          }}
          alt="job_logo"
          src={job?.profile_url !== "No URL" ? job?.profile_url : job_logo}
        />
        <Box
          sx={{
            flexGrow: 0.5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              {job?.job_type === "crayon recruit" ? (
                <SmallButton
                  color="yellowButton100"
                  label={job?.job_type?.slice(6)}
                />
              ) : job?.job_type === "crayon lite" ? (
                <SmallButton
                  color="orangeButton"
                  label={job?.job_type?.slice(6)}
                />
              ) : null}

              {job?.stage?.name && (
                <SmallButton
                  color="lightGreenButton300"
                  label={job?.stage?.name}
                />
              )}
            </Box>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: 12,
                letterSpacing: "0.75px",
                opacity: 0.8,
              }}
            >
              posted {convertDatetimeAgo(job?.updated_at)}
            </Typography>
          </Box>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              width: "40%",
              flexDirection: "column",
              border: "1px solid lightGray",
              borderTop: 0,
              borderRight: 0,
              borderRadius: "0 0px 0px 10px",
            }}
          >
            <TrackButton job={job} />
            <Typography sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "Bold",
              fontSize: "0.9rem"
            }}>{job?.job_status?.name || "Status"} <Circle fontSize="string" color={job?.job_status?.name === "active" ? "success" : "error"} /></Typography>
          </Box>
        </Box>
      </Grid>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "270px",
        }}
      >
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
            <Link
              to={`/candidate/job-detail/${`${job?.town?.name + " " + job?.town?.region?.name
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
              >
                {job?.title.slice(0, 30)}
              </Typography>
            </Link>
          </Tooltip>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              marginBottom: "12px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccountBalanceWallet fontSize="string" color="primary" sx={{}} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.25px",
                }}
              >
                R{formatCurrencyWithCommas(job?.salary?.max)} per month
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarMonth fontSize="string" color="error" />
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
            <Slider2 items={[job?.type,
            job?.work_setup]} color={"blueButton700"} hideTagsAfter={2}/>
            <Slider2 items={industries} color={"blueButton600"} hideTagsAfter={2}/>
          </Box>
          <TextWrapper
            children={job?.description}
            mt="12px"
            mb={1}
            color={theme.palette.black100}
            letterSpacing="0.25px"
            sx={{ minHeight: "63px" }}
          >
            <Box
              // sx={{
              //     background: "transparent"
              // }}
              // letterSpacing="0.25px"
              className="preview"
              m={0}
              p={0}
              dangerouslySetInnerHTML={createMarkup(job?.description)}
            ></Box>
          </TextWrapper>
        </Grid>
        <Box sx={{ display: "flex", alignItems: "end", marginBottom: "12px" }}>
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
            <NavigateNext
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

      {/* Back Part */}
      {/* <Grid
                container
                spacing={2}
                padding="0 8px 8px 0px"
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
                                                : index == 1
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
        {/* <Grid
                    sx={{
                        borderRadius: 0,
                        width: "33.33%",
                        height: "100%",
                        fontSize: "12px",
                    }}> */}
        <SelectMenu
          name="candidate_status"
          // defaultValue={`my status: ${job?.candidate_status}`}
          value={`${job?.candidate_status}`}
          onHandleChange={handleCandidateStatus}
          options={myStatus.filter((status) => status.id !== 1111)}
          sx={{
            borderRadius: 0,
            width: "33.33%",
            height: "100%",
            fontSize: "8px",
            // color: theme.palette.base.main,
            backgroundColor:
              (job?.candidate_status === "pending" &&
                theme.status.pending.main) ||
              (job?.candidate_status === "i like this" &&
                theme.status.ilikethis.main) ||
              (job?.candidate_status === "i love this" &&
                theme.status.ilovethis.main) ||
              (job?.candidate_status === "not for me" &&
                theme.status.notforme.main),
            "& .css-1g66942-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root":
            {
              color: theme.palette.base.main,
            },
          }}
        />
        {/* </Grid> */}
      </Grid>

      {/* <Box sx={{ width: "40%", padding: 0 }}>
                    <Button
                        sx={{
                            boxShadow: 0,
                            fontSize: "12px",
                            width: "100%",
                            height: "43px",
                            padding: 0,
                            borderRadius: "5px",
                            margin: 0,
                            backgroundColor:
                                (job?.job_status?.name == "paused" &&
                                    theme.status.paused.main) ||
                                (job?.job_status?.name == "closed" &&
                                    theme.status.closed.main) ||
                                (job?.job_status?.name == "rejected" &&
                                    theme.status.rejected.main) ||
                                (job?.job_status?.name == "active" && theme.status.active.main),
                        }}
                        variant="contained"
                    // color="redButton100"
                    // onClick={handleClick}
                    >
                        job status: {job?.job_status?.name}
                    </Button>
                </Box> */}
    </CustomCard>
  );
}
