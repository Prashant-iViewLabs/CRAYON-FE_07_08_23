import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import locale from "../../../i18n/locale";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import { CV_STEPS, POST_JOB_STEPS } from "../../../utils/Constants";
import InputBox from "../../common/InputBox";
import Slider from "@mui/material/Slider";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import { alpha } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  addCultureData,
  getCultureData,
  getPersonalities,
  getSkills,
  getTraits,
} from "../../../redux/employer/postJobSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import { setAlert, setLoading } from "../../../redux/configSlice";
import SelectMenu from "../../common/SelectMenu";
import AutoComplete from "../../common/AutoComplete";
import { addId } from "../../../utils/Common";
import { cloneDeep, isEmpty } from "lodash";
import {
  Checkbox,
  Chip,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useSelector } from "react-redux";
import StyledButton from "../../common/StyledButton";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";

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

const SCREEN_QUESTIONS = {
  job_id: "",
  question: "",
};

const CULTURE = {
  jobDetails: {
    user_id: "",
    job_id: "",
    primary_personality: "",
    shadow_personality: "",
    grit_score: "",
  },
  screen_questions: [],
  traits: [],
};

const marks = [
  {
    value: 0,
    label: "00",
  },
  {
    value: 25,
    label: "25",
  },
  {
    value: 50,
    label: "50",
  },
  {
    value: 75,
    label: "75",
  },
  {
    value: 100,
    label: "100",
  },
];

export default function CultureAdd({ changeStep }) {
  const i18n = locale.en;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [cultureData, setCultureData] = useState({ ...CULTURE });
  const [errors, setErrors] = useState([]);
  const { jobId } = useParams();
  const [selectedCount, setSelectedCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { personalities, traits } = useSelector((state) => state.postJobs);

  const getAllCultureData = async () => {
    try {
      dispatch(setLoading(true));
      const { payload } = await dispatch(getCultureData(jobId));
      if (payload?.status == "success") {
        const basic = payload?.data;
        setCultureData(basic);
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: payload?.message,
          })
        );
      }
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

  const getAllData = async () => {
    try {
      dispatch(setLoading(true));
      await Promise.all([dispatch(getPersonalities()), dispatch(getTraits())]);
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

  const saveCulture = async () => {
    try {
      const culturePayload = {
        job_id: cultureData.jobDetails.job_id,
        primary_personality: cultureData.jobDetails.primary_personality,
        shadow_personality: cultureData.jobDetails.shadow_personality,
        grit_score: cultureData.jobDetails.grit_score,
        screen_questions: [...cultureData.screen_questions],
        traits: [...cultureData.traits],
      };
      const { payload } = await dispatch(addCultureData(culturePayload));
      if (payload?.status == "success") {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Culture Data added successfully!",
          })
        );
        setErrors([]);
        setTimeout(() => {
          navigate("/employer/my-jobs");
        }, [500]);
      } else if (payload?.status == "error") {
        setErrors(payload?.errors);
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

  const handleChange = (event) => {
    const {
      target: { value },
      target: { name },
    } = event;
    if (
      cultureData.jobDetails.primary_personality == value ||
      cultureData.jobDetails.shadow_personality == value
    ) {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: "Primary and Shadow Personality should not be similar",
        })
      );
      return;
    }

    const newCultureData = {
      ...cultureData,
      jobDetails: {
        ...cultureData.jobDetails,
        [name]: value,
      },
    };

    const filteredErrors = errors?.filter((item) => item.key != name);
    // setErrors(filteredErrors);
    setCultureData(newCultureData);
  };

  const textValue = (value) => {
    return value;
  };

  const handleMultipleAutoComplete = (event, newValue, id) => {
    if (newValue.length <= 5) {
      let newCultureData = {
        ...cultureData,
        [id]: newValue.map((val) => val?.inputValue || val?.trait_id || val),
      };
      const filteredErrors = errors?.filter((item) => item.key != id);
      // setErrors(filteredErrors);
      setSelectedCount(newValue.length);
      setCultureData(newCultureData);
    } else {
      newValue.splice(5, 1);
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: "You can't add more than 5 traits!!",
        })
      );
    }
  };

  const handleAutoFill = (event) => {
    const {
      target: { value },
      target: { name },
    } = event;
  };

  const getTraitsValue = () => {
    if (cultureData.traits?.length == 0) {
      return [];
    }

    return cultureData.traits?.map(
      (id) => traits?.find((trait) => trait.id == id) || id
    );
  };

  const rangeHandler = (event) => {
    const {
      target: { value },
      target: { name },
      target: { id },
    } = event;

    const newCultureData = {
      ...cultureData,
      jobDetails: {
        ...cultureData.jobDetails,
        [name]: value,
      },
    };

    const filteredErrors = errors?.filter((item) => item.key != name);
    setErrors(filteredErrors);
    setCultureData(newCultureData);
  };

  const handleQuestionChange = (event, index) => {
    const {
      target: { value },
      target: { id },
    } = event;

    let newCultureData = cloneDeep(cultureData);
    newCultureData.screen_questions[index] = {
      [id]: value,
      job_id: Number(jobId),
    };
    setCultureData(newCultureData);
  };

  const addQuestion = () => {
    const newCultureData = {
      ...cultureData,
      screen_questions: [...cultureData?.screen_questions, SCREEN_QUESTIONS],
    };

    const filteredErrors = errors?.filter(
      (item) => item.key != "screen_questions"
    );
    setErrors(filteredErrors);
    setCultureData(newCultureData);
  };
  const removeQuestion = (event, index) => {
    if (cultureData?.screen_questions?.length >= 1) {
      const newquestions = cultureData?.screen_questions.filter(
        (data, i) => i + 1 != index
      );
      const newCultureData = {
        ...cultureData,
        screen_questions: newquestions,
      };
      setCultureData(newCultureData);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    jobId != undefined && getAllCultureData();
  }, [jobId]);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          ml: 1,
          mb: 2,
        }}
      >
        {i18n["postAJob.cultureAdd"]}
      </Typography>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ width: "100%" }}>
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
              {i18n["postAJob.primaryLabel"]}
            </InputLabel>
            <SelectMenu
              name="primary_personality"
              value={cultureData?.jobDetails?.primary_personality}
              onHandleChange={handleChange}
              options={personalities}
              sx={{ width: "95%" }}
              placeholder={i18n["postAJob.preferredDominantPersonality"]}
            />
            {!cultureData?.jobDetails?.primary_personality &&
              errors?.find((error) => error.key == "primary_personality") && (
                <Typography color={"red"}>
                  {`*${
                    errors?.find((error) => error.key == "primary_personality")
                      .message
                  }`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "100%" }}>
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
              {i18n["postAJob.shadowLabel"]}
            </InputLabel>

            <SelectMenu
              name="shadow_personality"
              value={cultureData?.jobDetails?.shadow_personality}
              onHandleChange={handleChange}
              options={personalities}
              sx={{ width: "95%" }}
              placeholder={i18n["postAJob.preferredShadowPersonality"]}
            />
            {!cultureData?.jobDetails?.shadow_personality &&
              errors?.find((error) => error.key == "shadow_personality") && (
                <Typography color={"red"}>
                  {`*${
                    errors?.find((error) => error.key == "shadow_personality")
                      .message
                  }`}
                </Typography>
              )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ width: "100%" }}>
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
              {i18n["postAJob.traitsLabel"]}
            </InputLabel>

            <AutoComplete
              multiple={true}
              id="traits"
              name="traits"
              value={getTraitsValue()}
              onChange={handleMultipleAutoComplete}
              sx={{ width: "95%", display: "inline-table" }}
              placeholder={i18n["postAJob.preferredTraits"]}
              data={traits}
              limitTags={5}
              disableCloseOnSelect={true}
            ></AutoComplete>

            {getTraitsValue() == "" &&
              errors?.find((error) => error.key == "traits") && (
                <Typography color={"red"}>
                  {`*${errors?.find((error) => error.key == "traits").message}`}
                </Typography>
              )}
          </Box>
          <Box sx={{ width: "100%" }}>
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
              {i18n["postAJob.gritScoreLabel"]}
            </InputLabel>

            <Slider
              name="grit_score"
              aria-label="Custom marks"
              color="redButton100"
              value={cultureData?.jobDetails?.grit_score}
              getAriaValueText={textValue}
              step={1}
              onChange={(event) => rangeHandler(event)}
              valueLabelDisplay="auto"
              valueLabelFormat={textValue}
              marks={marks}
              sx={{ width: "88%", ml: 2 }}
            />
            {errors?.find((error) => error.key == "grit_score") && (
              <Typography color={"red"}>
                {`*${
                  errors?.find((error) => error.key == "grit_score").message
                }`}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            ml: 1,
            mb: 2,
          }}
        >
          {i18n["postAJob.screeningQuestions"]}
        </Typography>
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: 300,
            ml: 1,
            mb: 2,
          }}
        >
          {i18n["postAJob.screeningQuestionPara"]}
        </Typography>
        {errors?.find((error) => error.key == "screen_questions") && (
          <Typography color={"red"}>
            {`*${
              errors?.find((error) => error.key == "screen_questions").message
            }`}
          </Typography>
        )}
        {cultureData?.screen_questions?.length > 0 &&
          cultureData?.screen_questions?.map((question, index) =>
            index < 5 ? (
              <Box key={index} sx={{ display: "flex" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                    width: "90%",
                  }}
                >
                  <InputBox
                    id="question"
                    sx={{ width: "97%" }}
                    value={question.question}
                    onChange={(event) => handleQuestionChange(event, index)}
                    placeholder={i18n["postAJob.question"] + `0${index + 1}`}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ mr: "53px" }}>
                    {index >= 0 ? (
                      <IconButton
                        aria-label="edit"
                        color="redButton"
                        sx={{
                          padding: "0 !important",
                        }}
                        onClick={(event) => removeQuestion(event, index + 1)}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </Box>
                </Box>
              </Box>
            ) : (
              ""
            )
          )}
        <Button
          variant="outlined"
          component="label"
          onClick={addQuestion}
          color="redButton100"
          sx={{
            marginTop: "30px",
            transform: "translateY(-50%)",
            "@media (max-width: 600px)": {
              fontSize: "12px",
              padding: "6px 12px",
            },
          }}
        >
          {i18n["postAJob.addButton"]}
        </Button>
        <Box
          sx={{
            border: "1px solid gray",
            borderRadius: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            marginTop: "25px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 500,
              }}
            >
              {i18n["postAJob.videoLabel"]}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 300,
              }}
            >
              {i18n["postAJob.videoParaLabel"]}
            </Typography>
          </Box>

          <BlueSwitch />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 16,
        }}
      >
        <StyledButton
          startIcon={<ArrowBackIosIcon />}
          variant="outlined"
          sx={{ border: "none" }}
          color="redButton100"
          onClick={() => {
            changeStep(2);
          }}
        >
          {POST_JOB_STEPS[1]}
        </StyledButton>
        <StyledButton
          // disabled={!jobId}
          sx={{ mr: 0 }}
          variant="contained"
          color="redButton100"
          onClick={saveCulture}
        >
          {i18n["postAJob.save"]}
        </StyledButton>
      </Box>
    </Box>
  );
}
