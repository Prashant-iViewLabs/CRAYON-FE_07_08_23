import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import locale from "../../../i18n/locale";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import SmallButton from "../../common/SmallButton";
import profile from "../../../assets/profile.png";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LanguageIcon from "@mui/icons-material/Language";
import { InputBase, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import eye from "../../../assets/eye.svg";
import send from "../../../assets/send.svg";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import SingleRadialChart from "../../common/SingleRadialChart";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import DOMPurify from "dompurify";
import {
  addJobComment,
  approveJob,
  getAllComments,
} from "../../../redux/admin/jobsSlice";
import { useDispatch } from "react-redux";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE } from "../../../utils/Constants";
import {
  convertDatetimeAgo,
  dateConverter,
  dateConverterMonth,
} from "../../../utils/DateTime";
import { Link, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { formatCurrencyWithCommas } from "../../../utils/Currency";
import ChangeStatusButton from "./ChangeStatusButton";
import InfiniteScroll from "react-infinite-scroll-component";
import { uploadSpecData } from "../../../redux/employer/postJobSlice";

const label = "grit score";
const label1 = "applied";
const label2 = "shortlisted";
const label3 = "interviewed";

const StyledHR = styled(Box)(({ theme }) => ({
  borderRight: "1px solid rgba(0, 0, 0, 0.3)",
  width: "0px",
  height: "10px",
  marginRight: "8px",
}));
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginTop: "4px",
  borderRadius: "10px",
  position: "unset",
  "& .MuiAccordionSummary-root": {
    // alignItems: 'start'
    flexDirection: "row-reverse",
    // marginBottom: '4px'
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: "0 0 8px 0",
  },
  "& .MuiAccordionSummary-content": {
    flexDirection: "column",
    margin: 0,
    ".summaryBox": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      // marginRight: '8px',
      "& .MuiButtonBase-root": {
        letterSpacing: "-0.02em",
        // fontSize: 10,
        // fontWeight: 700,
        // minWidth: 28,
        // padding: '2px 8px',
        // borderRadius: 3,
        // height: '20px',
        // boxShadow: 'none'
      },
    },
    ".summaryBoxContent": {
      display: "flex",
      alignItems: "center",
    },
    ".profileAvatar": {
      height: 20,
      width: 20,
      borderRadius: 6,
    },

    "& .MuiTypography-root": {
      // fontWeight: 700,
      // fontSize: '20px',
    },
    "& .MuiButtonBase-root": {
      // padding: '2px 8px',
      // fontSize: 10,
      // fontWeight: 700,
      // minWidth: 30,
      // boxShadow: 'none',
      // borderRadius: 2
    },
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: theme.palette.white,
    background: theme.palette.redButton.main,
    width: 23.42,
    height: 23.71,
    borderRadius: 25,
    marginLeft: "-5px",
    marginRight: "20px",
    justifyContent: "center",
    alignItems: "center",

    // marginRight: '32px',
    // position: 'absolute',
    // right: '40px',
    // top: '12px',
    "& .MuiSvgIcon-root": {
      fontSize: "1.4rem",
    },
  },
  "& .MuiCollapse-root": {
    "& .MuiAccordionDetails-root": {
      display: "flex",
      paddingTop: 0,
      // padding: 0,
      "& .MuiButtonBase-root": {
        // padding: '0 8px',
        // fontSize: 10,
        // fontWeight: 700,
        // minWidth: 30,
        // padding: '1px 4px',
        // borderRadius: 3
      },
      ".contentBoxLeft": {
        width: "60%",
        // display: 'flex',
        // justifyContent: 'space-between',
        "& .MuiButtonBase-root": {
          padding: "0 8px",
          // fontSize: 10,
          // fontWeight: 700,
          // minWidth: 10,
          // padding: '1px 4px',
          // borderRadius: 3
        },
        // '& .MuiSvgIcon-root': {
        //     width: '20px'
        // }
      },
      ".contentBoxRight": {
        width: "37%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& .MuiButtonBase-root": {
          padding: "0 8px",
          // fontSize: 10,
          // fontWeight: 700,
          // minWidth: 10,
          // padding: '1px 4px',
          // borderRadius: 3
        },
        ".title": {
          fontSize: "12px",
          fontWeight: 700,
        },
        ".subTitle": {
          fontSize: "12px",
          fontWeight: 400,
        },
      },
    },
  },
  "& .MuiButtonBase-root": {
    // boxShadow: 'none',
    // padding: '0 16px'
  },
}));

const StyledTextField = styled(OutlinedInput)(({ theme }) => ({
  width: "100%",
  margin: "8px 0",
  paddingRight: "8px",
  // paddingLeft: '16px',
  // '& .MuiInputLabel-outlined': {
  // marginLeft: '4px',
  // color: theme.palette.placeholder
  // opacity: 0.75
  // },
  "& .MuiOutlinedInput-notchedOutline": {
    // background: theme.palette.white,
    borderColor: theme.palette.grayBorder,
    borderRadius: "10px",
  },
}));

export default function JobCard({
  index,
  jobContent,
  getJobList,
  getComments,
  comments,
  setComments,
}) {
  const i18n = locale.en;
  const theme = useTheme();
  const dispatch = useDispatch();
  const fileAccept = "application/pdf, application/doc, application/docx";
  const hiddenFileInput = useRef(null);

  const [specName, setspecName] = useState("No file chosen");
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [expand, setExpand] = useState(false);

  const location = useLocation();
  const include = location.pathname.includes("pending-jobs");

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

  const toggleAcordion = () => {
    setExpand((prev) => !prev);
    !expand && getComments(jobContent?.job_id);
  };

  const handleApprove = async (job_id, employer_industries) => {
    let industry = employer_industries?.map((val) => val?.industry_id);
    let approvedJob = {
      job_id: job_id,
      industry_id: industry,
    };
    try {
      if (industry.length > 0) {
        const { payload } = await dispatch(approveJob(approvedJob));
        if (payload?.status == "success") {
          dispatch(
            setAlert({
              show: true,
              type: ALERT_TYPE.SUCCESS,
              msg: "Job Activated Successfully!",
            })
          );
          await getJobList("");
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
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: "Without the Industries you can't make this Job active.",
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: "Without the Industries you can't make this Job active.",
        })
      );
    }
  };

  const sendComment = async () => {
    try {
      console.log(inputValue);
      const comment = {
        job_id: jobContent?.job_id,
        comment: inputValue,
      };

      const latestComment = {
        comment: inputValue,
        created_at: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        user: {
          first_name: jobContent?.employer_profile?.user?.first_name,
          last_name: jobContent?.employer_profile?.user?.last_name,
        },
      };

      console.log(latestComment);
      comments.push(latestComment);

      const { payload } = await dispatch(addJobComment(comment));

      if (payload?.status == "success") {
        // setComments(payload?.data?.comment);
        setInputValue("");
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Comment Added Successfully!",
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
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: error,
        })
      );
    }
  };

  const handleFileClick = () => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = async (event) => {
    const formData = new FormData();
    formData.append("jobspec", event.target.files[0]);
    formData.append("job_id", jobContent?.job_id);
    try {
      const { payload } = await dispatch(uploadSpecData(formData));
      if (payload?.status == "success") {
        setspecName(event.target.files[0].name);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Spec uploaded Successfully!",
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

  return (
    <StyledAccordion expanded={expand}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon onClick={toggleAcordion} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Box className="summaryBox" sx={{ mb: "-8px" }}>
          <Box className="summaryBoxContent">
            <SmallButton
              color="orangeButton"
              borderRadius="5px"
              label={jobContent?.job_id}
              mr={1}
              fontSize={10}
              fontWeight={700}
              alignItems="end"
            ></SmallButton>
            <Box
              component="img"
              className="profileAvatar"
              alt="crayon logo"
              src={
                jobContent?.profile_url == "No URL"
                  ? profile
                  : jobContent?.profile_url
              }
              sx={{
                mr: 1,
              }}
            />
            <Tooltip title={jobContent?.title} placement="top-end">
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  mr: 1,
                }}
              >
                {jobContent?.title?.length >= 30
                  ? jobContent?.title?.slice(0, 30) + "..."
                  : jobContent?.title}
              </Typography>
            </Tooltip>
            <Tooltip
              title={jobContent?.employer_profile?.company_name}
              placement="top-end"
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 400,
                }}
              >
                {jobContent?.employer_profile?.company_name?.length >= 30
                  ? jobContent?.employer_profile?.company_name?.slice(0, 30) +
                    "..."
                  : jobContent?.employer_profile?.company_name}
              </Typography>
            </Tooltip>
            <SmallButton
              color="orangeButton"
              borderRadius="5px"
              label={"considering"}
              ml={1}
              mr={1}
              fontSize={10}
              fontWeight={700}
              alignItems="end"
            ></SmallButton>
          </Box>

          <Box className="summaryBoxContent">
            <SmallButton
              color="black100"
              borderRadius="5px"
              label={dateConverter(jobContent?.created_at)}
              mr="8px"
              height={18}
              opacity="0.5"
            ></SmallButton>
            <SmallButton
              color="black100"
              borderRadius="5px"
              label={convertDatetimeAgo(jobContent?.created_at)}
              mr="8px"
              height={18}
              opacity="0.5"
            ></SmallButton>
            <SmallButton
              // color="orangeButton"
              color={
                jobContent?.job_type == "crayon recruit"
                  ? "recruit100"
                  : "orangeButton"
              }
              borderRadius="5px"
              label={
                jobContent?.job_type == "crayon recruit" ? "recruit" : "lite"
              }
              mr={1}
              fontSize={10}
              fontWeight={700}
              alignItems="end"
            ></SmallButton>
            <Box
              component="img"
              className="profileAvatar"
              alt="employer logo"
              src={
                jobContent?.profile_url == "No URL"
                  ? profile
                  : jobContent?.profile_url
              }
              sx={{
                mr: 1,
              }}
            />
            <SmallButton
              color="recruit100"
              endIcon={<KeyboardArrowDownIcon />}
              height={24}
              fontWeight={700}
              label={jobContent?.employer_profile?.user?.first_name}
              borderRadius="25px"
              mr="8px"
            ></SmallButton>
            {/*
              {chips.map((chip, index) => (
              <SmallButton
                color={chip.color}
                key={index}
                label={chip.label}
                mr="8px"
              ></SmallButton>
            ))}  
            */}
            <Link
              to={`/employer/post-a-job/${jobContent?.job_id}`}
              target="_blank"
            >
              <IconButton
                aria-label="edit"
                color="blueButton400"
                sx={{
                  padding: "0 !important",
                  minWidth: "18px !important",
                  "& .MuiSvgIcon-root": {
                    width: "18px",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Link>
          </Box>
        </Box>

        <Box className="summaryBox" sx={{ mt: 1 }}>
          <Box className="summaryBoxContent">
            <IconButton
              color="redButton"
              aria-label="search job"
              component="button"
              sx={{
                padding: "0 !important",
                minWidth: "10px !important",
                marginRight: "8px",
                ".MuiSvgIcon-root": {
                  width: "15px",
                  height: "15px",
                },
              }}
            >
              <PlaceIcon />
            </IconButton>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                mr: 1,
              }}
            >
              {jobContent?.town?.name + ", " + jobContent?.town?.region?.name}
            </Typography>
            <StyledHR></StyledHR>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                mr: 1,
              }}
            >
              {jobContent?.salary?.currency?.symbol}
              {formatCurrencyWithCommas(jobContent?.salary?.max)}
            </Typography>
            <StyledHR></StyledHR>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                mr: 1,
              }}
            >
              {jobContent?.experience?.year}
              {"yrs"}
            </Typography>
            <StyledHR></StyledHR>
            <SmallButton
              color="blueButton700"
              label={jobContent?.type}
              mr="4px"
              fontSize="12px"
            ></SmallButton>
            <SmallButton
              color="blueButton700"
              label={jobContent?.work_setup}
              mr="8px"
              fontSize="12px"
            ></SmallButton>
            {jobContent?.employer_industries?.map((industry, index) => {
              if (index < 1) {
                return (
                  <SmallButton
                    color="blueButton600"
                    value={industry?.industry?.name}
                    label={industry?.industry?.name.split(" ")[0]}
                    mr="8px"
                    fontSize="12px"
                  ></SmallButton>
                );
              }
            })}
            {/* <SmallButton color="blueButton400" label={address} mr="8px"></SmallButton>
                        <SmallButton color="blueButton400" label={salary} mr="8px"></SmallButton>
                        <SmallButton color="blueButton400" label={experience} mr="8px"></SmallButton>
                        <SmallButton color="redButton" label={workType} mr="8px"></SmallButton>
                        <SmallButton color="redButton" label={jobType} mr="8px"></SmallButton> */}
          </Box>
          <Box className="summaryBoxContent">
            {jobContent?.job_status?.name === "pending" &&
              decodedToken?.data?.role_id === 1 && (
                <SmallButton
                  color="redButton"
                  startIconMargin="4px"
                  height={24}
                  fontWeight={700}
                  label={i18n["pendingJobs.approveJob"]}
                  mr="8px"
                  borderRadius="25px"
                  onClick={() =>
                    handleApprove(
                      jobContent?.job_id,
                      jobContent?.employer_industries
                    )
                  }
                ></SmallButton>
              )}
            <SmallButton
              color="redButton"
              startIcon={
                <Box component="img" className="eye" alt="eye logo" src={eye} />
              }
              startIconMargin="4px"
              height={24}
              fontWeight={700}
              label={i18n["pendingJobs.viewspec"]}
              mr="8px"
              borderRadius="25px"
            ></SmallButton>
            <SmallButton
              color="redButton"
              startIcon={
                <Box component="img" className="eye" alt="eye logo" src={eye} />
              }
              startIconMargin="4px"
              height={24}
              fontWeight={700}
              label={i18n["pendingJobs.copylink"]}
              mr="8px"
              borderRadius="25px"
            ></SmallButton>
            <IconButton>
              <PlayCircleFilledIcon color="grayButton300" />
            </IconButton>
            <ChangeStatusButton
              loggedInUser={decodedToken?.data?.role_id}
              jobId={index}
              jobStatus={jobContent?.job_status?.name}
            />

            <IconButton
              aria-label="edit"
              color="grayButton"
              sx={{
                padding: "0 !important",
                minWidth: "18px !important",
                "& .MuiSvgIcon-root": {
                  width: "18px",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <SmallButton
              color={"orangeButton"}
              borderRadius="5px"
              label={
                jobContent?.employer_profile?.user?.first_name +
                " " +
                jobContent?.employer_profile?.user?.last_name
              }
              mr={1}
              fontSize={10}
              fontWeight={700}
              alignItems="end"
            ></SmallButton>
            <IconButton
              aria-label="edit"
              color="grayButton"
              sx={{
                mr: "4px",
                padding: "0 !important",
                minWidth: "18px !important",
                "& .MuiSvgIcon-root": {
                  width: "18px",
                },
              }}
            >
              <EmailIcon />
            </IconButton>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                mr: 1,
                opacity: 0.75,
                letterSpacing: "0.75px",
              }}
            >
              {jobContent?.employer_profile?.user?.email}
            </Typography>
            <StyledHR></StyledHR>
            <IconButton
              aria-label="edit"
              color="grayButton"
              sx={{
                mr: "4px",
                padding: "0 !important",
                minWidth: "18px !important",
                "& .MuiSvgIcon-root": {
                  width: "18px",
                },
              }}
            >
              <CallIcon />
            </IconButton>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                mr: 1,
                opacity: 0.75,
                letterSpacing: "0.75px",
              }}
            >
              {jobContent?.employer_profile?.contact_no}
            </Typography>
            <StyledHR></StyledHR>
            <a
              href={jobContent?.employer_profile?.hyperlink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LanguageIcon color="grayButton" />
            </a>
          </Box>

          <Box className="summaryBoxContent">
            <input
              accept={fileAccept}
              ref={hiddenFileInput}
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <SmallButton
              color="redButton"
              startIcon={
                <Box component="img" className="eye" alt="eye logo" src={eye} />
              }
              startIconMargin="4px"
              height={24}
              fontWeight={700}
              label={i18n["pendingJobs.uploadedspec"]}
              mr="8px"
              borderRadius="25px"
              onClick={handleFileClick}
            ></SmallButton>
            <SmallButton
              color="redButton"
              startIcon={
                <Box component="img" className="eye" alt="eye logo" src={eye} />
              }
              startIconMargin="4px"
              height={24}
              fontWeight={700}
              label={i18n["pendingJobs.bookbriefing"]}
              mr="8px"
              borderRadius="25px"
            ></SmallButton>
            <SmallButton
              color="grayButton300"
              startIcon={
                <Box component="img" className="eye" alt="eye logo" src={eye} />
              }
              startIconMargin="4px"
              height={24}
              fontWeight={700}
              label={i18n["pendingJobs.viewbriefing"]}
              mr="8px"
              borderRadius="25px"
            ></SmallButton>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box className="contentBoxLeft">
            <Tooltip title={jobContent?.description} placement="top-end">
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  mr: 1,
                }}
              >
                <Box
                  // letterSpacing="0.25px"
                  className="preview"
                  m={0}
                  p={0}
                  dangerouslySetInnerHTML={createMarkup(
                    jobContent?.description?.slice(0, 500)
                  )}
                ></Box>
              </Typography>
            </Tooltip>
            <Box sx={{ mt: 1, mb: 2 }}>
              {jobContent?.job_tags?.map((val) => {
                return (
                  <SmallButton
                    color="orangeButton"
                    letterSpacing="-0.02em"
                    borderRadius="5px"
                    label={val?.tag?.tag}
                    mr="8px"
                  ></SmallButton>
                );
              })}
            </Box>
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    mr: 1,
                  }}
                >
                  {i18n["pendingJobs.industries"]}:
                </Typography>
                {jobContent?.employer_industries?.map((industry, index) => {
                  return (
                    <SmallButton
                      color="blueButton600"
                      value={industry?.industry?.name}
                      label={industry?.industry?.name.split(" ")[0]}
                      mr="8px"
                      fontSize="12px"
                    ></SmallButton>
                  );
                })}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    mr: 1,
                  }}
                >
                  {i18n["pendingJobs.tools"]}:
                </Typography>
                {jobContent?.job_tools?.map((val) => {
                  return (
                    <SmallButton
                      minWidth="10px"
                      height={18}
                      color="grayButton"
                      borderRadius="5px"
                      label={val?.tool?.name}
                      mr="4px"
                    ></SmallButton>
                  );
                })}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    mr: 1,
                  }}
                >
                  {i18n["pendingJobs.highestQualification"]}:
                </Typography>
                <SmallButton
                  minWidth="10px"
                  height={18}
                  color="grayButton"
                  borderRadius="5px"
                  label={jobContent?.HighestQual}
                  mr="4px"
                ></SmallButton>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    mr: 1,
                  }}
                >
                  {i18n["pendingJobs.qualifications"]}:
                </Typography>

                {jobContent?.job_qualifications?.map(
                  (qualifications, index) => {
                    return (
                      <SmallButton
                        minWidth="10px"
                        height={18}
                        color="grayButton"
                        borderRadius="5px"
                        label={
                          qualifications?.qualification?.name?.length >= 15
                            ? qualifications?.qualification?.name?.slice(0, 15)
                            : qualifications?.qualification?.name
                        }
                        mr="4px"
                      ></SmallButton>
                    );
                  }
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    mr: 1,
                  }}
                >
                  {i18n["pendingJobs.associations"]}:
                </Typography>
                <SmallButton
                  minWidth="10px"
                  height={18}
                  color="grayButton"
                  borderRadius="5px"
                  label="SAICA"
                  mr="4px"
                ></SmallButton>
              </Box>
              {/*<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    mr: 1,
                  }}
                >
                  {i18n["pendingJobs.languages"]}:
                </Typography>
                <SmallButton
                  minWidth="10px"
                  height={18}
                  color="grayButton"
                  borderRadius="5px"
                  label="English"
                  mr="4px"
                ></SmallButton>
                <SmallButton
                  minWidth="10px"
                  height={18}
                  color="grayButton"
                  borderRadius="5px"
                  label="Afrikaans"
                  mr="4px"
                ></SmallButton>
                <SmallButton
                  minWidth="10px"
                  height={18}
                  color="grayButton"
                  borderRadius="5px"
                  label="Spanish"
                  mr="4px"
                ></SmallButton>
              </Box>*/}
            </Box>
            <Box sx={{ mt: 1 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  mr: 1,
                }}
              >
                {i18n["pendingJobs.personality"]}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box sx={{ marginLeft: "-16px" }}>
                  <SingleRadialChart
                    hollow="55%"
                    labelsData={label}
                    series={
                      jobContent?.grit_score == null
                        ? [0]
                        : [jobContent?.grit_score]
                    }
                    width={86}
                    nameSize="9px"
                    valueSize="14px"
                    nameOffsetY="11"
                    valueOffsetY="-17"
                    color={theme.palette.lightGreenButton300.main}
                    index={1}
                    isHovered={isHovered}
                  />
                </Box>
                <Box>
                  <Box
                    sx={{
                      mb: 1,
                    }}
                  >
                    {jobContent?.primary != null && (
                      <SmallButton
                        fontWeight={500}
                        minWidth="10px"
                        height={25}
                        color="purpleButton"
                        borderRadius="5px"
                        label={jobContent?.primary?.name}
                        mr="4px"
                      ></SmallButton>
                    )}
                    {jobContent?.shadow != null && (
                      <SmallButton
                        fontWeight={500}
                        minWidth="10px"
                        height={25}
                        color="brownButton"
                        borderRadius="5px"
                        label={jobContent?.shadow?.name}
                        mr="4px"
                      ></SmallButton>
                    )}
                  </Box>
                  <Box>
                    {jobContent?.job_traits?.map((trait, index) => {
                      return (
                        <SmallButton
                          fontWeight={500}
                          minWidth="10px"
                          textColor={theme.palette.black100.main}
                          height={25}
                          color="grayButton200"
                          borderRadius="5px"
                          label={trait?.trait?.name}
                          mr="4px"
                        ></SmallButton>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  mr: 1,
                }}
              >
                {i18n["pendingJobs.jobquestions"]}
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ width: "90%" }}>
                  {jobContent?.job_questions.map((questions, index) => {
                    return (
                      <>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 400,
                            mr: 1,
                            mt: 1,
                          }}
                        >
                          Question #{index + 1}: {questions?.question}
                        </Typography>
                        <Paper
                          sx={{
                            display: "flex",
                            height: "30px",
                            borderRadius: "25px",
                            boxShadow: "none",
                            border: `1px solid ${theme.palette.grayBorder}`,
                          }}
                        >
                          <InputBase
                            sx={{ ml: 2, mr: 2 }}
                            id="password"
                            value={questions?.answer}
                            type="text"
                            placeholder={i18n["pendingJobs.answer"]}
                          />
                        </Paper>
                      </>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="contentBoxRight">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                mt: 6,
              }}
            >
              {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} > */}
              <Box>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ margin: "0" }}>
                    <SingleRadialChart
                      max={1000}
                      labelsData={label1}
                      series={[jobContent?.TotalUserCount]}
                      width={140}
                      color={theme.palette.chart.red}
                      index={index}
                      isHovered={isHovered}
                    />
                  </Box>
                  <Box sx={{ margin: "0" }}>
                    <SingleRadialChart
                      labelsData={label2}
                      series={[jobContent?.TotalUserShorlisted]}
                      width={140}
                      color={theme.palette.chart.green}
                      index={index}
                      isHovered={isHovered}
                    />
                  </Box>
                  <Box sx={{ margin: "0" }}>
                    <SingleRadialChart
                      labelsData={label3}
                      series={[jobContent?.TotalUserInterviewed]}
                      width={140}
                      color={theme.palette.chart.yellow}
                      index={index}
                      isHovered={isHovered}
                    />
                  </Box>
                </Box>
              </Box>

              {!include && (
                <Link
                  to={`/employer/manage-talent/${jobContent?.job_id}`}
                  target="_blank"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      sx={{
                        boxShadow: 0,
                        fontSize: "12px",
                        width: "90%",
                        height: "43px",
                      }}
                      variant="contained"
                      color="redButton"
                      // onClick={() => showManageJob()}
                    >
                      {i18n["pendingJobs.managebtn"]}
                    </Button>
                  </Box>
                </Link>
              )}
            </Box>
            <Box sx={{ mt: 4, width: "-webkit-fill-available" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  mr: 1,
                }}
              >
                {i18n["pendingJobs.comments"]}
              </Typography>
              <Box id="talentList" sx={{ overflow: "hidden", height: "160px" }}>
                <InfiniteScroll
                  style={{
                    height: "100%",
                    overflowX: "hidden",
                    scrollbarWidth: "thin",
                  }}
                  dataLength={comments !== undefined && comments?.length}
                  // next={() => getJobList(lastKey)}
                  hasMore={true}
                  scrollableTarget="talentList"
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                >
                  {comments?.map((comment) => {
                    return (
                      <Box sx={{ display: "flex", mt: 2 }}>
                        <Box
                          component="img"
                          className="profileAvatar"
                          alt="crayon logo"
                          src={profile}
                          sx={{
                            mr: 1,
                            width: 20,
                            height: 20,
                          }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 600,
                              mr: 1,
                            }}
                          >
                            {`${comment?.user?.first_name} ${comment?.user?.last_name}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 400,
                              mr: 1,
                            }}
                          >
                            {comment.comment}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: 400,
                              mr: 1,
                              color: theme.palette.grayButton.main,
                              textAlign: "end",
                            }}
                          >
                            {dateConverterMonth(comment.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                  <style>
                    {`.infinite-scroll-component::-webkit-scrollbar {
                      width: 7px !important;
                      background-color: #F5F5F5; /* Set the background color of the scrollbar */
                    }

                    .infinite-scroll-component__outerdiv {
                      height:100%
                    }

                    .infinite-scroll-component::-webkit-scrollbar-thumb {
                      background-color: #888c; /* Set the color of the scrollbar thumb */
                    }`}
                  </style>
                </InfiniteScroll>
              </Box>
              <Box sx={{ mt: 4 }}>
                {/* <StyledTextField placeholder="type your comment here..." id="comment" size="small" /> */}
                <StyledTextField
                  id="outlined-adornment-password"
                  type="text"
                  size="small"
                  placeholder="type your comment here..."
                  value={inputValue} // Set the value to the state variable
                  onChange={(e) => setInputValue(e.target.value)} // Update the state with the new input value
                  endAdornment={
                    <InputAdornment position="end">
                      <Box
                        component="img"
                        className="profileAvatar"
                        alt="crayon logo"
                        src={send}
                        sx={{
                          width: "30px",
                          // mr: 1
                          cursor: "pointer",
                        }}
                        onClick={sendComment}
                      />
                    </InputAdornment>
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </StyledAccordion>
  );
}
