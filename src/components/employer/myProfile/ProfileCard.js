import { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import { uploadProfilePic } from "../../../redux/candidate/myProfileSlice";
import { setAlert, setLoading } from "../../../redux/configSlice";
import {
  ALERT_TYPE,
  EMP_PROFILE_STEPS,
  ERROR_MSG,
} from "../../../utils/Constants";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import { useTheme } from "@emotion/react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import getCroppedImg from "../../../utils/cropImage";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import companyLogo from "../../../assets/company_logo.svg";
import { getLocalStorage } from "../../../utils/Common";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Info from "./Info";
import CompanyInfo from "./CompanyInfo";
import ZoomOutIcon from "@mui/icons-material/Remove";
import ZoomInIcon from "@mui/icons-material/Add";
import Slider from "@mui/material/Slider";
import {
  createInfo,
  createCompInfo,
  getEmpProfile,
  getIndustries,
  getCompanies,
} from "../../../redux/employer/empProfileSlice";
import CustomDialog from "../../common/CustomDialog";
import Cropper from "react-easy-crop";

// 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginTop: "4px",
  width: "100%",
  borderRadius: "10px",
  position: "unset",
  boxShadow: "none",
  "& .MuiAccordionSummary-root": {
    padding: "16px 32px",
    cursor: "auto !important",
    boxShadow: "-1px 3px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    // marginBottom: "16px",
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: "0 0 8px 0",
  },
  "& .MuiAccordionSummary-content": {
    flexDirection: "column",
    margin: 0,
    ".companyLogo": {
      height: 73,
      width: 73,
      marginRight: "16px",
    },
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    position: "absolute",
    right: "24px",
    top: "24px",
    color: theme.palette.white,
    background: theme.palette.lightText,
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
    },
  },
  "& .MuiCollapse-root": {
    "& .MuiAccordionDetails-root": {
      display: "flex",
      paddingTop: 0,
      boxShadow: "-1px 3px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      "& .MuiTypography-root": {
        fontSize: "14px",
        fontWeight: 500,
        color: theme.palette.black,
        opacity: 0.87,
      },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  boxShadow: "-1px 3px 8px rgba(0, 0, 0, 0.1)",
  height: "32px",
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
  height: "5px",
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grayBorder,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      value == 100
        ? theme.palette.lightGreenButton300.main
        : theme.palette.redButton100.main,
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
      <Box sx={{ width: "100%", mr: 1 }}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

const componentNames = {
  info: Info,
  companyInfo: CompanyInfo,
};

const COMP_INFO = {
  company_name: "",
  hyperlink: "",
  notes: "",
  industry_ids: [],
};
const INFO = {
  first_name: "",
  surname: "",
  email: "",
  contact_no: "",
  region_id: "",
  gender: "",
  town_id: "",
  skinz: "",
};

const StyledButtonLeft = styled(Button)(({ theme }) => ({
  // marginRight: "24px",
  fontSize: "14px",
  width: "140px",
  border: `1px solid ${theme.palette.redButton100.main}`,
  "& .MuiSvgIcon-root": {
    fontSize: "16px",
  },
  borderRadius: "5px",
}));
export default function ProfileCard() {
  const i18n = locale.en;
  const theme = useTheme();
  const dispatch = useDispatch();
  const hiddenFileInput = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [currentCompIndex, setCurrentCompIndex] = useState(0);
  const [currentComp, setCurrentComp] = useState("info");
  const SomeComponent = componentNames[currentComp];
  const [image, setImage] = useState([]);
  const [imageName, setImageName] = useState("My pic");
  const [info, setInfo] = useState(INFO);
  const [compInfo, setCompInfo] = useState(COMP_INFO);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [companyName, setCompanyName] = useState("");

  const [openEditImage, setOpenEditImage] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [color, setColor] = useState("");
  const [displayD, setDisplayD] = useState("none");
  const [errors, setErrors] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [companies, setCompanies] = useState([]);

  const handleZoom = (direction) => {
    const step = 0.5;
    let newZoom = zoom;

    if (direction === "+") {
      newZoom = Math.min(zoom + step, 3); // Limit zoom to maximum 3x
    } else if (direction === "-") {
      newZoom = Math.max(zoom - step, 1); // Limit zoom to minimum 1x
    }

    setZoom(newZoom);
  };

  const getAllData = async () => {
    try {
      dispatch(setLoading(true));
      const industry = await dispatch(getIndustries());
      setIndustries(industry.payload.data);
      const company = await dispatch(getCompanies());
      setCompanies(company.payload.data);
      // setIndustries(addId(industry.payload.data, 'industry_id', 'name'))
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
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
    getAllData();
  }, []);

  const handleImageClick = (e) => {
    setImagePreview(null);
    hiddenFileInput.current.click();
  };

  const handleImageChange = async (event) => {
    setZoom(1);
    setImageName(event.target.files[0].name);
    const imageData = window.URL.createObjectURL(
      new Blob(event.target.files, { type: "application/*" })
    );
    setImagePreview(imageData);
    setOpenEditImage(true);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // const calProfileCompletion = (uploadedImage = []) => {
  //     const infokeys = Object.keys(info)
  //     const compInfoKeys = Object.keys(compInfo)
  //     const totalFields = Object.keys(info).length + Object.keys(compInfo).length + 1;
  //      console.log(totalFields)
  //     const completedInfo = infokeys.filter(item => info[item] != '').length
  //     const completedCompInfo = compInfoKeys.filter(item => compInfo[item] != '').length
  //     const imageUploaded = uploadedImage.length > 0 ? 1 : 0

  //     const completedFields = completedInfo + completedCompInfo + imageUploaded

  //     const percentage = (completedFields * 100) / totalFields
  //     setProfileCompletion(percentage)
  // }
  const handleImageEdit = useCallback(
    async (event) => {
      const croppedImage = await getCroppedImg(
        imagePreview,
        croppedAreaPixels,
        0
      );
      const formData = new FormData();
      const blobTofile = new File([croppedImage], imageName, {
        type: "image/jpeg",
      });

      formData.append("profile-pic", blobTofile);

      try {
        const { payload } = await dispatch(uploadProfilePic(formData));
        if (payload?.status == "success") {
          setImage(URL.createObjectURL(croppedImage));
          setOpenEditImage(false);
          dispatch(
            setAlert({
              show: true,
              type: ALERT_TYPE.SUCCESS,
              msg: "Profile pic uploaded Successfully!",
            })
          );
          // calProfileCompletion(croppedImage)
        } else {
          setImageName("My pic");
          dispatch(
            setAlert({
              show: true,
              type: ALERT_TYPE.ERROR,
              msg: payload?.message,
            })
          );
        }
      } catch (error) {
        setImageName("My pic");
        dispatch(setAlert({ show: true }));
      }
    },
    [croppedAreaPixels]
  );

  const getInfoData = (infoData) => {
    setInfo(infoData);
  };
  const getCompanyInfoData = (compInfoData) => {
    setCompInfo(compInfoData);
  };
  const getAllEmpData = async () => {
    try {
      const { payload } = await dispatch(getEmpProfile());
      if (payload?.status == "success") {
        if (typeof payload.data == "string") {
          setCompInfo({});
          setInfo({});
        } else {
          setImage(payload?.data.profile_url);
          setCompInfo(payload?.data);
          setInfo(payload?.data);
          setProfileCompletion(payload.data?.profile_completion_percentage);
        }
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

  useEffect(() => {
    getAllEmpData();
  }, []);

  const saveInfo = async () => {
    // calProfileCompletion()
    try {
      const { payload } = await dispatch(createInfo(info));
      if (payload?.status == "success") {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Profile updated successfully!",
          })
        );
        await getAllEmpData();
        setErrors([]);
        setCurrentComp("companyInfo");
        setColor("2");
        setCurrentCompIndex(currentCompIndex + 1);
      } else if (payload?.status == "error") {
        // console.log("PAYLOAD", payload);
        // payload?.message.map((message, index) => {
        //   dispatch(
        //     setAlert({
        //       show: true,
        //       type: ALERT_TYPE.ERROR,
        //       msg: message,
        //     })
        //   );
        // });
        setErrors(payload?.message);
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
      dispatch(setAlert({ show: true, type: ALERT_TYPE.ERROR, msg: error }));
    }
  };
  const saveCompInfo = async () => {
    // calProfileCompletion()
    try {
      const { payload } = await dispatch(createCompInfo(compInfo));
      if (payload?.status == "success") {
        const company = payload.data[0].company_name;
        setCompanyName(company);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Profile updated successfully!",
          })
        );
        await getAllEmpData();
        setErrors([]);
      } else if (payload?.status == "error") {
        setErrors(payload?.message);
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
  const handlePrev = () => {
    if (currentCompIndex == 1) {
      setCurrentComp("info");
      setColor("1");
    } else {
      setCurrentComp("companyInfo");
      setColor("2");
    }
    setCurrentCompIndex(currentCompIndex - 1);
  };
  const handleNext = () => {
    if (currentCompIndex == 0) {
      setCurrentComp("companyInfo");
      setColor("2");
    } else {
      setCurrentComp("info");
      setColor("1");
    }
    setCurrentCompIndex(currentCompIndex + 1);
  };

  const renderFooter = (
    <Box>
      <Button
        onClick={() => {
          setImageName("My pic");
          setOpenEditImage(false);
        }}
        disableElevation
        variant="outlined"
        color="redButton"
        sx={{ width: "130px", mr: 2 }}
      >
        {i18n["empMyProfile.cancel"]}
      </Button>
      <Button
        onClick={handleImageEdit}
        disableElevation
        variant="contained"
        color="redButton"
        sx={{ width: "130px" }}
      >
        {i18n["empMyProfile.upload"]}
      </Button>
    </Box>
  );

  // const handleAccordion = () => {
  //   setExpanded(!expanded);
  // };

  const handleUpdateProfile = () => {
    if (currentCompIndex == 0) {
      setColor("1");
    } else if (currentCompIndex == 1) {
      setColor("2");
    }
    setExpanded(true);
  };

  const handleCancelProfile = () => {
    setExpanded(false);
    // setCurrentCompIndex(null)
    // setCurrentComp("info")
    setColor("");
  };

  // useEffect(() => {
  //     calProfileCompletion()
  // }, [info,compInfo])

  const handleProfilePop = () => {
    if (displayD == "none") {
      // setExpanded(true)
      setDisplayD("block");
    } else {
      // setExpanded(false)
      setDisplayD("none");
    }
  };
  const handlePageChange = (test) => {
    if (test == "a") {
      setCurrentComp("info");
      setExpanded(true);
      setColor("1");
      setDisplayD("none");
      setCurrentCompIndex(0);
    } else if (test == "b") {
      setCurrentComp("companyInfo");
      setColor("2");
      setDisplayD("none");
      setCurrentCompIndex(1);
      setExpanded(true);
    } else if (test == "c") {
    } else if (test == "d") {
    }
    // setCurrentCompIndex(currentCompIndex + 1);
  };
  const func = (prop) => {
    if (prop == 1) {
      setCurrentComp("info");
      setExpanded(true);
      setColor("1");
      setDisplayD("none");
      setCurrentCompIndex(currentCompIndex - 1);
    } else if (prop == 2) {
      setCurrentComp("companyInfo");
      setColor("2");
      setDisplayD("none");
      setCurrentCompIndex(currentCompIndex + 1);
      setExpanded(true);
    }
  };
  const boxRef = useRef();

  // Function to handle clicks outside of the Box component
  const handleClickOutside = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setDisplayD("none");
    }
  };

  window.onclick = (e) => {
    if (
      e.target.className !== "profile-viewer-dropdown" &&
      e.target.id !== "profile-viewer-btn"
    ) {
      setDisplayD("none");
    }
  };

  useEffect(() => {
    // Add event listener to document body
    document.body.addEventListener("click", handleClickOutside);

    // Cleanup: Remove event listener when the component is unmounted
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: "column", width: "15%" }}>
        <StyledButtonLeft
          onClick={() => func("1")}
          variant={color == "1" ? "contained" : "outlined"}
          color="redButton100"
          sx={{ mb: 2 }}
        >
          {i18n["myProfile.myInfo"]}
        </StyledButtonLeft>
        <StyledButtonLeft
          onClick={() => func("2")}
          variant={color == "2" ? "contained" : "outlined"}
          color="redButton100"
          sx={{ mb: 2 }}
        >
          {i18n["myProfile.companyInfo"]}
        </StyledButtonLeft>
        <StyledButtonLeft
          //  onClick={()=>func("3")}
          variant={color == "3" ? "contained" : "outlined"}
          color="redButton100"
          disabled
        >
          {i18n["myProfile.myPlan"]}
        </StyledButtonLeft>
        <StyledButtonLeft
          //  onClick={()=>func("3")}
          variant={color == "4" ? "contained" : "outlined"}
          color="redButton100"
          sx={{ mt: 2 }}
          disabled
        >
          {i18n["myProfile.billing"]}
        </StyledButtonLeft>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", width: "75%" }}>
        <Typography
          sx={{
            fontSize: "36px",
            fontWeight: 700,
            marginBottom: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {i18n["myProfile.title"]}
        </Typography>
        <StyledAccordion expanded={expanded}>
          <AccordionSummary
            // expandIcon={<ExpandMoreIcon onClick={handleProfilePop} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Box
              sx={{
                position: "absolute",
                right: "30px",
                border: "1px solid black",
                borderRadius: "5px",
                color: "white",
                backgroundColor: "#3b3636",
                paddingLeft: 0.4,
                paddingRight: 0.4,
              }}
              id="profile-viewer-btn"
            >
              {displayD == "none" ? (
                <ArrowDownwardIcon
                  onClick={handleProfilePop}
                  sx={{ "&:hover": { cursor: "pointer" } }}
                  id="profile-viewer-btn"
                />
              ) : (
                <ArrowUpwardIcon
                  onClick={handleProfilePop}
                  sx={{ "&:hover": { cursor: "pointer" } }}
                  id="profile-viewer-btn"
                />
              )}
            </Box>
            <Box
              sx={{
                ref: { boxRef },
                backgroundColor: "white",
                position: "absolute",
                display: displayD,
                right: 0,
                top: 59,
                width: "auto",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                zIndex: 9999,
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", p: 2 }}
                className="profile-viewer-dropdown"
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Profile Completion Guidance:
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => handlePageChange("a")}
                >
                  My info{" "}
                  {profileCompletion >= 25 && (
                    <CheckSharpIcon
                      sx={{
                        position: "absolute",
                        right: 2,
                        color: "green",
                        fontSize: "25px",
                      }}
                    />
                  )}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => handlePageChange("b")}
                >
                  Company info{" "}
                  {profileCompletion >= 50 && (
                    <CheckSharpIcon
                      sx={{
                        position: "absolute",
                        right: 2,
                        color: "green",
                        fontSize: "25px",
                      }}
                    />
                  )}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => handlePageChange("c")}
                  disabled
                >
                  My plan{" "}
                  {profileCompletion >= 75 && (
                    <CheckSharpIcon
                      sx={{
                        position: "absolute",
                        right: 2,
                        color: "green",
                        fontSize: "25px",
                      }}
                    />
                  )}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => handlePageChange("d")}
                  disabled
                >
                  Billing{" "}
                  {profileCompletion == 100 && (
                    <CheckSharpIcon
                      sx={{
                        position: "absolute",
                        right: 2,
                        color: "green",
                        fontSize: "25px",
                      }}
                    />
                  )}
                </Button>
              </Box>
            </Box>
            {/* <AccordionSummary
                expandIcon={<ExpandMoreIcon onClick={handleAccordion} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
            </AccordionSummary> */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="img"
                    className="companyLogo"
                    alt="crayon logo"
                    src={
                      image?.length > 0
                        ? image || compInfo?.profile_url
                        : companyLogo
                    }
                    sx={{
                      height: "73px",
                      width: "73px",
                      borderRadius: "49px",
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 700,
                        mr: 1,
                      }}
                    >
                      {companies?.find(
                        (title) => title.company_id === compInfo?.company_name
                      )?.name || compInfo?.company_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        mr: 1,
                      }}
                    >
                      {info?.first_name} {info?.surname}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 400,
                        mr: 1,
                      }}
                    >
                      {i18n["empMyProfile.dateJoined"]}:{" "}
                      {info?.created_at?.substring(0, 10)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <input
                    ref={hiddenFileInput}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <StyledButton
                    variant="contained"
                    color="blueButton400"
                    onClick={handleImageClick}
                  >
                    {i18n["empMyProfile.uploadAlogo"]}
                  </StyledButton>
                </Box>
              </Box>
              <Box sx={{ width: "39%", mt: 2 }}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    mr: 1,
                  }}
                >
                  {i18n["empMyProfile.profileCompletion"]}
                </Typography>
                <LinearProgressWithLabel value={profileCompletion} />
                {!expanded ? (
                  <StyledButton
                    // disabled={expanded}
                    variant="contained"
                    color="redButton100"
                    onClick={handleUpdateProfile}
                  >
                    {i18n["empMyProfile.updateProfile"]}
                  </StyledButton>
                ) : (
                  <StyledButton
                    // disabled={expanded}
                    variant="outlined"
                    color="redButton100"
                    onClick={handleCancelProfile}
                  >
                    {i18n["empMyProfile.cancelProfile"]}
                  </StyledButton>
                )}
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 4,
              mt: 1,
            }}
          >
            <Box sx={{ mt: 3 }}>
              <SomeComponent
                handleInfoData={getInfoData}
                profile={info}
                profile2={compInfo}
                handleCompanyInfoData={getCompanyInfoData}
                errors={errors}
                setErrors={setErrors}
                companies={companies}
                industries={industries}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 8,
                }}
              >
                {currentCompIndex == 0 ? (
                  <Box>
                    <StyledButton
                      onClick={saveInfo}
                      variant="contained"
                      color="redButton100"
                      sx={{ mr: 5, width: "145px", height: "40px" }}
                    >
                      {i18n["empMyProfile.save"]}
                    </StyledButton>
                    <StyledButton
                      endIcon={<ArrowForwardIosIcon />}
                      sx={{ boxShadow: "none" }}
                      color="redButton100"
                      onClick={handleNext}
                    >
                      {EMP_PROFILE_STEPS[currentCompIndex + 1]}
                    </StyledButton>
                  </Box>
                ) : (
                  <Box>
                    <StyledButton
                      sx={{ mr: 5, boxShadow: "none" }}
                      startIcon={<ArrowBackIosIcon />}
                      color="redButton100"
                      onClick={handlePrev}
                    >
                      {EMP_PROFILE_STEPS[currentCompIndex - 1]}
                    </StyledButton>
                    <StyledButton
                      sx={{ width: "145px", height: "40px" }}
                      variant="contained"
                      color="redButton100"
                      onClick={saveCompInfo}
                    >
                      {i18n["empMyProfile.save"]}
                    </StyledButton>
                  </Box>
                )}
              </Box>
            </Box>
          </AccordionDetails>
          <CustomDialog
            dialogWidth="md"
            show={openEditImage}
            onDialogClose={() => {
              setImageName("My pic");
              setOpenEditImage(false);
            }}
            title={i18n["myProfile.moveAndScale"]}
            footer={renderFooter}
            isProfile
          >
            <Box
              sx={{
                position: "relative",
                height: "80%",
              }}
            >
              <Cropper
                image={imagePreview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={true}
                onCropChange={setCrop}
                // onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </Box>
            <Box
              sx={{
                position: "relative",
                height: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button variant="text" onClick={() => handleZoom("-")}>
                <ZoomOutIcon />
              </Button>
              <Box
                className="controls"
                sx={{
                  width: 200,
                  mx: 3,
                }}
              >
                <Slider
                  defaultValue={0}
                  size="small"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.5}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(e.target.value);
                  }}
                  className="zoom-range"
                />
              </Box>
              <Button variant="text" onClick={() => handleZoom("+")}>
                <ZoomInIcon />
              </Button>
              <Button variant="text" onClick={() => setZoom(1)}>
                Reset
              </Button>
            </Box>
          </CustomDialog>
        </StyledAccordion>
      </Box>
    </Box>
  );
}
