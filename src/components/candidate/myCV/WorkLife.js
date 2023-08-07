import { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  InputLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import locale from "../../../i18n/locale";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import InputBox from "../../common/InputBox";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ALERT_TYPE, CV_STEPS, ERROR_MSG } from "../../../utils/Constants";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { getCVWorkLife } from "../../../redux/candidate/myCVNew";
import { setAlert, setLoading } from "../../../redux/configSlice";
import { addWorkData } from "../../../redux/candidate/myCvSlice";
import { useSelector } from "react-redux";
import { getTitles } from "../../../redux/employer/postJobSlice";
import { getCompanies } from "../../../redux/employer/empProfileSlice";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import StyledButton from "../../common/StyledButton";
import AutoComplete from "../../common/AutoComplete";

const i18n = locale.en;

const BlueSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.blueButton400.main,
    "&:hover": {
      backgroundColor: alpha(
        theme.palette.blueButton400.main,
        theme.palette.action.hoverOpacity
      ),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.blueButton400.main,
  },
  "& .MuiSwitch-track": {
    // marginTop: '-9px'
  },
}));

const WORK = {
  company_name: "",
  title: "",
  clients_worked_on_awards: "",
  start_date: "",
  end_date: "",
  currently_employed_here: 0,
};

const WORD_LIMIT = 50;

export default function WorkLife({ changeStep }) {
  const dispatch = useDispatch();
  const currentDate = new Date();
  const [errors, setErrors] = useState([]);
  const [workData, setWorkData] = useState([WORK]);
  const [noWorkExp, setNoWorkExp] = useState(false);
  const [wordLimitExceed, setWordLimitExceed] = useState(false);

  const { companies, titles } = useSelector((state) => state.myProfile);
  console.log(companies);
  console.log(titles);

  const getAllData = async () => {
    try {
      dispatch(setLoading(true));
      await Promise.all([dispatch(getCompanies()), dispatch(getTitles())]);
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

  const handleSaveButton = async () => {
    try {
      const { payload } = await dispatch(
        addWorkData(noWorkExp ? [] : workData)
      );

      if (payload?.status == "success") {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Work data added successfully!",
          })
        );
        changeStep(3);
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
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: ERROR_MSG,
        })
      );
    }
  };

  const getCVWorkLifeData = async () => {
    const { payload } = await dispatch(getCVWorkLife());

    if (payload?.status == "success") {
      // console.log("PAYLOAD", payload?.data);
      payload?.data.length && setWorkData(payload?.data);
    } else if (payload?.status == "error") {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: "Fill the work life details",
        })
      );
    } else {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: payload?.data,
        })
      );
    }
    dispatch(setLoading(false));
  };

  const addWork = () => {
    setWorkData((prevState) => [...prevState, WORK]);
  };
  const removeWork = (event, index) => {
    if (workData.length > 1) {
      const newWorkData = workData.filter((data, i) => i + 1 != index);
      setWorkData(newWorkData);
    }
  };
  const handleChange = (event, index, type, id) => {
    const newWorkData = JSON.parse(JSON.stringify(workData));
    if (event && event.target) {
      if (event.target.value.split(" ").length <= WORD_LIMIT) {
        setWordLimitExceed(false);
        newWorkData[index][event.target.id] = event.target.value;
        setWorkData(newWorkData);
      } else {
        setWordLimitExceed(true);
      }
    } else {
      newWorkData[index][type] = dayjs(event).format("YYYY-MM-DD");
      setWorkData(newWorkData);
    }
  };

  const handleNoExp = (event) => {
    const isChecked = event.target.checked;
    setNoWorkExp(isChecked);
  };

  const handleCompVal = (event, newValue, id, index) => {
    const updatedWorkData = [...workData];

    updatedWorkData[index] = {
      ...updatedWorkData[index],
      [id]: newValue?.inputValue || newValue?.name || "",
    };

    console.log(updatedWorkData);
    setWorkData(updatedWorkData);
  };

  const handleTitleVal = (event, newValue, id, index) => {
    const updatedWorkData = [...workData];

    updatedWorkData[index] = {
      ...updatedWorkData[index],
      [id]: newValue?.name || "",
    };

    console.log(updatedWorkData);
    setWorkData(updatedWorkData);
  };

  useEffect(() => {
    getCVWorkLifeData();
    getAllData();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "baseline" }}>
        <Box>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              mb: 2,
            }}
          >
            {CV_STEPS[1]}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: 1,
          }}
        >
          <BlueSwitch onChange={handleNoExp} checked={noWorkExp} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 400,
            }}
          >
            {i18n["myCV.noWorkExp"]}
          </Typography>
        </Box>
      </Box>
      {console.log(workData)}
      {workData.length >= 0 &&
        workData.map((work, index) => (
          <Box key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {index != 0 && (
                  <IconButton
                    aria-label="edit"
                    color="redButton"
                    sx={{
                      padding: "0 !important",
                      marginRight: "4px",
                    }}
                    onClick={(event) => removeWork(event, index + 1)}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                )}
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 800,
                    flex: 1,
                  }}
                >
                  {index === 0
                    ? i18n["myCV.latestJobLabel"]
                    : i18n["myCV.previousJobLabel"]}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    pl: 1,
                    pr: 1,
                  }}
                >
                  {index === 0 ? i18n["myCV.mostRecent"] : ""}
                </Typography>
              </Box>

              <Divider
                component="hr"
                sx={{
                  borderBottomWidth: 2,
                  flex: "auto",
                  m: 0,
                  mr: 3.5,
                }}
              />
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Box sx={{ width: "100%" }}>
                <InputLabel
                  htmlFor="company_name"
                  sx={{
                    color: "black",
                    paddingLeft: "10px",
                    paddingBottom: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {i18n["myCV.companyNameLabel"]}
                </InputLabel>
                {/*<InputBox
                  disabled={noWorkExp}
                  id="company_name"
                  value={work.company_name}
                  onChange={(event) => handleChange(event, index)}
                  sx={{ width: "94%" }}
                  placeholder={i18n["myCV.companyName"]}
                />*/}

                <AutoComplete
                  showAddOption={true}
                  allowCustomInput={true}
                  disabled={noWorkExp}
                  id="company_name"
                  sx={{ width: "94%" }}
                  // value={getCompValue()}
                  value={
                    companies?.find(
                      (title) => title.name == work?.company_name
                    ) || work?.company_name
                  }
                  index={index}
                  onChange={handleCompVal}
                  placeholder={i18n["empMyProfile.companyNamePlace"]}
                  data={companies}
                ></AutoComplete>
                {!companies?.find(
                  (title) => title.name == work?.company_name
                ) &&
                  !work?.company_name &&
                  errors?.find((error) => error.key == "company_name") && (
                    <Typography color={"red !important"}>
                      {`*${
                        errors?.find((error) => error.key == "company_name")
                          .message
                      }`}
                    </Typography>
                  )}
              </Box>
              <Box sx={{ width: "100%" }}>
                <InputLabel
                  htmlFor="title"
                  sx={{
                    color: "black",
                    paddingLeft: "10px",
                    paddingBottom: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {i18n["myCV.jobTitleLable"]}
                </InputLabel>
                {/*<InputBox
                  disabled={noWorkExp}
                  id="title"
                  value={work.title}
                  onChange={(event) => handleChange(event, index)}
                  sx={{ width: "94%" }}
                  placeholder={i18n["myCV.jobTitle"]}
                />*/}

                <AutoComplete
                  showAddOption={true}
                  allowCustomInput={true}
                  disabled={noWorkExp}
                  id="title"
                  sx={{ width: "94%" }}
                  // value={getCompValue()}
                  value={
                    titles?.find((item) => item.name == work?.title) ||
                    work?.title
                  }
                  index={index}
                  onChange={handleTitleVal}
                  placeholder={i18n["myCV.workJobTitle"]}
                  data={titles}
                ></AutoComplete>
                {!titles?.find((item) => item.name == work?.title) &&
                  !work?.title &&
                  errors?.find((error) => error.key == "title") && (
                    <Typography color={"red !important"}>
                      {`*${
                        errors?.find((error) => error.key == "title").message
                      }`}
                    </Typography>
                  )}
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <InputLabel
                htmlFor="clients_worked_on_awards"
                sx={{
                  color: "black",
                  paddingLeft: "10px",
                  paddingBottom: "2px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {i18n["myCV.descriptionJobLabel"]}
              </InputLabel>
              <InputBox
                disabled={noWorkExp}
                id="clients_worked_on_awards"
                value={work.clients_worked_on_awards}
                onChange={(event) => handleChange(event, index)}
                sx={{ width: "97%" }}
                placeholder={i18n["myCV.clientsAwards"]}
              />
              {errors?.find(
                (error) => error.key == "clients_worked_on_awards"
              ) && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find(
                      (error) => error.key == "clients_worked_on_awards"
                    ).message
                  }`}
                </Typography>
              )}
              {wordLimitExceed && (
                <Typography color={"red !important"}>
                  Word limit {WORD_LIMIT}
                </Typography>
              )}
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
                  htmlFor="startdate"
                  sx={{
                    color: "black",
                    paddingLeft: "10px",
                    paddingBottom: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {i18n["myCV.startDate"]}
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disabled={noWorkExp}
                    value={work.start_date}
                    maxDate={currentDate}
                    onChange={(newValue) =>
                      handleChange(newValue, index, "start_date")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputProps={{
                          placeholder: "dd/mm/yyyy",
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "40px",
                            mr: 5,
                            borderRadius: "40px",
                          },
                          "& fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.26) !important",
                          },
                          minWidth: "100% !important",
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                {work.start_date == "" &&
                  errors?.find((error) => error.key == "start_date") && (
                    <Typography color={"red !important"}>
                      {`*${
                        errors?.find((error) => error.key == "start_date")
                          .message
                      }`}
                    </Typography>
                  )}
              </Box>
              <Box sx={{ width: "50%" }}>
                <InputLabel
                  htmlFor="enddate"
                  sx={{
                    color: "black",
                    paddingLeft: "10px",
                    paddingBottom: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {i18n["myCV.endDate"]}
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disabled={noWorkExp}
                    // label="end date"
                    value={work.end_date}
                    minDate={work.start_date}
                    onChange={(newValue) =>
                      handleChange(newValue, index, "end_date")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputProps={{
                          placeholder: "dd/mm/yyyy",
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "40px",
                            borderRadius: "40px",
                          },
                          "& fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.26) !important",
                          },
                          minWidth: "94% !important",
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>

                {work.end_date == "" &&
                  errors?.find((error) => error.key == "end_date") && (
                    <Typography color={"red !important"}>
                      {`*${
                        errors?.find((error) => error.key == "end_date").message
                      }`}
                    </Typography>
                  )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {/* <IconButton
                aria-label="edit"
                color="redButton"
                sx={{
                  padding: "0 !important",
                }}
                onClick={(event) => removeWork(event, index + 1)}
              >
                <RemoveCircleIcon />
              </IconButton> */}
              {/* {workData.length == index + 1 && ( */}
              {/* <IconButton
                  aria-label="edit"
                  color="lightGreenButton100"
                  onClick={addWork}
                >
                  <AddCircleIcon />
                </IconButton> */}

              {/* )} */}
            </Box>
          </Box>
        ))}
      <StyledButton
        disabled={noWorkExp}
        variant="outlined"
        color="redButton100"
        onClick={addWork}
      >
        {i18n["myCV.workBottonText"]}
      </StyledButton>

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
            changeStep(1);
          }}
        >
          {CV_STEPS[0]}
        </StyledButton>
        <StyledButton
          // disabled={noWorkExp}
          onClick={handleSaveButton}
          variant="outlined"
          color="redButton100"
        >
          {i18n["myCV.quickSave"]}
        </StyledButton>
      </Box>
    </Box>
  );
}
