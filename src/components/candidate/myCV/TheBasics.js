import { useEffect, useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import { CV_STEPS } from "../../../utils/Constants";
import InputBox from "../../common/InputBox";
import SelectMenu from "../../common/SelectMenu";
import Slider from "@mui/material/Slider";
import {
  getTitles,
  getIndustries,
  getSkills,
  getWorkExperience,
  getNoticePeriod,
  getQualifications,
  getCurrency,
  uploadCv,
  uploadPortfolio,
  getSalary,
  addBasicData,
} from "../../../redux/candidate/myCvSlice";

import { setAlert, setLoading } from "../../../redux/configSlice";
import { ALERT_TYPE, ERROR_MSG, WORK_TYPE } from "../../../utils/Constants";
import AutoComplete from "../../common/AutoComplete";
import { InputLabel } from "@mui/material";
import { getLocalStorage, setLocalStorage } from "../../../utils/Common";
import { isEmpty } from "lodash";
import {
  getRoleTypes,
  getWorkSetup,
} from "../../../redux/employer/postJobSlice";
import { getCVBasics } from "../../../redux/candidate/myCVNew";
import StyledButton from "../../common/StyledButton";

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "2 yrs",
  },
  {
    value: 40,
    label: "4 yrs",
  },
  {
    value: 60,
    label: "6yrs",
  },
  {
    value: 80,
    label: "8yrs",
  },
  {
    value: 100,
    label: "10yrs",
  },
];
function textValue(value) {
  return value / 10;
}
const rangeMarks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "20,000",
  },
  {
    value: 40,
    label: "40,000",
  },
  {
    value: 60,
    label: "60,000",
  },
  {
    value: 80,
    label: "80,000",
  },
  {
    value: 100,
    label: "100000+",
  },
];

const rangeMarks2 = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "100",
  },
  {
    value: 40,
    label: "200",
  },
  {
    value: 60,
    label: "300",
  },
  {
    value: 80,
    label: "400",
  },
  {
    value: 100,
    label: "500+",
  },
];

function rangeValueHandler(value) {
  return value * 1000;
}
function rangeValueHandler2(value) {
  return value * 5;
}

const noticePeriodMarks = [
  {
    value: 0,
    label: "Immediate",
  },
  {
    value: 20,
    label: "1 Week",
  },
  {
    value: 40,
    label: "2 week",
  },
  {
    value: 60,
    label: "30 Days",
  },
  {
    value: 80,
    label: "Calender Month",
  },
  {
    value: 100,
    label: "2 months",
  },
];
function noticeValue(value) {
  return value / 10;
}

const BASIC = {
  current_job_title_id: "",
  dream_job_title_id: "",
  industries: [],
  tags: [],
  experience_id: 0,
  notice_period_id: "",
  qualification_level: "",
  employment_type: "",
  salary: [],
  currency_id: "",
  portfolio_link: "",
  work_setup: "",
  experience: [],
};

const SALARY_OBJ = {
  min: 0,
  max: 0,
  step: 0,
};

const i18n = locale.en;

export default function TheBasics({ changeStep }) {
  const fileAccept = "application/pdf, application/doc, application/docx";

  const dispatch = useDispatch();
  const hiddenFileInput = useRef(null);
  const hiddenFileInput2 = useRef(null);
  const [basicData, setBasicData] = useState(BASIC);
  const [salaryObj, setSalaryObj] = useState(SALARY_OBJ);
  const [rangeValue, setRangeValue] = useState([0, 20]);
  const [expRange, setExpRange] = useState([0, 1]);
  const [workSetup, setWorkSetup] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [errors, setErrors] = useState([]);
  const [cvName, setCvName] = useState("No file chosen");
  const [portfolioName, setPortfolioName] = useState("No file chosen");

  const handleSaveButton = async () => {
    try {
      console.log("BASIC DATA", basicData);
      console.log(cvName);
      if (cvName == "No file chosen") {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: "Please Upload Your CV First",
          })
        );
        return;
      }
      const { payload } = await dispatch(addBasicData(basicData));
      if (payload?.status == "success") {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Basic data added successfully!",
          })
        );
        changeStep(2);
        setErrors([]);
      } else if (payload?.status == "error") {
        // console.log(payload?.data?.message);
        console.log("ERROR", payload);
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

  const {
    titles,
    industries,
    skills,
    experiences,
    noticePeriod,
    qualifications,
    currency,
    salary,
  } = useSelector((state) => state.myCv);

  const getAllData = async () => {
    try {
      dispatch(setLoading(true));
      await Promise.all([
        dispatch(getTitles()),
        dispatch(getIndustries()),
        dispatch(getSkills()),
        dispatch(getWorkExperience()),
        dispatch(getNoticePeriod()),
        dispatch(getQualifications()),
        dispatch(getCurrency()),
      ]);
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
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

  const getWorkSet = async () => {
    try {
      dispatch(setLoading(true));
      const [workSetup, roleTypes] = await Promise.all([
        dispatch(getWorkSetup()),
        dispatch(getRoleTypes()),
      ]);
      setWorkSetup(workSetup.payload.data);
      setRoleTypes(roleTypes.payload.data);

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

  const getCVBasicData = async () => {
    const { payload } = await dispatch(getCVBasics());
    if (payload?.status == "success" || payload?.status == "sucess") {
      if (payload?.message == "cv basic is not completed") {
        setBasicData(BASIC);
        return;
      }

      const basic = payload?.data;
      basic.industries = basic?.industry_id;
      const salary = basic?.salary?.map((item) => {
        return basic?.employment_type != "freelance" ? item / 1000 : item / 5;
      });

      const experience = basic.experience.map((item) => {
        return item * 10;
      });

      setBasicData(basic);
      setExpRange(experience);
      setRangeValue(salary == "undefined" ? [] : salary);
      setCvName(basic.cv_link);
    } else if (payload?.status == "error") {
      // dispatch(
      //   setAlert({
      //     show: true,
      //     type: ALERT_TYPE.ERROR,
      //     msg: "Fill the basic details",
      //   })
      // );
      return;
    } else {
      return;
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    getAllData();
    getCVBasicData();
    getWorkSet();
  }, []);

  const handleFileClick = () => {
    hiddenFileInput.current.click();
  };
  const handlePortClick = () => {
    hiddenFileInput2.current.click();
  };

  const handleFileChange = async (event) => {
    const formData = new FormData();
    formData.append("cv", event.target.files[0]);
    console.log(formData);
    try {
      const { payload } = await dispatch(uploadCv(formData));
      if (payload?.status == "success") {
        setCvName(event.target.files[0].name);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "CV uploaded Successfully!",
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
  const handlePortChange = async (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    if (!selectedFile) {
      return;
    }
    console.log(event.target.files[0]);
    const formData = new FormData();
    formData.append("portfolio", event.target.files[0]);
    setTimeout(() => {
      console.log("FORM DATA", formData);
    }, 1000);
    try {
      const { payload } = await dispatch(uploadPortfolio(formData));
      if (payload?.status == "success") {
        setPortfolioName(event.target.files[0].name);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Portfolio uploaded Successfully!",
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

  const handleRangeSlider = (event, newValue) => {
    setRangeValue(newValue);
    console.log(event, newValue);
    let newArr = newValue?.map((val) => val * 1000);
    console.log(newArr);
    const newBasicData = {
      ...basicData,
      [event.target.name]: newArr,
    };
    console.log(newBasicData);
    const filteredErrors = errors?.filter(
      (item) => item.key != event.target.name
    );
    setErrors(filteredErrors);
    setBasicData(newBasicData);
  };

  const handleRangeSlider2 = (event, newValue) => {
    setRangeValue(newValue);
    let newArr = newValue?.map((val) => val * 5);
    const newBasicData = {
      ...basicData,
      [event.target.name]: newArr,
    };

    const filteredErrors = errors?.filter(
      (item) => item.key != event.target.name
    );
    setErrors(filteredErrors);
    setBasicData(newBasicData);
  };

  const handleWorkSetup = (event) => {
    const {
      target: { value },
      target: { name },
      target: { id },
    } = event;
    const newBasicData = {
      ...basicData,
      [name || id]: workSetup.find((work) => work.id == value).name,
    };
    setBasicData(newBasicData);
  };

  const expHandleChange = (event) => {
    const {
      target: { value },
      target: { name },
      target: { id },
    } = event;

    const newBasicData = {
      ...basicData,
      [name]: value / 10,
    };
    const filteredErrors = errors?.filter(
      (item) => item.key != event.target.name
    );
    setErrors(filteredErrors);
    setBasicData(newBasicData);
  };
  const noticeHandleChange = (event) => {
    const {
      target: { value },
      target: { name },
      target: { id },
    } = event;

    const newBasicData = {
      ...basicData,
      [name]: value / 10,
    };
    const filteredErrors = errors?.filter((item) => item.key != name);
    setErrors(filteredErrors);
    setBasicData(newBasicData);
  };

  const handleChange = (event) => {
    const {
      target: { value },
      target: { name },
      target: { id },
    } = event;

    const newBasicData = {
      ...basicData,
      [name || id]:
        name == "salary"
          ? salary?.find((sal) => sal?.max == value).salary_id
          : value,
    };
    setBasicData(newBasicData);
  };

  const handleAutoComplete = (event, newValue, id) => {
    let newBasicData = {};

    if (typeof newValue === "string") {
      newBasicData = {
        ...basicData,
        [id]: newValue,
      };
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      newBasicData = {
        ...basicData,
        [id]: newValue.inputValue,
      };
    } else {
      newBasicData = {
        ...basicData,
        [id]: newValue?.id,
      };
    }
    setBasicData(newBasicData);
  };

  const handleJobRoleChange = (event) => {
    const {
      target: { value },
      target: { name },
      target: { id },
    } = event;

    const newBasicData = {
      ...basicData,
      [name]: roleTypes.find((role) => role.id == value).name,
    };
    setBasicData(newBasicData);
  };

  const handleMultipleAutoComplete = (event, newValue, id) => {
    let newBasicData = {};
    newBasicData = {
      ...basicData,
      [id]: newValue?.map((val) => val?.inputValue || val?.id || val),
    };
    setBasicData(newBasicData);
  };

  const getIndValue = () => {
    if (basicData.industries?.length == 0) {
      return [];
    }
    return basicData.industries?.map(
      (industry) => industries?.find((ind) => ind.id == industry) || industry
    );
  };

  const getSkillValue = () => {
    if (basicData.tags?.length == 0) {
      return [];
    }
    return basicData.tags?.map(
      (skill) => skills?.find((sk) => sk.id == skill) || skill
    );
  };

  const getSalaryData = async (currency_id) => {
    try {
      dispatch(setLoading(true));
      const {
        payload: { data },
      } = await dispatch(getSalary(currency_id));
      console.log(data);
      setSalaryObj({
        min: data[0].max,
        max: data[data.length - 1].max,
        step: data[1].max - data[0].max,
      });
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
    if (basicData.currency_id) {
      console.log(basicData.currency_id);
      getSalaryData(basicData.currency_id);
    }
  }, [basicData.currency_id]);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          ml: 1,
        }}
      >
        {CV_STEPS[0]}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <input
          accept={fileAccept}
          ref={hiddenFileInput}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          required
        />
        <StyledButton
          onClick={handleFileClick}
          variant="outlined"
          color="redButton100"
          sx={{ mt: 1 }}
        >
          {i18n["myCV.uploadCV"]}
        </StyledButton>
        <StyledButton
          sx={{ opacity: 0.5, mt: 1 }}
          variant="contained"
          color="redButton100"
        >
          {i18n["myCV.scrapeCV"]}
        </StyledButton>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            ml: 1,
            mt: "4px",
          }}
        >
          {cvName}
        </Typography>
      </Box>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="current_job_title"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.currentJobTitleLabel"]}
            </InputLabel>
            {console.log(basicData)}
            <AutoComplete
              id="current_job_title_id"
              value={
                titles?.find(
                  (title) => title.id == basicData.current_job_title_id
                ) || basicData.current_job_title_id
              }
              // defaultValue={basicData.current_job_title_id}
              onChange={handleAutoComplete}
              sx={{ width: "94%" }}
              placeholder={i18n["myCV.currentJobTitle"]}
              data={titles}
              showAddOption={true}
            ></AutoComplete>
            {!titles?.find(
              (title) => title.id == basicData.current_job_title_id
            ) &&
              !basicData.current_job_title_id &&
              errors?.find((error) => error.key == "current_job_title_id") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "current_job_title_id")
                      .message
                  }`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="dream_job_title_id"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.dreamNextJobLabel"]}
            </InputLabel>
            <AutoComplete
              id="dream_job_title_id"
              value={
                titles?.find(
                  (title) => title.id == basicData.dream_job_title_id
                ) || basicData.dream_job_title_id
              }
              onChange={handleAutoComplete}
              sx={{ width: "94%" }}
              placeholder={i18n["myCV.dreamNextJobTitle"]}
              data={titles}
              showAddOption={true}
            ></AutoComplete>
            {!titles?.find(
              (title) => title.id == basicData.dream_job_title_id
            ) &&
              !basicData.dream_job_title_id &&
              errors?.find((error) => error.key == "dream_job_title_id") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "dream_job_title_id")
                      .message
                  }`}
                </Typography>
              )}
          </Box>
        </Box>
        <Box sx={{ mb: 3 }}>
          <InputLabel
            htmlFor="industries"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myCV.industriesLabel"]}
          </InputLabel>
          <AutoComplete
            multiple={true}
            id="industries"
            value={getIndValue()}
            onChange={handleMultipleAutoComplete}
            sx={{ width: "97%", display: "inline-table" }}
            placeholder={i18n["myCV.preferredIndustries"]}
            data={industries}
          ></AutoComplete>
          {getIndValue() == "" &&
            errors?.find((error) => error.key == "industries") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "industries").message
                }`}
              </Typography>
            )}
        </Box>
        <Box sx={{ mb: 3 }}>
          <InputLabel
            htmlFor="tags"
            sx={{
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {i18n["myCV.skillsLabel"]}
          </InputLabel>
          <AutoComplete
            multiple={true}
            id="tags"
            value={getSkillValue()}
            onChange={handleMultipleAutoComplete}
            sx={{ width: "97%", display: "inline-table" }}
            placeholder={i18n["myCV.skills"]}
            data={skills}
          ></AutoComplete>
          {getSkillValue() == "" &&
            errors?.find((error) => error.key == "tags") && (
              <Typography color={"red !important"}>
                {`*${errors?.find((error) => error.key == "tags").message}`}
              </Typography>
            )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="experience"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.yearsOfExperienceLabel"]}
            </InputLabel>
            <Slider
              name="experience_id"
              aria-label="Custom marks"
              // defaultValue={0}
              // value={basicData.experience_id*10}
              value={
                experiences.find((val) => val.id === basicData.experience_id)
                  ?.id * 10 || 0
              }
              color="redButton100"
              getAriaValueText={textValue}
              step={10}
              onChange={expHandleChange}
              valueLabelDisplay="auto"
              valueLabelFormat={textValue}
              marks={marks}
              sx={{ width: "88%", ml: 2 }}
            />
            {errors?.find((error) => error.key == "experience") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "experience").message
                }`}
              </Typography>
            )}
          </Box>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="notice_period_id"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.noticePeriodLabel"]}
            </InputLabel>
            <Slider
              aria-label="Custom marks"
              name="notice_period_id"
              value={
                noticePeriod.find(
                  (val) => val.id === basicData.notice_period_id
                )?.id * 10 || 0
              }
              color="redButton100"
              getAriaValueText={noticeValue}
              onChange={noticeHandleChange}
              step={20}
              sx={{ width: "88%", ml: 2 }}
              marks={noticePeriodMarks}
            />
            {errors?.find((error) => error.key == "notice_period_id") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "notice_period_id")
                    .message
                }`}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="qualification_level"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.qualificationLevelLabel"]}
            </InputLabel>
            <SelectMenu
              name="qualification_level"
              value={basicData.qualification_level}
              onHandleChange={handleChange}
              options={qualifications}
              sx={{ width: "94%" }}
              placeholder={i18n["myCV.highestQualificationLevel"]}
            />
            {!basicData.qualification_level &&
              errors?.find((error) => error.key == "qualification_level") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "qualification_level")
                      .message
                  }`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="employment_type"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.preferedWorkTypeLabel"]}
            </InputLabel>
            <SelectMenu
              name="employment_type"
              value={basicData.employment_type}
              onHandleChange={handleJobRoleChange}
              options={roleTypes}
              sx={{ width: "94%" }}
              placeholder={i18n["myCV.preferredWorkType"]}
            />
            {!basicData.employment_type &&
              errors?.find((error) => error.key == "employment_type") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "employment_type")
                      .message
                  }`}
                </Typography>
              )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="currency_id"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.preferedCurrencyLabel"]}
            </InputLabel>
            <SelectMenu
              name="currency_id"
              value={basicData?.currency_id}
              onHandleChange={handleChange}
              options={currency}
              sx={{ width: "94%" }}
              placeholder={i18n["myCV.preferredCurrency"]}
            />
            {!basicData?.currency_id &&
              errors?.find((error) => error.key == "currency_id") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "currency_id").message
                  }`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="salary"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {basicData.employment_type == "freelance"
                ? i18n["myCV.requiredSalaryRangeLabel2"]
                : i18n["myCV.requiredSalaryRangeLabel"]}
            </InputLabel>
            {console.log(salaryObj)}
            <Slider
              disableSwap
              sx={{ width: "89%", ml: 1 }}
              disabled={salaryObj.step == 0}
              name="salary"
              getAriaLabel={() => "Temperature range"}
              value={rangeValue}
              // step={basicData.employment_type == "freelance" && 1}
              onChange={
                basicData.employment_type == "freelance"
                  ? handleRangeSlider2
                  : handleRangeSlider
              }
              color="redButton100"
              valueLabelDisplay="auto"
              valueLabelFormat={
                basicData.employment_type == "freelance"
                  ? rangeValueHandler2
                  : rangeValueHandler
              }
              getAriaValueText={
                basicData.employment_type == "freelance"
                  ? rangeValueHandler2
                  : rangeValueHandler
              }
              marks={
                basicData.employment_type == "freelance"
                  ? rangeMarks2
                  : rangeMarks
              }
            />
            {errors?.find((error) => error.key == "salary") && (
              <Typography color={"red !important"}>
                {`*${errors?.find((error) => error.key == "salary").message}`}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="work_setup"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["postAJob.workSetupLable"]}
            </InputLabel>
            <SelectMenu
              name="work_setup"
              value={basicData.work_setup}
              onHandleChange={handleWorkSetup}
              options={workSetup}
              sx={{ width: "94%" }}
              placeholder={i18n["postAJob.workSetupPlaceholder"]}
            />
            {!basicData.work_setup &&
              errors?.find((error) => error.key == "work_setup") && (
                <Typography color={"red !important"}>
                  {`*${
                    errors?.find((error) => error.key == "work_setup").message
                  }`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "100%" }}>
            <InputLabel
              htmlFor="portfolio_link"
              sx={{
                color: "black",
                paddingLeft: "10px",
                paddingBottom: "2px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {i18n["myCV.portfolioLabel"]}
            </InputLabel>
            <Box sx={{ display: "flex", mb: 1, position: "relative" }}>
              <Box sx={{ width: "100%", position: "relative" }}>
                <InputBox
                  id="portfolio_link"
                  value={basicData.portfolio_link}
                  onChange={handleChange}
                  sx={{ width: "94%" }}
                  placeholder={i18n["myCV.portfolioLink"]}
                />
                {!basicData.portfolio_link &&
                  errors?.find((error) => error.key == "portfolio_link") && (
                    <Typography color={"red !important"}>
                      {`*${
                        errors?.find((error) => error.key == "portfolio_link")
                          .message
                      }`}
                    </Typography>
                  )}
                <input
                  accept={fileAccept}
                  ref={hiddenFileInput2}
                  type="file"
                  onChange={handlePortChange}
                  style={{ display: "none" }}
                />
                <StyledButton
                  onClick={handlePortClick}
                  variant="outlined"
                  color="redButton100"
                  sx={{
                    position: "absolute",
                    top: "10%",
                    right: 12,
                    transform: "translateY(-50%)",
                    "@media (max-width: 600px)": {
                      fontSize: "12px",
                      padding: "6px 12px",
                    },
                  }}
                >
                  {i18n["myCV.addPortfolio"]}
                </StyledButton>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    ml: 1,
                    mt: "4px",
                  }}
                >
                  {portfolioName}
                </Typography>
              </Box>
            </Box>
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
