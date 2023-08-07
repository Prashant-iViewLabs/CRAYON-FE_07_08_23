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
import { convertDatetimeAgo } from "../../../utils/DateTime";
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

const label1 = "applicants";
const label2 = "shortlisted";
const label3 = "interviews";

export default function MyJobsCard({ index, job, getJobs }) {
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

  const [arrSlider, setArrSlider] = useState([
    job?.industry_jobs[0],
    job?.type,
    job?.work_setup,
  ]);

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

  const handleRightClick = () => {
    setArrSlider2([...arrSlider2.slice(1), ...arrSlider2.slice(0, 1)]);
  };
  const handleLeftClick = () => {
    setArrSlider2([
      ...arrSlider2.slice(arrSlider2.length - 1),
      ...arrSlider2.slice(0, arrSlider2.length - 1),
    ]);
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
        padding={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          component="img"
          sx={{
            height: 40,
            width: 40,
            maxHeight: { xs: 40 },
            maxWidth: { xs: 40 },
            ml: 2,
          }}
          alt="job_logo"
          src={job?.profile_url !== "No URL" ? job?.profile_url : job_logo}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
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
            <SmallButton color="lightGreenButton300" label={job?.stage?.name} />
          )}
          <TrackButton job={job} />
          {/*<Box
          sx={{
            height: 43,
            width: 43,
            maxHeight: { xs: 43 },
            maxWidth: { xs: 43 },
            borderRadius: "6px",
            background: theme.palette.purpleButton300.main,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 8px",
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
          />
        </Box>
        {isStar ? (
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
          />
        )}*/}
        </Box>
      </Grid>

      <Grid marginLeft={1} marginRight={1}>
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

        <Tooltip
          arrow
          // TransitionComponent={"Fade"}
          // TransitionProps={{ timeout: 600 }}
          title={job?.title}
          placement="top"
        >
          <Link
            to={`/candidate/job-detail/${`${
              job?.town?.name + " " + job?.town?.region?.name
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

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 12,
            marginBottom: "4px",
            letterSpacing: "0.25px",
          }}
        >
          R{formatCurrencyWithCommas(job?.salary?.max)} per month
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
        </Box>

        <Box
          minHeight={25}
          sx={
            job?.industry_jobs.length <= 1 &&
            job?.type !== "" &&
            job?.work_setup !== ""
              ? {
                  width: "100%",
                  display: "flex",
                }
              : {
                  width: "100%",
                  display: "flex",
                  overflow: "hidden",
                }
          }
        >
          {arrSlider
            .filter((item) => item !== null || item?.industry?.name !== null)
            .map((item, index) => {
              if (item !== "") {
                return (
                  <SmallButton
                    color={
                      item?.industry?.name
                        ? "blueButton600"
                        : item === ""
                        ? ""
                        : "blueButton700"
                    }
                    height={25}
                    // label={item?.industry ? item?.industry?.name : item}
                    value={item?.industry?.name}
                    label={
                      item?.industry
                        ? item?.industry?.name?.split(" ")[0]
                        : item
                    }
                    mr="4px"
                  />
                );
              }
            })}
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
            // letterSpacing="0.25px"
            className="preview"
            m={0}
            p={0}
            dangerouslySetInnerHTML={createMarkup(job?.description)}
          ></Box>
        </TextWrapper>
      </Grid>
      <Grid
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
      </Grid>
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
        spacing={2}
        padding="0 16px 8px 16px"
        justifyContent="center"
        alignItems="center"
      >
        <Box sx={{ width: "60%" }}>
          <SelectMenu
            name="candidate_status"
            // defaultValue={`my status: ${job?.candidate_status}`}
            value={`my status: ${job?.candidate_status}`}
            onHandleChange={handleCandidateStatus}
            options={myStatus.filter((status) => status.id !== 1111)}
            sx={{
              width: "94%",
              // color: theme.palette.base.main,
              backgroundColor:
                (job?.candidate_status == "pending" &&
                  theme.status.pending.main) ||
                (job?.candidate_status == "i like this" &&
                  theme.status.ilikethis.main) ||
                (job?.candidate_status == "i love this" &&
                  theme.status.ilovethis.main) ||
                (job?.candidate_status == "not for me" &&
                  theme.status.notforme.main),
              "& .css-1g66942-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root":
                {
                  color: theme.palette.base.main,
                },
            }}
          />
        </Box>
        <Box sx={{ width: "40%", padding: 0 }}>
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
        </Box>
      </Grid>
    </CustomCard>
  );
}
