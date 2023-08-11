import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import InputBox from "../../common/InputBox";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, InputLabel } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Tooltip from "@mui/material/Tooltip";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  resetPassword,
  uploadProfilePic,
  getTown,
  getCountry,
  getNationality,
  getLanguage,
} from "../../../redux/candidate/myProfileSlice";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import { useTheme } from "@emotion/react";
import ToggleSwitch from "../../common/ToggleSwitch";
import getCroppedImg from "../../../utils/cropImage";
import AutoComplete from "../../common/AutoComplete";
import { setLoading } from "../../../redux/configSlice";
import { addId } from "../../../utils/Common";
import { isEmpty } from "lodash";
import whiteColor from "../../../assets/white_color.svg";
import fairColor from "../../../assets/fair_color.svg";
import mediumColor from "../../../assets/medium_color.svg";
import darkColor from "../../../assets/dark_color.svg";
import lineColor from "../../../assets/line_color.svg";
import maleBlack from "../../../assets/male_black.svg";
import maleWhite from "../../../assets/male_white.svg";
import femaleBlack from "../../../assets/female_black.svg";
import femaleWhite from "../../../assets/female_white.svg";
import SelectMenu from "../../common/SelectMenu";
import "dayjs/locale/en-gb";
dayjs.locale("en-gb");

export default function TheBasics({
  handleProfileData,
  profile,
  errors,
  setErrors,
}) {
  const i18n = locale.en;
  const theme = useTheme();
  const currentDate = new Date();
  const dispatch = useDispatch();
  const [inputType, setInputType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [profileData, setProfileData] = useState(profile);
  const [towns, setTowns] = useState([]);
  const [townsMain, setTownsMain] = useState([]);
  const [countries, setCountries] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [characterCount, setCharacterCount] = useState(
    profileData.my_bio?.length || 0
  );
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
    handleProfileData(newProfileData);
  };

  const handleChange = (event) => {
    const newProfileData = {
      ...profileData,
      [event.target.name]: event.target.value,
    };
    if (event.target.name == "country_id") {
      let temp = towns.filter((val) => {
        return val.region_id == event.target.value;
      });
      setTownsMain(temp);
    }
    const filteredErrors = errors?.filter(
      (item) => item.key != event.target.name
    );
    console.log(filteredErrors);
    setProfileData(newProfileData);
    handleProfileData(newProfileData);
  };

  const handleSwitch = (event) => {
    const newProfileData = {
      ...profileData,
      [event.target.id]: Number(event.target.checked),
    };
    setProfileData(newProfileData);
    handleProfileData(newProfileData);
  };

  const handleInputChange = (event) => {
    if (event.target.id == "contact_no") {
      const newProfileData = {
        ...profileData,
        [event.target.id]: event.target.value,
      };
      setProfileData(newProfileData);
      handleProfileData(newProfileData);
    } else {
      const newProfileData = {
        ...profileData,
        [event.target.id]: event.target.value,
      };
      setProfileData(newProfileData);
      handleProfileData(newProfileData);
    }

    const inputValue = event.target.value;
    const newCharacterCount = inputValue?.length;
    if (event.target.id == "my_bio") {
      if (newCharacterCount <= 500) {
        setCharacterCount(newCharacterCount);
      }
    }
  };

  const handleMultipleAutoComplete = (event, newValue, id) => {
    let newProfileData = {};
    newProfileData = {
      ...profileData,
      [id]: newValue.map((val) => val?.inputValue || val?.id || val),
    };
    setProfileData(newProfileData);
    handleProfileData(newProfileData);
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
      setProfileData(profile);
    }
  }, [profile]);

  const getAllData = async () => {
    try {
      dispatch(setLoading(true));
      const [town, country, nationality, language] = await Promise.all([
        dispatch(getTown()),
        dispatch(getCountry()),
        dispatch(getNationality()),
        dispatch(getLanguage()),
      ]);

      setTowns(addId(town.payload.data, "town_id", "name"));
      setCountries(addId(country.payload.data, "region_id", "name"));
      setNationalities(
        addId(nationality.payload.data, "nationality_id", "nationality")
      );
      setLanguages(addId(language.payload.data, "language_id", "language"));

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
  const getNatiValue = () => {
    if (profileData.nationality_ids?.length == 0) {
      return [];
    }
    return profileData.nationality_ids?.map(
      (nation) => nationalities?.find((nati) => nati.id == nation) || nation
    );
  };
  const getLangValue = () => {
    if (profileData.language_ids?.length == 0) {
      return [];
    }
    return profileData.language_ids?.map(
      (lang) => languages?.find((language) => language.id == lang) || lang
    );
  };

  const handleGender = (event, gender) => {
    const newProfileData = {
      ...profileData,
      gender: gender,
    };
    console.log(gender);
    const filteredErrors = errors?.filter((item) => item.key != "gender");
    console.log(filteredErrors);
    setErrors(filteredErrors);

    setProfileData(newProfileData);
    handleProfileData(newProfileData);
  };

  const handleTownChange = (event) => {
    const {
      target: { value },
      target: { name },
      target: { id },
    } = event;
    const newProfileData = {
      ...profileData,
      [name || id]: value,
    };
    setProfileData(newProfileData);
    handleProfileData(newProfileData);
  };

  const handleDateChange = (newValue) => {
    const newProfileData = {
      ...profileData,
      dob: dayjs(newValue).format("YYYY-MM-DD"),
      // dob: dayjs(newValue),
    };
    const filteredErrors = errors?.filter((item) => item.key != "dob");
    setErrors(filteredErrors);
    setProfileData(newProfileData);
    handleProfileData(newProfileData);
  };

  useEffect(() => {
    getAllData();
  }, []);

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
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          width: "100%",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="name"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.nameLabel"]}
          </InputLabel>
          <InputBox
            sx={{ width: "95%" }}
            placeholder={i18n["myProfile.name"]}
            value={profileData.name}
            id="name"
            onChange={handleInputChange}
          />
          {profileData.name == "" &&
            errors?.find((error) => error.key == "name") && (
              <Typography color={"red !important"}>
                {`*${errors?.find((error) => error.key == "name").message}`}
              </Typography>
            )}
        </Box>
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="surname"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.surnameLabel"]}
          </InputLabel>
          <InputBox
            sx={{ width: "95%" }}
            placeholder={i18n["myProfile.surname"]}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          width: "100%",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="email"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.emailLabel"]}
          </InputLabel>
          <InputBox
            sx={{ width: "95%" }}
            placeholder={i18n["myProfile.email"]}
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
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="gender"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.genderLabel"]}
          </InputLabel>
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
                name="gender"
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
                name="gender"
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
          </Paper>
          {errors?.find((error) => error.key == "gender") && (
            <Typography color={"red !important"}>
              {`*${errors?.find((error) => error.key == "gender").message}`}
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          width: "100%",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="contact_no"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.contactLabel"]}
          </InputLabel>
          <InputBox
            sx={{ width: "95%" }}
            placeholder={i18n["myProfile.contactNumber"]}
            // value={profileData.contact_no}
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
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="birthdate"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.birthLabel"]}
          </InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs} locale="en-gb">
            <DatePicker
              name="dob"
              value={profileData.dob}
              onChange={handleDateChange}
              maxDate={currentDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // inputProps={{
                  //   placeholder: "dd/mm/yyyy",
                  // }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "40px",
                      width: "100%",
                      borderRadius: "40px",
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
          {errors?.find((error) => error.key == "dob") && (
            <Typography color={"red !important"}>
              {`*${errors?.find((error) => error.key == "dob").message}`}
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          width: "100%",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="country_id"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.countryLabel"]}
          </InputLabel>
          <SelectMenu
            name="country_id"
            value={profileData.country_id}
            onHandleChange={handleChange}
            options={countries}
            sx={{ width: "95%" }}
            placeholder={i18n["postAJob.countryPlaceHolder"]}
          />
          {!profileData.country_id &&
            errors?.find((error) => error.key == "country_id") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "country_id").message
                }`}
              </Typography>
            )}
        </Box>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "50%" }}>
            <InputLabel
              htmlFor="town_id"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myProfile.townLabel"]}
            </InputLabel>
            <SelectMenu
              name="town_id"
              disabled={!profileData.country_id}
              value={
                towns.find((val) => val.town_id == profileData.town_id)?.name ||
                ""
              }
              onHandleChange={handleTownChange}
              options={townsMain}
              sx={{ width: "95%" }}
              placeholder={i18n["myProfile.city"]}
            />
            {!towns.find((val) => val.town_id == profileData.town_id)?.name &&
              errors?.find((error) => error.key == "town_id") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "town_id").message
                  }`}
                </Typography>
              )}
          </Box>
          <Typography
            sx={{
              marginRight: "-30px",
              minWidth: "fit-content",
            }}
          >
            {i18n["myProfile.willingToRelocate"]}
          </Typography>
          <ToggleSwitch
            id="relocate"
            checked={!!Number(profileData.relocate)}
            onChange={handleSwitch}
          />
          {!profileData.relocate &&
            errors?.find((error) => error.key == "relocate") && (
              <Typography color={"red !important"}>
                {`*${errors?.find((error) => error.key == "relocate").message}`}
              </Typography>
            )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          width: "100%",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="nationality_ids"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.nationalityLabel"]}
          </InputLabel>
          <AutoComplete
            multiple={true}
            id="nationality_ids"
            value={getNatiValue()}
            onChange={handleMultipleAutoComplete}
            sx={{ width: "95%", display: "inline-table" }}
            placeholder={i18n["myProfile.nationality"]}
            data={nationalities}
            disableCloseOnSelect={true}
          ></AutoComplete>
          {getNatiValue() == "" &&
            errors?.find((error) => error.key == "nationality_ids") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "nationality_ids")
                    .message
                }`}
              </Typography>
            )}
        </Box>
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="language_ids"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.languageLabel"]}
          </InputLabel>
          <AutoComplete
            multiple={true}
            id="language_ids"
            value={getLangValue()}
            onChange={handleMultipleAutoComplete}
            sx={{ width: "95%", display: "inline-table" }}
            placeholder={i18n["myProfile.language"]}
            data={languages}
            disableCloseOnSelect={true}
          ></AutoComplete>
          {getLangValue() == "" &&
            errors?.find((error) => error.key == "language_ids") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "language_ids").message
                }`}
              </Typography>
            )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          width: "100%",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="my_bio"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.myBio"]} <span>({characterCount}/500)</span>
          </InputLabel>
          <InputBox
            sx={{ width: "95%" }}
            placeholder={i18n["myProfile.myBioPlace"]}
            value={profileData.my_bio}
            id="my_bio"
            onChange={handleInputChange}
          />
          {profileData.my_bio == null ||
            (profileData.my_bio == "" &&
              errors?.find((error) => error.key == "my_bio") && (
                <Typography color={"red !important"}>
                  {`*${errors?.find((error) => error.key == "my_bio").message}`}
                </Typography>
              ))}
        </Box>
        <Box sx={{ width: "50%" }}>
          {/* <InputLabel
            htmlFor="password"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.passwordChangeLabel"]}
          </InputLabel>
          <Paper
            sx={{
              display: "flex",
              height: "40px",
              borderRadius: "25px",
              width: "95%",
              boxShadow:
                "0px 1px 4px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.02), 0px 1px 12px rgba(0, 0, 0, 0.12)",
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
                placeholder={i18n["myProfile.password"]}
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
              {i18n["myProfile.resetPassword"]}
            </Button>
          </Paper> */}
          <InputLabel
            htmlFor="linkedin_profile_link"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.linkedInLabel"]}
          </InputLabel>
          <InputBox
            sx={{ width: "95%" }}
            placeholder={i18n["myProfile.linkedIn"]}
            value={profileData.linkedin_profile_link}
            id="linkedin_profile_link"
            onChange={handleInputChange}
          />
          {profileData.linkedin_profile_link == "" &&
            errors?.find((error) => error.key == "linkedin_profile_link") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "linkedin_profile_link")
                    .message
                }`}
              </Typography>
            )}
        </Box>
      </Box>

      <Box
        sx={{ display: "flex", mb: 4, ml: 1, justifyContent: "space-between" }}
      >
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
              {profileData.skinz === 1 ? "White" : ""}
              {profileData.skinz === 2 ? "Fair" : ""}
              {profileData.skinz === 3 ? "Medium" : ""}{" "}
              {profileData.skinz === 4 ? "Dark" : ""}
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
                onClick={(event) => handleColor(event, 1)}
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
                onClick={(event) => handleColor(event, 2)}
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
                onClick={(event) => handleColor(event, 3)}
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
                onClick={(event) => handleColor(event, 4)}
                sx={{
                  zIndex: 0,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Box>
          {errors?.find((error) => error.key == "skinz") && (
            <Typography color={"red !important"}>
              {`*${errors?.find((error) => error.key == "skinz").message}`}
            </Typography>
          )}
        </Box>
        <Box sx={{ width: "50%" }}>
          <InputLabel
            htmlFor="password"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myProfile.passwordChangeLabel"]}
          </InputLabel>
          <Paper
            sx={{
              display: "flex",
              height: "40px",
              borderRadius: "25px",
              width: "95%",
              boxShadow:
                "0px 1px 4px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.02), 0px 1px 12px rgba(0, 0, 0, 0.12)",
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
                placeholder={i18n["myProfile.password"]}
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
              {i18n["myProfile.resetPassword"]}
            </Button>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mr: 8 }}>
          <Typography
            sx={{
              mr: 1,
              minWidth: "fit-content",
            }}
          >
            {i18n["myProfile.seekingWork"]}
          </Typography>
          <ToggleSwitch
            id="seeking_job"
            checked={!!profileData.seeking_job}
            onChange={handleSwitch}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mr: 8 }}>
          <Typography
            sx={{
              mr: 1,
              minWidth: "fit-content",
            }}
          >
            {i18n["myProfile.hide_profile"]}
          </Typography>
          <ToggleSwitch
            id="hide_profile"
            checked={!!profileData.hide_profile}
            onChange={handleSwitch}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mr: 8 }}>
          <Typography
            sx={{
              mr: 1,
              minWidth: "fit-content",
            }}
          >
            {i18n["myProfile.hide_age"]}
          </Typography>
          <ToggleSwitch
            id="hide_age"
            checked={!!profileData.hide_age}
            onChange={handleSwitch}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{
              mr: 1,
              minWidth: "fit-content",
            }}
          >
            {i18n["myProfile.hide_video"]}
          </Typography>
          <ToggleSwitch
            id="hide_video"
            checked={!!profileData.hide_video}
            onChange={handleSwitch}
          />
        </Box>
      </Box>
    </Box>
  );
}
