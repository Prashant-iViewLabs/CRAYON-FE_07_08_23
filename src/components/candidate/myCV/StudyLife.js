import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled, alpha } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import { CV_STEPS } from "../../../utils/Constants";
import { cloneDeep } from "lodash";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { InputLabel } from "@mui/material";
import Switch from "@mui/material/Switch";
import {
  getSchool,
  getInstitute,
  getQualification,
  getTypeQualificationValue,
  getAssociation,
  addStudyData,
} from "../../../redux/candidate/myCvSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import { setAlert, setLoading } from "../../../redux/configSlice";
import AutoComplete from "../../common/AutoComplete";
import { getCVStudyLife } from "../../../redux/candidate/myCVNew";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import StyledButton from "../../common/StyledButton";
import SelectMenu from "../../common/SelectMenu";
import { useNavigate } from "react-router-dom";

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

const QUALIFICATION = {
  qualification_id: "",
  institution_id: "",
  year_ended: "",
  completed: "true",
  qualificationtype_id: "",
};
const STUDY = {
  qualification: [QUALIFICATION],
  otherdata: {
    school_id: "",
    school_completed: "true",
    school_year_end: "",
    association_id: "",
    association_completed: "true",
    association_year_end: "",
  },
};

let maxOffset = 63;
let thisYear = new Date().getFullYear();
let allYears = [];
for (let x = 0; x <= maxOffset; x++) {
  allYears.push(thisYear - x);
}

const yearOptions = allYears.map((x) => {
  return <option key={x}>{x}</option>;
});

export default function StudyLife({ changeStep }) {
  const dispatch = useDispatch();
  const [studyData, setStudyData] = useState(STUDY);
  const [errors, setErrors] = useState([]);
  const [noStudyExp, setNoStudyExp] = useState(false);
  const history = useNavigate();
  const {
    school,
    institution,
    qualification,
    association,
    typeOfQualification,
  } = useSelector((state) => state.myCv);

  const removeStudy = (event, index) => {
    if (studyData.qualification.length > 1) {
      const newStudy = studyData.qualification.filter(
        (data, i) => i + 1 != index
      );
      const newStudyData = { ...studyData, qualification: newStudy };
      setStudyData(newStudyData);
    }
  };

  const handleSaveButton = async () => {
    try {
      const { payload } = await dispatch(
        addStudyData(noStudyExp ? { qualification: [] } : studyData)
      );

      if (payload?.status == "success") {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Basic data added successfully!",
          })
        );
        setErrors([]);
        changeStep(4);
        // history("/candidate/my-profile");
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

  const getAllData = async () => {
    try {
      dispatch(setLoading(true));
      await Promise.all([
        dispatch(getSchool()),
        dispatch(getInstitute()),
        dispatch(getQualification()),
        dispatch(getTypeQualificationValue()),
        dispatch(getAssociation()),
      ]);
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

  const getCVStydyLifeData = async () => {
    const { payload } = await dispatch(getCVStudyLife());

    if (payload?.status == "success") {
      payload?.data?.qualification?.length > 0 && setStudyData(payload?.data);
    } else if (payload?.status == "error") {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: "Fill the study life details",
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

  const handleQualificationType = (event, index) => {
    const {
      target: { value },
      target: { name },
    } = event;

    let newCultureData = cloneDeep(studyData);
    newCultureData.qualification[index] = {
      ...newCultureData.qualification[index],
      [name]: value,
    };
    setStudyData(newCultureData);
  };

  const handleChange = (event, newValue, id, index) => {
    const newStudyData = JSON.parse(JSON.stringify(studyData));

    if (event.target.name == "school_year_end") {
      const id = event.target.name;
      newStudyData.otherdata.school_year_end = event.target.value;
    } else if (id == "school_id") {
      let id_institution = newValue?.school_id;
      newStudyData.otherdata.school_id = id_institution;
    } else if (event.target.name == "association_year_end") {
      const id = event.target.name;
      newStudyData.otherdata.association_year_end = event.target.value;
    } else if (id == "association_id") {
      let id_institution = newValue?.association_id;
      newStudyData.otherdata.association_id = id_institution;
    } else if (id == "institution_id") {
      let id_institution = newValue?.institution_id || null;
      newStudyData.qualification[index].institution_id = id_institution;
    } else if (id == "qualification_id") {
      let id_institution = newValue?.qualification_id || null;
      newStudyData.qualification[index].qualification_id = id_institution;
    }

    setStudyData(newStudyData);
  };

  const getYearEndedValue = (idx) => {
    const year = studyData?.qualification[idx]?.year_ended?.substring(
      0,
      studyData?.qualification[idx]?.year_ended?.indexOf("-")
    );
    return studyData?.qualification[idx]?.year_ended.includes("-")
      ? year
      : studyData?.qualification[idx]?.year_ended;
  };
  const handleSelectChange = (event, index) => {
    const newStudyData = JSON.parse(JSON.stringify(studyData));
    newStudyData.qualification[index].year_ended = event.target.value;
    setStudyData(newStudyData);
  };
  const handleSelectChange2 = (event, id, name, index) => {
    // const newStudyData = JSON.parse(JSON.stringify(studyData));
    // newStudyData.qualification[index]["completed"] = id;
    // setStudyData(newStudyData);
    // onSubmit("study", newStudyData)
    const newStudyData = JSON.parse(JSON.stringify(studyData));
    if (newStudyData.qualification[index]) {
      newStudyData.qualification[index]["completed"] = id ? "false" : "true";
      setStudyData(newStudyData);
    }
  };
  const handleSelectChange3 = (event, id, name) => {
    const newStudyData = JSON.parse(JSON.stringify(studyData));
    newStudyData.otherdata["school_completed"] = id ? "false" : "true";
    setStudyData(newStudyData);
  };
  const handleSelectChange4 = (event, id, name) => {
    const newStudyData = JSON.parse(JSON.stringify(studyData));
    newStudyData.otherdata["association_completed"] = id ? "false" : "true";
    setStudyData(newStudyData);
  };

  const getAssociationValue = () => {
    const temp2 = association.find(
      (val) => val?.association_id === studyData?.otherdata?.association_id
    );
    return temp2?.name || "";
  };

  const addStudy = () => {
    const newStudyData = {
      ...studyData,
      qualification: [...studyData.qualification, QUALIFICATION],
    };

    setStudyData(newStudyData);
    // setQualificationS([...qualificationS, QUALIFICATION])
    //  onSubmit("study", qualificationS);
  };

  useEffect(() => {
    getAllData();
    getCVStydyLifeData();
  }, []);

  const handleNoStudy = (event) => {
    const isChecked = event.target.checked;
    setNoStudyExp(isChecked);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "baseline" }}>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            ml: 1,
            mb: 2,
          }}
        >
          {CV_STEPS[2]}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <BlueSwitch onChange={handleNoStudy} checked={noStudyExp} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 400,
            }}
          >
            {i18n["myCV.noStudyExp"]}
          </Typography>
        </Box>
      </Box>

      {studyData.qualification &&
        studyData.qualification.map((work, index) => (
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
                    onClick={(event) => removeStudy(event, index + 1)}
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
                    ? i18n["myCV.latestEducation"]
                    : i18n["myCV.previousEducation"]}
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
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ width: "43%" }}>
                <InputLabel
                  htmlFor="institution_id"
                  sx={{
                    color: "black",
                    paddingLeft: "10px",
                    paddingBottom: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {i18n["myCV.institutionLabel"]}
                </InputLabel>

                <AutoComplete
                  // multiple={true}
                  disabled={noStudyExp}
                  id="institution_id"
                  value={
                    institution?.find(
                      (institute, index) => institute.id == work?.institution_id
                    ) || work?.institution_id
                  }
                  // onChange={handleAutoComplete}
                  onChange={(event, newValue, id) =>
                    handleChange(event, newValue, id, index)
                  }
                  sx={{ width: "100%" }}
                  placeholder={i18n["myCV.institutionPlaceholder"]}
                  data={institution}
                ></AutoComplete>
                {!institution?.find(
                  (institute, index) => institute.id == work?.institution_id
                ) &&
                  !work?.institution_id &&
                  errors?.find((error) => error.key == "institution_id") && (
                    <Typography color={"red !important"}>
                      {`*${
                        errors?.find((error) => error.key == "institution_id")
                          .message
                      }`}
                    </Typography>
                  )}
              </Box>
              <Box sx={{ width: "27%" }}>
                <InputLabel
                  htmlFor="year_ended"
                  sx={{
                    color: "black",
                    paddingLeft: "10px",
                    paddingBottom: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {i18n["myCV.yearOfCompletionLabel"]}
                </InputLabel>
                <Select
                  disabled={noStudyExp}
                  id="year_ended"
                  name="year_ended"
                  value={getYearEndedValue(index)}
                  defaultValue={getYearEndedValue(index)}
                  onChange={(event) => handleSelectChange(event, index)}
                  sx={{
                    width: "100%",
                    borderRadius: "25px",
                    height: "40px",
                    background: "#fff",
                  }}
                >
                  {yearOptions.map((val) => (
                    <MenuItem key={val} value={val?.key}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
                {getYearEndedValue(index) == "" &&
                  errors?.find((error) => error.key == "year_ended") && (
                    <Typography color={"red !important"}>
                      {`*${
                        errors?.find((error) => error.key == "year_ended")
                          .message
                      }`}
                    </Typography>
                  )}
              </Box>
              <Box
                sx={{ width: "20%", display: "flex", alignItems: "baseline" }}
              >
                <InputLabel
                  htmlFor="completed"
                  sx={{
                    color: "black",
                    paddingLeft: "10px",
                    paddingBottom: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {i18n["myCV.stillCompletingLabel"]}
                </InputLabel>
                <BlueSwitch
                  disabled={noStudyExp}
                  id="completed"
                  name="completed"
                  defaultChecked={work?.completed == "false" ? true : false}
                  onChange={(event, id, name) =>
                    handleSelectChange2(event, id, name, index)
                  }
                />
                {errors?.find((error) => error.key == "completed") && (
                  <Typography color={"red !important"}>
                    {`*${
                      errors?.find((error) => error.key == "completed").message
                    }`}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <InputLabel
                htmlFor="qualification_id"
                sx={{
                  color: "black",
                  paddingLeft: "10px",
                  paddingBottom: "2px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {i18n["myCV.qualificationLabel"]}
              </InputLabel>
              <AutoComplete
                disabled={noStudyExp}
                // multiple={true}
                id="qualification_id"
                value={
                  qualification?.find(
                    (qual, index) => qual.id == work?.qualification_id
                  ) || work?.qualification_id
                }
                onChange={(event, newValue, id) =>
                  handleChange(event, newValue, id, index)
                }
                sx={{ width: "97%" }}
                placeholder={i18n["myCV.qualificationPlaceholder"]}
                data={qualification}
              ></AutoComplete>
              {!qualification?.find(
                (qual, index) => qual.id == work?.qualification_id
              ) &&
                !work?.qualification_id &&
                errors?.find((error) => error.key == "qualification_id") && (
                  <Typography color={"red !important"}>
                    {`*${
                      errors?.find((error) => error.key == "qualification_id")
                        .message
                    }`}
                  </Typography>
                )}
            </Box>

            <Box sx={{ width: "100%" }}>
              <InputLabel
                htmlFor="qualificationtype_id"
                sx={{
                  color: "black",
                  paddingLeft: "10px",
                  paddingBottom: "2px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {i18n["myCV.typeOfQualificationLabel"]}
              </InputLabel>
              <SelectMenu
                disabled={noStudyExp}
                name="qualificationtype_id"
                value={work.qualificationtype_id}
                onHandleChange={(event) =>
                  handleQualificationType(event, index)
                }
                options={typeOfQualification}
                sx={{ width: "97%" }}
                placeholder={i18n["myCV.typeOfqualificationPlaceholder"]}
              />
              {!work.qualificationtype_id &&
                errors?.find(
                  (error) => error.key == "qualificationtype_id"
                ) && (
                  <Typography color={"red !important"}>
                    {`*${
                      errors?.find(
                        (error) => error.key == "qualificationtype_id"
                      ).message
                    }`}
                  </Typography>
                )}
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            ></Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}></Box>
          </Box>
        ))}
      <StyledButton
        disabled={noStudyExp}
        variant="outlined"
        color="redButton100"
        onClick={addStudy}
      >
        {i18n["myCV.previousStudyBottonText"]}
      </StyledButton>
      <Box sx={{ pt: 6 }}>
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
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 800,
                flex: 1,
              }}
            >
              {i18n["myCV.highSchoolLabel"]}
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
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ width: "43%" }}>
            <InputLabel
              htmlFor="school_id"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.schoolName"]}
            </InputLabel>
            <AutoComplete
              disabled={noStudyExp}
              // multiple={true}
              id="school_id"
              value={
                school?.find(
                  (institute, index) =>
                    institute.id == studyData?.otherdata?.school_id
                ) || studyData?.otherdata?.school_id
              }
              onChange={(event, newValue, id) =>
                handleChange(event, newValue, id)
              }
              sx={{ width: "100%" }}
              placeholder={i18n["myCV.schoolPlaceholder"]}
              data={school}
            ></AutoComplete>
            {!school?.find(
              (institute, index) =>
                institute.id == studyData?.otherdata?.school_id
            ) &&
              !studyData?.otherdata?.school_id &&
              errors?.find((error) => error.key == "school_id") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "school_id").message
                  }`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "27%" }}>
            <InputLabel
              htmlFor="school_year_end"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.yearOfCompletionLabel"]}
            </InputLabel>
            <Select
              disabled={noStudyExp}
              id="school_year_end"
              name="school_year_end"
              defaultValue={studyData?.otherdata?.school_year_end}
              value={studyData?.otherdata?.school_year_end}
              onChange={(event) => handleChange(event)}
              sx={{
                width: "100%",
                borderRadius: "25px",
                height: "40px",
                background: "#fff",
              }}
            >
              {yearOptions.map((val) => (
                <MenuItem key={val} value={val?.key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
            {!studyData?.otherdata?.school_year_end &&
              errors?.find((error) => error.key == "school_year_end") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "school_year_end")
                      .message
                  }`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "20%", display: "flex", alignItems: "baseline" }}>
            <InputLabel
              htmlFor="school_completing"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.stillCompletingLabel"]}
            </InputLabel>
            <BlueSwitch
              disabled={noStudyExp}
              id="school_completed"
              name="school_completed"
              defaultChecked={
                studyData?.otherdata?.school_completed == "false" ? true : false
              }
              onChange={(event, id, name) =>
                handleSelectChange3(event, id, name)
              }
              // checked={noStudyExp}
            />
            {errors?.find((error) => error.key == "school_completed") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "school_completed")
                    .message
                }`}
              </Typography>
            )}
          </Box>
        </Box>

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
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 800,
                flex: 1,
              }}
            >
              {i18n["myCV.professionalAssociationLabel"]}
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
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ width: "43%" }}>
            <InputLabel
              htmlFor="association_id"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.associationLabel"]}
            </InputLabel>
            <AutoComplete
              disabled={noStudyExp}
              // multiple={true}
              id="association_id"
              defaultValue={getAssociationValue()}
              value={getAssociationValue()}
              onChange={(event, newValue, id) =>
                handleChange(event, newValue, id)
              }
              sx={{ width: "100%" }}
              placeholder={i18n["myCV.associationPlaceholder"]}
              data={association}
            ></AutoComplete>
            {getAssociationValue() == "" &&
              errors?.find((error) => error.key == "association_id") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "association_id")
                      .message
                  }`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "27%" }}>
            <InputLabel
              htmlFor="association_year_ended"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.yearOfCompletionLabel"]}
            </InputLabel>
            <Select
              disabled={noStudyExp}
              id="association_year_end"
              name="association_year_end"
              onChange={(event) => handleChange(event)}
              defaultValue={studyData?.otherdata?.association_year_end}
              value={studyData?.otherdata?.association_year_end}
              sx={{
                width: "100%",
                borderRadius: "25px",
                height: "40px",
                background: "#fff",
              }}
            >
              {yearOptions.map((val) => (
                <MenuItem key={val} value={val?.key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
            {!studyData?.otherdata?.association_year_end &&
              errors?.find((error) => error.key == "association_year_end") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "association_year_end")
                      .message
                  }`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "20%", display: "flex", alignItems: "baseline" }}>
            <InputLabel
              htmlFor="association_completed"
              sx={{
                color: "black",
                paddingLeft: "50px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.inProgressSwitchLabel"]}
            </InputLabel>

            <BlueSwitch
              disabled={noStudyExp}
              id="association_completed"
              name="association_completed"
              defaultChecked={
                studyData?.otherdata?.association_completed == "false"
                  ? true
                  : false
              }
              checked={
                studyData?.otherdata?.association_completed == "false"
                  ? true
                  : false
              }
              onChange={(event, id, name) =>
                handleSelectChange4(event, id, name)
              }
            />
            {errors?.find((error) => error.key == "association_completed") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "association_completed")
                    .message
                }`}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
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
            changeStep(2);
          }}
        >
          {CV_STEPS[1]}
        </StyledButton>

        <StyledButton
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
