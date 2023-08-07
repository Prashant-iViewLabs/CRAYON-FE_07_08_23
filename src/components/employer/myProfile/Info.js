import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import InputBox from "../../common/InputBox";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SelectMenu from "../../common/SelectMenu";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import maleBlack from "../../../assets/male_black.svg";
import maleWhite from "../../../assets/male_white.svg";
import femaleBlack from "../../../assets/female_black.svg";
import femaleWhite from "../../../assets/female_white.svg";
import whiteColor from "../../../assets/white_color.svg";
import fairColor from "../../../assets/fair_color.svg";
import mediumColor from "../../../assets/medium_color.svg";
import darkColor from "../../../assets/dark_color.svg";
import lineColor from "../../../assets/line_color.svg";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import { useTheme } from "@emotion/react";
import AutoComplete from "../../common/AutoComplete";
import { setLoading } from "../../../redux/configSlice";
import { addId } from "../../../utils/Common";
import { isEmpty } from "lodash";
import {
  getCountry,
  getTown,
  resetPassword,
} from "../../../redux/employer/empProfileSlice";
import { FormControl } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
export default function Info({ handleInfoData, profile, errors, setErrors }) {
  const i18n = locale.en;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [inputType, setInputType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [profileData, setProfileData] = useState(profile);
  const [towns, setTowns] = useState([]);
  const [townsMain, setTownsMain] = useState([]);
  const [countries, setCountries] = useState([]);

  const getAllData = async () => {
    try {
      dispatch(setLoading(true));
      const [country, town] = await Promise.all([
        dispatch(getCountry()),
        dispatch(getTown()),
      ]);

      if (profile?.region_id != null) {
        let temp = town.payload.data.filter((val) => {
          return val.region_id == profile?.region_id;
        });
        setTownsMain(temp);
      }

      setCountries(addId(country.payload.data, "region_id", "name"));
      setTowns(addId(town.payload.data, "town_id", "name"));

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
  useEffect(() => {
    handleInfoData(profile);
  }, []);

  const handleShowPassword = () => {
    if (showPassword) setInputType("password");
    else setInputType("text");

    setShowPassword(!showPassword);
  };

  const handleColor = (event, color) => {
    const newProfileData = {
      ...profileData,
      skinz: color,
    };
    setProfileData(newProfileData);
    handleInfoData(newProfileData);
  };

  const handleInputChange = (event) => {
    if (event.target.id == "contact_no") {
      const newProfileData = {
        ...profileData,
        [event.target.id]: event.target.value,
      };
      setProfileData(newProfileData);
      handleInfoData(newProfileData);
    } else {
      const newProfileData = {
        ...profileData,
        [event.target.id]: event.target.value,
      };
      setProfileData(newProfileData);
      handleInfoData(newProfileData);
    }
  };

  const handlePasswordReset = async () => {
    const params = {
      password: newPassword,
    };
    try {
      const { payload } = await dispatch(resetPassword(params));
      if (payload?.status == "success") {
        setNewPassword("");
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Password reset Successfully!",
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

  useEffect(() => {
    if (!isEmpty(profile)) {
      // console.log(profile);
      let temp = towns.filter((val) => {
        return val.region_id == profile?.region_id;
      });
      // console.log(temp);
      setTownsMain(temp);
      setProfileData(profile);
    }
  }, [profile]);

  const handleChange = async (event) => {
    const {
      target: { value },
      target: { name },
      target: { id },
    } = event;
    const newProfileData = {
      ...profileData,
      [name]: value,
    };
    if (name == "region_id") {
      let temp = towns.filter((val) => {
        return val.region_id == value;
      });
      setTownsMain(temp);
    }
    setProfileData(newProfileData);
    handleInfoData(newProfileData);
  };
  const handleTownChange = (event) => {
    const {
      target: { value },
      target: { name },
    } = event;
    const newProfileData = {
      ...profileData,
      [name]: value,
    };
    setProfileData(newProfileData);
    handleInfoData(newProfileData);
  };

  const handleGender = (event, genders) => {
    const newProfileData = {
      ...profileData,
      gender: genders,
    };
    setProfileData(newProfileData);
    handleInfoData(newProfileData);
  };

  const getMaleIcon = (
    <Box
      component="img"
      alt="male white"
      src={profileData.gender == "male" ? maleWhite : maleBlack}
      sx={{ width: "7px" }}
    />
  );
  const getFemaleIcon = (
    <Box
      component="img"
      alt="female white"
      src={profileData.gender == "female" ? femaleWhite : femaleBlack}
      sx={{ width: "9px" }}
    />
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ width: "47%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.firstName"]}
          </Typography>
          <InputBox
            id="first_name"
            value={profileData.first_name}
            onChange={handleInputChange}
            placeholder={i18n["empMyProfile.firstNamePlace"]}
          />
          {profileData.first_name == "" &&
            errors?.find((error) => error.key == "first_name") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "first_name").message
                }`}
              </Typography>
            )}
        </Box>
        <Box sx={{ width: "47%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.surname"]}
          </Typography>
          <InputBox
            placeholder={i18n["empMyProfile.surnamePlace"]}
            value={profileData.surname}
            id="surname"
            onChange={handleInputChange}
          />
          {profileData.surname == "" &&
            errors?.find((error) => error.key == "surname") && (
              <Typography color={"red !important"}>
                {`*${errors?.find((error) => error.key == "surname").message}`}
              </Typography>
            )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ width: "47%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.email"]}
          </Typography>
          <InputBox
            placeholder={i18n["empMyProfile.emailPlace"]}
            value={profileData.email}
            id="email"
            onChange={handleInputChange}
          />
          {profileData.email == "" &&
            errors?.find((error) => error.key == "email") && (
              <Typography color={"red !important"}>
                {`*${errors?.find((error) => error.key == "email").message}`}
              </Typography>
            )}
        </Box>
        <Box sx={{ width: "47%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.changePassword"]}
          </Typography>
          <Paper
            sx={{
              display: "flex",
              height: "40px",
              borderRadius: "25px",
              boxShadow: "none",
              border: `1px solid ${theme.palette.grayBorder}`,
            }}
          >
            <Paper
              elevation={0}
              component="form"
              sx={{
                display: "flex",
                borderRadius: "25px",
                alignItems: "center",
                width: 1,
              }}
            >
              <InputBase
                sx={{
                  ml: 2,
                  width: 1,
                }}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder={i18n["empMyProfile.changePasswordPlace"]}
                type={inputType}
              />
            </Paper>
            <IconButton
              color=""
              aria-label="reset password"
              component="button"
              onClick={handleShowPassword}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            <Button
              sx={{
                ml: "4px",
                minWidth: "fit-content",
                boxShadow: 0,
                height: "auto",
              }}
              variant="contained"
              color="redButton100"
              onClick={handlePasswordReset}
            >
              {i18n["empMyProfile.resetPassword"]}
            </Button>
          </Paper>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ width: "47%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.phoneNumber"]}
          </Typography>
          <InputBox
            placeholder={i18n["empMyProfile.phoneNumberPlace"]}
            value={profileData.contact_no ? profileData.contact_no : ""}
            id="contact_no"
            onChange={handleInputChange}
          />
          {profileData.contact_no == "" &&
            errors?.find((error) => error.key == "contact_no") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "contact_no").message
                }`}
              </Typography>
            )}
        </Box>

        <Box sx={{ width: "47%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.gender"]}
          </Typography>
          <Paper
            elevation={3}
            sx={{
              borderRadius: "25px",
              width: "176px",
              height: "40px",
              boxShadow: "none",
              border: `1px solid ${theme.palette.grayBorder}`,
              background: theme.palette.grayBorder,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px",
              }}
            >
              <Button
                startIcon={getMaleIcon}
                variant="contained"
                color={
                  profileData.gender == "male" ? "blueButton400" : "grayBorder"
                }
                onClick={(event) => handleGender(event, "male")}
                sx={{
                  height: "37px",
                  width: "85px",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: profileData.gender == "female" && theme.palette.black,
                  background:
                    profileData.gender == "female" && theme.palette.grayBorder,
                  ":hover": {
                    boxShadow: "none",
                  },
                }}
              >
                {i18n["empMyProfile.male"]}
              </Button>
              <Button
                startIcon={getFemaleIcon}
                sx={{
                  height: "37px",
                  width: "85px",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: profileData.gender == "male" && theme.palette.black,
                  background:
                    profileData.gender == "male" && theme.palette.grayBorder,
                  ":hover": {
                    boxShadow: "none",
                  },
                }}
                variant="contained"
                color={
                  profileData.gender == "female"
                    ? "purpleButton300"
                    : "grayBorder"
                }
                onClick={(event) => handleGender(event, "female")}
              >
                {i18n["empMyProfile.female"]}
              </Button>
            </Box>
            {profileData.gender == "" &&
              errors?.find((error) => error.key == "gender") && (
                <Typography color={"red !important"}>
                  {`*${errors?.find((error) => error.key == "gender").message}`}
                </Typography>
              )}
          </Paper>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ width: "50%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.country"]}
          </Typography>
          <SelectMenu
            name="region_id"
            value={profileData.region_id}
            onHandleChange={handleChange}
            options={countries}
            sx={{ width: "95%" }}
            placeholder={i18n["empMyProfile.townPlace"]}
          />
          {!profileData.region_id &&
            errors?.find((error) => error.key == "region_id") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "region_id").message
                }`}
              </Typography>
            )}
        </Box>
        <Box sx={{ width: "47%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.cityTown"]}
          </Typography>
          <SelectMenu
            name="town_id"
            // disabled={!profileData.region_id}
            value={profileData.town_id}
            onHandleChange={handleTownChange}
            options={townsMain}
            sx={{ width: "95%" }}
            placeholder={i18n["empMyProfile.townPlace"]}
          />
          {!profileData.town_id &&
            errors?.find((error) => error.key == "town_id") && (
              <Typography color={"red !important"}>
                {`*${errors?.find((error) => error.key == "town_id").message}`}
              </Typography>
            )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", mb: 2, ml: 1, alignItems: "center" }}>
        <Box sx={{ width: "47%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{
                mr: 4,
                minWidth: "fit-content",
              }}
            >
              {i18n["empMyProfile.crayonSkinz"]}
            </Typography>
            <Typography
              sx={{
                mr: 1,
                minWidth: "fit-content",
                color: `${theme.palette.redButton100.main} !important`,
              }}
            >
              {" "}
              {profileData.skinz === "1" ? "White" : ""}
              {profileData.skinz === "2" ? "Fair" : ""}
              {profileData.skinz === "3" ? "Medium" : ""}
              {profileData.skinz === "4" ? "Dark" : ""}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              position: "relative",
            }}
          >
            <Box
              component="img"
              alt="white color"
              src={lineColor}
              sx={{
                position: "absolute",
                top: profileData.skinz ? "17px" : "17px",
                zIndex: 0,
                width: "100%",
              }}
            />
            <Tooltip title="white" placement="top-start">
              <Box
                component="img"
                alt="white color"
                src={whiteColor}
                width={profileData.skinz == "white" ? "48px" : "36px"}
                onClick={(event) => handleColor(event, "1")}
                sx={{
                  zIndex: 0,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Tooltip title="fair" placement="top-start">
              <Box
                component="img"
                alt="white color"
                src={fairColor}
                width={profileData.skinz == "fair" ? "48px" : "36px"}
                onClick={(event) => handleColor(event, "2")}
                sx={{
                  zIndex: 0,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Tooltip title="medium" placement="top-start">
              <Box
                component="img"
                alt="white color"
                src={mediumColor}
                width={profileData.skinz == "medium" ? "48px" : "36px"}
                onClick={(event) => handleColor(event, "3")}
                sx={{
                  zIndex: 0,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Tooltip title="dark" placement="top-start">
              <Box
                component="img"
                alt="white color"
                src={darkColor}
                width={profileData.skinz == "dark" ? "48px" : "36px"}
                onClick={(event) => handleColor(event, "4")}
                sx={{
                  zIndex: 0,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
