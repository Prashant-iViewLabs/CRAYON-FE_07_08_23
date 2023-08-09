import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import job_volume from "../../../assets/job_volume.svg";
import job_star from "../../../assets/job_star.svg";
import job_star_selected from "../../../assets/job_star_selected.svg";
import job_exp from "../../../assets/job_exp.png";
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
import ButtonMenu from "./ButtonMenu";
import TextWrapper from "../../common/TextWrapper";
import {
  convertDatetimeAgo,
  dateConverterMonth,
} from "../../../utils/DateTime";
import { Tooltip } from "@mui/material";
import ManageButtonMenu from "./ManageButtonMenu";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { formatCurrencyWithCommas } from "../../../utils/Currency";
import {
  AccountBalanceWallet,
  CalendarMonth,
  NavigateBefore,
  Circle
} from "@mui/icons-material";
import TrackButton from "../../candidate/myJobs/TrackButton";
import Slider from "../../common/Slider";

import profile_challenger from "../../../assets/Profile Icons_Challenger.svg";
import profile_character from "../../../assets/Profile Icons_Charater.svg";
import profile_collaborator from "../../../assets/Profile Icons_Collaborator.svg";
import profile_contemplator from "../../../assets/Profile Icons_Contemplator.svg";
import GroupsIcon from '@mui/icons-material/Groups';
import Slider2 from "../../common/Slider2";


export default function MyJobsCard({ index, job, setisFlipped }) {
  const i18n = locale.en;
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isStar, setIsStarSelected] = useState(false);

  const [arrSlider, setArrSlider] = useState([
    job?.industry[0],
    job?.type,
    job?.work_setup,
  ]);


  // const Tools = job?.job_tools.map(tool => tool.tool.name)
  const Traits = job?.traits.map(trait => trait.trait_name)


  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

  const handleStar = () => {
    setIsStarSelected(!isStar);
  };
  return (
    <CustomCard
      handleMouseEnter={() => setIsHovered(true)}
      handleMouseLeave={() => setIsHovered(false)}
    >
      <Grid
        container
        // padding={1}
        justifyContent="space-between"
        // alignItems="center"
        overflow={"hidden"}
        sx={{
          borderRadius: "25px 25px 0 0",
          // gap: 3,
        }}
      >
        {job?.role_type_id === 1 || job?.role_type_id === 2 ? (
          <ButtonMenu jobId={job?.job_id} disabledButton={false} />
        ) : (
          <ButtonMenu jobId={job?.job_id} disabledButton={true} />
        )}
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
              paddingTop: 1,
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
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
              {job?.stageName && (
                <SmallButton color="lightGreenButton300" label={job?.stageName} />
              )}
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
            <TrackButton />
            <Typography sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "Bold",
              fontSize: "0.9rem"
            }}>{job?.jobStatusName || "Status"} <Circle fontSize="string" color={job?.jobStatusName === "active" ? "success" : "warning"} /></Typography>

          </Box>
          {/* <Box
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
                  onClick={handleStar}
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
                  onClick={handleStar}
                />
              )} */}
        </Box>
      </Grid>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "270px",
        }}
      >
        <Grid marginLeft={1} marginRight={1} sx={{
          flexGrow: 1
        }}>


          <Tooltip
            arrow
            // TransitionComponent={"Fade"}
            // TransitionProps={{ timeout: 600 }}
            title={job?.title}
            placement="top"
          >
            <Link
              to={`/employer/job-detail/${`${job?.town?.name + " " + job?.town?.region?.name
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
                {job?.currencySymbol}
                {formatCurrencyWithCommas(job?.salaryMax)} per month
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
                {job?.townName}, {job?.townRegionName}
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
                {job?.experiance} years Experience
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
            <Slider2 items={["full time", "accounts", "sales", "Numbers", "Credit"]} color={"yellowButton200"} hideTagsAfter={3} />
            <Slider2 items={["xero", "excel", "SAP", "Pastal"]} color={"yellowButton100"} hideTagsAfter={4}/>
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
      {/* <Grid
        container
        spacing={2}
        padding="0 8px 8px 0px"
        sx={
          arrSlider2?.length >= 4
            ? { justifyContent: "space-evenly", alignItems: "center" }
            : { ml: 2 }
        }
        minHeight={33}
      >
        {arrSlider2?.length >= 4 ? (
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
            job?.traits?.length <= 1 &&
              job?.primaryName != "" &&
              job?.shadowName != ""
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
              if (
                item !== undefined &&
                item.trait_name !== null &&
                item !== null
              ) {
                return (
                  <SmallButton
                    color={
                      item?.trait_name
                        ? "grayButton200"
                        : index == 1
                          ? "brownButton"
                          : "purpleButton"
                    }
                    height={25}
                    label={item?.trait_name ? item?.trait_name : item}
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
        alignItems={"center"}
      >
        <Box sx={{ margin: "0 -22px 0 -22px" }}>
          <SingleRadialChart
            labelsData={"Grit Score"}
            series={[job?.TotalUserCount]}
            width={140}
            color={theme.palette.chart.red}
            index={index}
            isHovered={isHovered}
          />
        </Box>
        {job?.primaryName && (
          <Box
            component="img"
            height={90}
            // sx={{ margin: "0 -22px 0 -22px" }}
            alt="job_exp"
            src={
              (job?.primaryName === "collaborator" && profile_collaborator) ||
              (job?.primaryName === "challenger" && profile_challenger) ||
              (job?.primaryName === "character" && profile_character) ||
              (job?.primaryName === "contemplator" && profile_contemplator)
            }
          />
        )}
        {job?.shadowName && (
          <Box
            component="img"
            height={90}
            // sx={{ margin: "0 -22px 0 -22px" }}
            alt="job_exp"
            src={
              (job?.shadowName === "collaborator" && profile_collaborator) ||
              (job?.shadowName === "challenger" && profile_challenger) ||
              (job?.shadowName === "character" && profile_character) ||
              (job?.shadowName === "contemplator" && profile_contemplator)
            }
          />
        )}
        {/* <Box sx={{ margin: "0 -22px 0 -22px" }}>
          <SingleRadialChart
            labelsData={label3}
            series={[job?.totaluserinterviewed]}
            width={140}
            color={theme.palette.chart.yellow}
            index={index}
            isHovered={isHovered}
          />
        </Box> */}
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
        {/* <Box sx={{ width: "66%", paddingRight: "10px" }}> */}

        {/* </Box> */}

        <Box sx={{ width: "33.33%" }}>
          <ManageButtonMenu job={job} />
        </Box>
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
        <Box sx={{ width: "33.33%" }}>
          <Link
            to={`/employer/manage-talent/${job?.job_id}`}
            target="_blank"
            style={{
              textDecoration: "none",
            }}
          >
            <Button
              sx={{
                boxShadow: 0,
                fontSize: "12px",
                width: "100%",
                height: "50px",
                borderRadius: 0
              }}
              variant="contained"
              color="redButton100"
              startIcon={<GroupsIcon />}
            // onClick={() => showManageJob()}
            >
              {i18n["manageJob.talentBtn"]}
            </Button>
          </Link>
        </Box>
      </Grid>
    </CustomCard>
  );
}
