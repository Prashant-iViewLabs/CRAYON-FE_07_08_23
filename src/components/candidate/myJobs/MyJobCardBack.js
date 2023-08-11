import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import job_logo from "../../../assets/job_logo.svg";
import job_volume from "../../../assets/job_volume.svg";
import job_star from "../../../assets/job_star.svg";
import job_star_selected from "../../../assets/job_star_selected.svg";
import job_exp from "../../../assets/job_exp.png";
import job_apply from "../../../assets/job_apply.svg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import SingleRadialChart from "../../common/SingleRadialChart";
import SmallButton from "../../common/SmallButton";
import CustomCard from "../../common/CustomCard";
import PlaceIcon from "@mui/icons-material/Place";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ButtonMenu from "../../employer/myJobs/ButtonMenu";
import TextWrapper from "../../common/TextWrapper";
import CustomDialog from "../../common/CustomDialog";
import ManageJob from "../../employer/myJobs/ManageJob";
import {
  convertDatetimeAgo,
  dateConverterMonth,
} from "../../../utils/DateTime";
import { Tooltip } from "@mui/material";
import SelectMenu from "../../common/SelectMenu";
import { useSelector } from "react-redux";
import { getMyStatusFilter } from "../../../redux/candidate/myStatusFilter";
import { useDispatch } from "react-redux";
import { changeStatus } from "../../../redux/candidate/candidateJobs";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE } from "../../../utils/Constants";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import TrackButton from "./TrackButton";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { formatCurrencyWithCommas } from "../../../utils/Currency";
import {
  AccountBalanceWallet,
  CalendarMonth,
  NavigateBefore,
  Circle
} from "@mui/icons-material";

import profile_challenger from "../../../assets/Profile Icons_Challenger.svg";
import profile_character from "../../../assets/Profile Icons_Charater.svg";
import profile_collaborator from "../../../assets/Profile Icons_Collaborator.svg";
import profile_contemplator from "../../../assets/Profile Icons_Contemplator.svg";
import Slider from "../../common/Slider";
import Slider2 from "../../common/Slider2";


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

  const Tags = job?.job_tags.map(tag => tag?.tag?.tag)
  const Tools = job?.job_tools.map(tool => tool.tool.name)
  const Traits = job?.job_traits.map(trait => trait.trait.name)
  const [arrSlider, setArrSlider] = useState([
    job?.industry_jobs[0],
    job?.type,
    job?.work_setup,
  ]);

  const [tratisArr, setTraitArr] = useState([
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
    if (payload?.status === "success") {
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

  // const handleRightClick = () => {
  //   setArrSlider2([...arrSlider2.slice(1), ...arrSlider2.slice(0, 1)]);
  // };
  // const handleLeftClick = () => {
  //   setArrSlider2([
  //     ...arrSlider2.slice(arrSlider2.length - 1),
  //     ...arrSlider2.slice(0, arrSlider2.length - 1),
  //   ]);
  // };

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

  useEffect(() => {
    // getmyStatus();
  }, []);

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
          height: "290px",
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
                {job?.salary?.currency?.symbol}
                {formatCurrencyWithCommas(job?.salary?.max)} per month
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
            <Slider2 items={Tags} color={"yellowButton200"} hideTagsAfter={2} />
            <Slider2 items={Tools} color={"yellowButton100"} hideTagsAfter={2} />
            <Slider items={Traits} theme={theme} color={"grayButton200"} />
          </Box>

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
            onClick={() => setisFlipped(false)}
          >
            <NavigateBefore
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

      <Grid
        container
        spacing={2}
        padding="0 16px 8px 16px"
        justifyContent="space-around"
        alignItems={"center"}
      >
        <Box sx={{ margin: "0 -22px 0 -22px" }}>
          <SingleRadialChart
            labelsData={"Grit Score "}
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
            // sx={{ margin: "0 -22px 0 -22px" }}
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
            // sx={{ margin: "0 -22px 0 -22px" }}
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
                                (job?.job_status?.name === "paused" &&
                                    theme.status.paused.main) ||
                                (job?.job_status?.name === "closed" &&
                                    theme.status.closed.main) ||
                                (job?.job_status?.name === "rejected" &&
                                    theme.status.rejected.main) ||
                                (job?.job_status?.name === "active" && theme.status.active.main),
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
