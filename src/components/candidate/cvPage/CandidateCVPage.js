import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import profile from "../../../assets/profile.png";
import PlaceIcon from "@mui/icons-material/Place";
import SmallButton from "../../common/SmallButton";
import ManIcon from "@mui/icons-material/Man";
import linkedin from "../../../assets/linkedin.svg";
import match from "../../../assets/Match 1.svg";
import { useTheme } from "@emotion/react";
import locale from "../../../i18n/locale";
import SingleRadialChart from "../../common/SingleRadialChart";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import StyledButton from "../../common/StyledButton";
import { CV_STEPS } from "../../../utils/Constants";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  convertDOB,
  monthYear,
  weekConvert,
  yearConverter,
} from "../../../utils/DateTime";
import { getCandidateCV } from "../../../redux/employer/myJobsSlice";
import { useDispatch } from "react-redux";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import { formatCurrencyWithCommas } from "../../../utils/Currency";

const label = "grit score";

export default function CandidateCVPage({ changeStep }) {
  const theme = useTheme();
  const i18n = locale.en;
  const dispatch = useDispatch();
  const { id } = useParams();

  const [isHovered, setIsHovered] = useState(false);
  const [stateData, setStateData] = useState([]);

  const handleLinkedin = () => {
    const linked = stateData?.candidate_profile?.linkedin_profile_link;
    window.open(linked, "_blank");
  };

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  const handleCandidateCV = async () => {
    try {
      const user = {
        user_id: id !== undefined ? id : decodedToken?.data?.user_id,
      };

      const { payload } = await dispatch(getCandidateCV(user));

      if (payload?.status == "success") {
        setStateData(payload.data);
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

  useEffect(() => {
    handleCandidateCV();
  }, []);

  return (
    <Box
      sx={{
        padding: "20px",
      }}
      height={"100%"}
      maxWidth={"750px"}
      margin="auto"
    >
      <Box
        sx={{
          display: "flex",
          border: "1px solid rgba(0, 0, 0, 0.3)",
          padding: "20px",
          borderRadius: "10px",
        }}
        height={"100%"}
      >
        <Box
          sx={{
            width: "315px",
            // border: "1px solid rgba(0, 0, 0, 0.3)",
            padding: "20px",
            borderRadius: "10px",
            gap: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#E0E0E080",
          }}
          mr={2}
        >
          <Box
            component="img"
            className="profileAvatar"
            alt="crayon logo"
            src={
              stateData.profile_url != "No URL"
                ? stateData.profile_url
                : profile
            }
            sx={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              display: "block",
              margin: "auto",
            }}
          />

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mr: 1,
                width: "150px",
                whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides any overflowing content
                textOverflow: "ellipsis", // Adds dots at the end of overflowing text
              }}
            >
              {stateData?.first_name} {stateData?.last_name}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                mr: 1,
                mt: -1,
                width: "200px",
                whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides any overflowing content
                textOverflow: "ellipsis", // Adds dots at the end of overflowing text
              }}
            >
              {stateData?.candidate_profile?.candidate_info?.job_title?.title}
            </Typography>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // marginBottom: "12px",
              }}
            >
              <IconButton
                sx={{
                  padding: 0,
                }}
                color="redButton100"
                aria-label="search job"
                component="button"
              >
                <PlaceIcon fontSize="small" />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: "0.25px",
                }}
              >
                {stateData?.candidate_profile?.town?.name},{" "}
                {stateData?.candidate_profile?.town?.region?.name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // marginBottom: "12px",
              }}
            >
              <IconButton
                sx={{
                  padding: 0,
                }}
                color="redButton100"
                aria-label="search job"
                component="button"
              >
                <PlaceIcon fontSize="small" />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: "0.25px",
                }}
              >
                {stateData?.candidate_profile?.candidate_info?.experience?.year}{" "}
                years
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // marginBottom: "12px",
              }}
            >
              <IconButton
                sx={{
                  padding: 0,
                }}
                color="redButton100"
                aria-label="search job"
                component="button"
              >
                <PlaceIcon fontSize="small" />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: "0.25px",
                }}
              >
                {
                  stateData?.candidate_profile?.candidate_info?.salary?.currency
                    ?.symbol
                }
                {stateData?.candidate_profile?.candidate_info?.salary?.min} -
                {
                  stateData?.candidate_profile?.candidate_info?.salary?.currency
                    ?.symbol
                }
                {formatCurrencyWithCommas(
                  stateData?.candidate_profile?.candidate_info?.salary?.max
                )}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // marginBottom: "12px",
              }}
            >
              <IconButton
                sx={{
                  padding: 0,
                }}
                color="redButton100"
                aria-label="search job"
                component="button"
              >
                <PlaceIcon fontSize="small" />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: "0.25px",
                }}
              >
                {stateData?.candidate_profile?.candidate_info?.notice_period
                  ?.description != undefined &&
                  weekConvert(
                    stateData?.candidate_profile?.candidate_info?.notice_period
                      ?.description
                  )}
                days
              </Typography>
            </Box>
          </Box>

          <Box>
            <SmallButton
              color="blueButton700"
              height={25}
              letterSpacing="0"
              p="8px"
              label={
                stateData?.candidate_profile?.candidate_info?.employment_type
              }
              mr="8px"
            />
            <SmallButton
              color="blueButton700"
              height={25}
              letterSpacing="0"
              p="8px"
              label={stateData?.candidate_profile?.candidate_info?.work_setup}
              mr="8px"
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  mr: 1,
                  fontSize: "15px",
                  whiteSpace: "nowrap", // Prevents text from wrapping
                  overflow: "hidden", // Hides any overflowing content
                  textOverflow: "ellipsis", // Adds dots at the end of overflowing text
                }}
              >
                About Me
              </Typography>
              <IconButton sx={{ padding: "0 !important" }}>
                <ManIcon color="blueButton400"></ManIcon>
              </IconButton>
              <SmallButton
                color="black100"
                borderRadius="5px"
                label={`${convertDOB(stateData?.candidate_profile?.dob)} yrs`}
                opacity="0.75"
                fontSize={10}
                height={18}
                padding="0 4px"
                alignItems="end"
              ></SmallButton>
            </Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 400,
                mr: 1,
                minHeight: "100px",
                width: "270px",
                // whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides any overflowing content
                textOverflow: "ellipsis", // Adds dots at the end of overflowing text
              }}
            >
              {stateData?.candidate_profile?.my_bio}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                mr: 1,
                fontSize: "15px",
                whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides any overflowing content
                textOverflow: "ellipsis", // Adds dots at the end of overflowing text
              }}
            >
              Contact
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 400,
                mr: 1,
              }}
            >
              {stateData?.email}
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 400,
                mr: 1,
                width: "150px",
                whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides any overflowing content
                textOverflow: "ellipsis", // Adds dots at the end of overflowing text
              }}
            >
              {stateData?.candidate_profile?.contact_no}
            </Typography>
            <Box
              component="img"
              className="profileAvatar"
              alt="crayon logo"
              src={linkedin}
              sx={{
                mr: 1,
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
              onClick={handleLinkedin}
            />

            <Box
              component="img"
              sx={{
                mr: 1,
                width: "20px",
                height: "20px",
              }}
              alt="match"
              src={match}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                mr: 1,
                fontSize: "15px",
                whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides any overflowing content
                textOverflow: "ellipsis", // Adds dots at the end of overflowing text
              }}
            >
              Nationality(ies)
            </Typography>
            {stateData?.candidate_profile?.candidate_nationalities.map(
              (item) => {
                return (
                  <SmallButton
                    minWidth="10px"
                    height={18}
                    color="grayButton"
                    borderRadius="5px"
                    label={item?.nationality?.nationali}
                    mr="4px"
                  ></SmallButton>
                );
              }
            )}
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                mr: 1,
                fontSize: "15px",
                whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides any overflowing content
                textOverflow: "ellipsis", // Adds dots at the end of overflowing text
              }}
            >
              Skills
            </Typography>
            {stateData?.candidate_profile?.tag_users.map((item) => {
              return (
                <SmallButton
                  color="orangeButton"
                  letterSpacing="-0.02em"
                  borderRadius="5px"
                  label={item?.tag?.tag}
                  mr="8px"
                ></SmallButton>
              );
            })}
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                mr: 1,
                fontSize: "15px",
                whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides any overflowing content
                textOverflow: "ellipsis", // Adds dots at the end of overflowing text
              }}
            >
              Preferred industries
            </Typography>
            {stateData?.candidate_profile?.industry_users.map((item) => {
              return (
                <SmallButton
                  minWidth="10px"
                  height={18}
                  color="blueButton600"
                  borderRadius="5px"
                  label={item?.industry?.name}
                  mr="4px"
                ></SmallButton>
              );
            })}
          </Box>
        </Box>

        <Box
          sx={{
            width: "70%",
            padding: "20px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              mr: 1,
              textAlign: "center",
              whiteSpace: "nowrap", // Prevents text from wrapping
              overflow: "hidden", // Hides any overflowing content
              textOverflow: "ellipsis", // Adds dots at the end of overflowing text
            }}
          >
            Curriculum Vitae
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mr: 1,
              }}
            >
              {i18n["allTalent.workHistory"]}
            </Typography>
            {stateData?.candidate_profile?.employer_histories.map((item) => {
              return (
                <>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        mr: 1,
                      }}
                    >
                      {item.name},{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 400,
                        mr: 1,
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", width: "90%" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        mr: "4px",
                        marginBottom: "4px",
                        minWidth: "fit-content",
                      }}
                    >
                      {monthYear(item?.start_date)} -{" "}
                      {monthYear(item?.end_date)}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 400,
                      mr: 1,
                      fontStyle: "italic",
                      mb: 1,
                    }}
                  >
                    {item.clients_worked_on_awards}
                  </Typography>
                </>
              );
            })}
          </Box>
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.grayButton200.main}`,
              width: "inherit",
              marginBottom: "9px",
            }}
          ></Box>

          <Box sx={{ mt: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mr: 1,
              }}
            >
              Educational History
            </Typography>
            {stateData?.candidate_profile?.qualification_users.map((item) => {
              return (
                <>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        mr: 1,
                      }}
                    >
                      {item?.institution?.name},{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 400,
                        mr: 1,
                      }}
                    >
                      {item?.qualification?.name}
                    </Typography>
                  </Box>{" "}
                  <Box sx={{ display: "flex", width: "90%" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        mr: "4px",
                        marginBottom: "4px",
                        minWidth: "fit-content",
                      }}
                    >
                      Completed: {yearConverter(item?.year_ended)}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 400,
                      mr: 1,
                      mb: 1,
                    }}
                  >
                    Type: {item?.qualification_type?.name}
                  </Typography>
                </>
              );
            })}
          </Box>
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.grayButton200.main}`,
              width: "inherit",
              marginBottom: "9px",
            }}
          ></Box>

          <Box sx={{ mt: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mr: 1,
              }}
            >
              Professional Associations
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  mr: 1,
                  mb: 0,
                }}
                paragraph
              >
                {stateData?.association?.name}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 400,
                  mr: 1,
                  mb: 1,
                }}
              >
                Accredited: {yearConverter(stateData?.association_year_end)}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.grayButton200.main}`,
              width: "inherit",
              marginBottom: "9px",
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mr: 1,
                }}
              >
                {i18n["allTalent.personality"]}
              </Typography>

              <Box
                sx={{
                  mb: 1,
                }}
              >
                {stateData?.candidate_profile?.candidate_info?.primary?.name !=
                  null && (
                  <SmallButton
                    fontWeight={500}
                    minWidth="10px"
                    height={25}
                    color="purpleButton"
                    borderRadius="5px"
                    label={
                      stateData?.candidate_profile?.candidate_info?.primary
                        ?.name
                    }
                    mr="4px"
                  ></SmallButton>
                )}

                {stateData?.candidate_profile?.candidate_info?.shadow?.name !=
                  null && (
                  <SmallButton
                    fontWeight={500}
                    minWidth="10px"
                    height={25}
                    color="brownButton"
                    borderRadius="5px"
                    label={
                      stateData?.candidate_profile?.candidate_info?.shadow?.name
                    }
                    mr="4px"
                  ></SmallButton>
                )}
              </Box>
            </Box>
            <Box>
              <SingleRadialChart
                hollow="55%"
                labelsData={label}
                series={
                  stateData?.candidate_profile?.candidate_info?.grit_score !=
                    null && [
                    stateData?.candidate_profile?.candidate_info?.grit_score,
                  ]
                }
                width={120}
                nameSize="9px"
                valueSize="14px"
                nameOffsetY="11"
                valueOffsetY="-17"
                color={theme.palette.lightGreenButton300.main}
                index={1}
                isHovered={isHovered}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {stateData?.candidate_profile?.candidate_traits?.length > 0 &&
              stateData?.candidate_profile?.candidate_traits.map((item) => {
                return (
                  <SmallButton
                    fontWeight={500}
                    minWidth="10px"
                    textColor={theme.palette.black100.main}
                    height={25}
                    color="grayButton200"
                    borderRadius="5px"
                    label={item?.trait?.name}
                  ></SmallButton>
                );
              })}
          </Box>
        </Box>
      </Box>
      {id === undefined && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 5,
          }}
        >
          <StyledButton
            startIcon={<ArrowBackIosIcon />}
            variant="outlined"
            color="redButton100"
            onClick={() => {
              changeStep(3);
            }}
          >
            {CV_STEPS[2]}
          </StyledButton>
        </Box>
      )}
    </Box>
  );
}
