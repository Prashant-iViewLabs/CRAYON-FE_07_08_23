import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import job_logo from "../../../assets/job_logo.svg";
import profile from "../../../assets/profile.png";
import job_volume from "../../../assets/job_volume.svg";
import job_star from "../../../assets/job_star.svg";
import job_star_selected from "../../../assets/job_star_selected.svg";
import job_exp from "../../../assets/job_exp.png";
import job_apply from "../../../assets/job_apply.svg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import { CARD_RIGHT_BUTTON_GROUP } from "../../../utils/Constants";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import SingleRadialChart from "../../common/SingleRadialChart";
import SmallButton from "../../common/SmallButton";
import CustomCard from "../../common/CustomCard";
import PlaceIcon from "@mui/icons-material/Place";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TextWrapper from "../../common/TextWrapper";
import { convertDatetimeAgo } from "../../../utils/DateTime";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { favouriteJob } from "../../../redux/guest/talentSlice";
import { Link } from "react-router-dom";
import { formatCurrencyWithCommas } from "../../../utils/Currency";

const label1 = "applications";
const label2 = "shortlisting";
const label3 = "interviews";
export default function TalentCard({ index, job }) {
  const i18n = locale.en;
  const dispatch = useDispatch();
  const theme = useTheme();
  const [colorKey, setColorKey] = useState("color");
  const [chartData1, setChartData1] = useState([job?.TotalUserCount]);
  const [chartData2, setChartData2] = useState([job?.TotalUserShorlisted]);
  const [chartData3, setChartData3] = useState([job?.TotalUserInterviewed]);
  const [isHovered, setIsHovered] = useState(false);
  const [isStar, setIsStarSelected] = useState(job?.favourite);

  const [arrSlider, setArrSlider] = useState([
    job?.candidate_profile?.industry_users[0],
    job?.candidate_profile?.candidate_info?.employment_type,
    job?.candidate_profile?.candidate_info?.work_setup,
  ]);

  const [arrSlider2, setArrSlider2] = useState([
    job?.candidate_profile?.candidate_info?.primary?.name,
    job?.candidate_profile?.candidate_info?.shadow?.name,
    ...(job?.candidate_profile?.candidate_traits || []),
  ]);

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  const handleRightClick = () => {
    setArrSlider2([...arrSlider2.slice(1), ...arrSlider2.slice(0, 1)]);
  };
  const handleLeftClick = () => {
    setArrSlider2([
      ...arrSlider2.slice(arrSlider2.length - 1),
      ...arrSlider2.slice(0, arrSlider2.length - 1),
    ]);
  };

  const handleHoverEnter = () => {
    setColorKey("hover");
  };
  const handleHoverLeave = () => {
    setColorKey("color");
  };
  const handleStar = async () => {
    setIsStarSelected(!isStar);
    decodedToken?.data?.role_id == 4 &&
      (await dispatch(favouriteJob({ reqid: job?.user_id })));
  };

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
        {job?.profile_url != "No URL" ? (
          <Box
            component="img"
            sx={{
              height: 40,
              width: 40,
              maxHeight: { xs: 40 },
              maxWidth: { xs: 40 },
              ml: 2,
            }}
            alt="profile"
            src={job?.profile_url}
          />
        ) : (
          <Box
            component="img"
            sx={{
              height: 40,
              width: 40,
              maxHeight: { xs: 40 },
              maxWidth: { xs: 40 },
              ml: 2,
            }}
            alt="profile"
            src={profile}
          />
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <SmallButton
            color="yellowButton100"
            label={job?.firstactivity}
            mr={1}
          />
          {job?.secondactivity && (
            <SmallButton
              color="lightGreenButton300"
              label={job?.secondactivity}
            />
          )}
          <Box
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
          )}
        </Box>
      </Grid>
      {/* <Grid container padding={0} justifyContent="space-between" alignItems="center">
                <Box sx={{ margin: '-20px 0 -14px -16px', }}>
                    <RadialChart labelsData={labels} series={chartData} width={250} index={index} isHovered={isHovered} />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginRight: '8px'
                }} onMouseEnter={handleHoverEnter}
                    onMouseLeave={handleHoverLeave}>
                    {CARD_RIGHT_BUTTON_GROUP.map((btn, index) => (
                        <SmallButton color={btn[colorKey]} key={index} label={btn.label} borderTopRightRadius={0}
                            borderBottomRightRadius={0} mb='4px' width={100} p={0} />
                    ))}
                </Box>
            </Grid> */}
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
        <Link
          to={`/candidate-cv/${job?.user_id}`}
          target="_blank"
          style={{
            textDecoration: "none",
            color: theme.palette.black,
          }}
        >
          <TextWrapper line={1} weight={700} size={20} minHeight={30}>
            {job?.first_name}
          </TextWrapper>
        </Link>
        <TextWrapper line={1} weight={700} size={20} minHeight={30}>
          {job?.candidate_profile?.candidate_info?.job_title?.title}
        </TextWrapper>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 12,
            marginBottom: "4px",
            letterSpacing: "0.25px",
          }}
        >
          {job?.Currency}
          {formatCurrencyWithCommas(
            job?.candidate_profile?.candidate_info?.salary?.max
          )}
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
            {job?.candidate_profile?.candidate_info?.experience?.year} years
            Experience
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
            {job?.candidate_profile?.town?.name},{" "}
            {job?.candidate_profile?.town?.region?.name}
          </Typography>
        </Box>
        {/*<Box sx={{ display: "flex", marginTop: "-5px" }}>
          <SmallButton
            color="blueButton600"
            height={25}
            label={i18n["talentCard.tech"]}
            mr="4px"
          />
          <SmallButton
            color="blueButton700"
            height={25}
            label={i18n["talentCard.fullTime"]}
            mr="4px"
          />
          <SmallButton
            color="blueButton700"
            height={25}
            label={i18n["talentCard.remote"]}
            mr="4px"
          />
          <SmallButton
            color="blueButton700"
            height={25}
            label="crayon recruit"
            mr="4px"
          />
          {/* <SmallButton color='blueButton700' height={25} minWidth={60} p={0} label={i18n['talentCard.fullTime']} mr='4px' />
                    <SmallButton color='blueButton700' height={25} minWidth={50} p={0} label={i18n['talentCard.remote']} mr='4px' /> */}
        {/* <Typography sx={{
                        fontWeight: 600,
                        fontSize: 12,
                        marginTop: '6px',
                        // lineHeight: '15px',
                        opacity: 0.75,
                    }} >
                        ..3more
                    </Typography> 
        </Box>*/}

        <Box
          sx={
            job?.candidate_profile?.industry_users.length <= 1 &&
            job?.candidate_profile?.candidate_info?.employment_type != "" &&
            job?.candidate_profile?.candidate_info?.work_setup != ""
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
            .filter((item) => item != null || item?.industry?.name != null)
            .map((item, index) => {
              if (item != "") {
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
          mt="12px"
          mb={1}
          color={theme.palette.black100}
          letterSpacing="0.25px"
        >
          {job?.candidate_profile?.my_bio}
        </TextWrapper>
      </Grid>

      <Grid
        container
        spacing={2}
        padding="0 8px 8px 0px"
        minHeight={45}
        sx={
          arrSlider2.length >= 5
            ? { justifyContent: "space-evenly", alignItems: "center" }
            : { ml: 2 }
        }
      >
        {arrSlider2.length >= 5 ? (
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
            job?.candidate_profile?.candidate_traits?.length <= 2 &&
            job?.candidate_profile?.candidate_info?.primary?.name != null &&
            job?.candidate_profile?.candidate_info?.shadow?.name != null
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
            .filter((item) => item != null)
            .map((item, index) => {
              if (item != undefined) {
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
        {arrSlider2.length >= 5 ? (
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
        padding="0 8px 8px 8px"
        justifyContent="center"
        alignItems="center"
      >
        <Box
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
        <Grid sx={{ width: "75%", padding: 0, ml: 1 }}>
          <Button
            sx={{
              boxShadow: 0,
              fontSize: "12px",
              width: "100%",
              height: "43px",
            }}
            variant="contained"
            color="redButton100"
          >
            {i18n["talentCard.shortlist"]}
          </Button>
        </Grid>
      </Grid>
    </CustomCard>
  );
}
