import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import locale from "../../../i18n/locale";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { setAlert, setLoading } from "../../../redux/configSlice";
import {
  addDetailData,
  getDetailData,
  uploadSpecData,
} from "../../../redux/employer/postJobSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import Typography from "@mui/material/Typography";
import { POST_JOB_STEPS } from "../../../utils/Constants";
import TextEditor from "./TextEditor";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useParams } from "react-router-dom";

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: "24px",
  fontSize: "14px",
  width: "150px",
  border: `2px solid ${theme.palette.redButton100.main}`,
  "& .MuiSvgIcon-root": {
    fontSize: "16px",
  },
}));

const DETAIL = {
  role_summary: "",
  role_responsibilty: "",
  role_requirements: "",
};

const i18n = locale.en;
export default function TheDetails({ changeStep }) {
  const fileAccept = "application/pdf, application/doc, application/docx";

  const dispatch = useDispatch();
  const { jobId } = useParams();
  const hiddenFileInput = useRef(null);

  const [detailData, setDetailData] = useState({ ...DETAIL, job_id: jobId });
  const [errors, setErrors] = useState([]);
  const [specName, setspecName] = useState("No file chosen");

  const getAllTheDetails = async () => {
    // const { payload } = await dispatch();
    try {
      dispatch(setLoading(true));
      const { payload } = await dispatch(getDetailData(jobId));
      if (payload?.status == "success") {
        const detail = payload?.data;
        setDetailData({ ...detail, job_id: jobId });
        setErrors([]);
      } else if (payload?.status == "error") {
        payload?.message?.length > 0 && setErrors(payload?.message);
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

  const saveDetail = async () => {
    try {
      console.log(detailData);
      const { payload } = await dispatch(addDetailData(detailData));
      if (payload?.status == "success") {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Details Data added successfully!",
          })
        );
        changeStep(3);
        setErrors([]);
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

  useEffect(() => {
    jobId != undefined && getAllTheDetails();
  }, [jobId]);

  const handleInputChange = (inputText, type) => {
    const newDetailData = {
      ...detailData,
      [type]: inputText,
    };
    setDetailData(newDetailData);
  };

  const handleFileClick = () => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = async (event) => {
    const formData = new FormData();
    formData.append("jobspec", event.target.files[0]);
    formData.append("job_id", jobId);
    try {
      const { payload } = await dispatch(uploadSpecData(formData));
      if (payload?.status == "success") {
        setspecName(event.target.files[0].name);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Spec uploaded Successfully!",
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

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <input
            accept={fileAccept}
            ref={hiddenFileInput}
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <StyledButton
              variant="outlined"
              color="redButton100"
              onClick={handleFileClick}
            >
              {i18n["postAJob.uploadSpec"]}
            </StyledButton>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 400,
                ml: 1,
                mt: "4px",
              }}
            >
              {specName}
            </Typography>
          </Box>
          <StyledButton
            sx={{ opacity: 0.5 }}
            variant="contained"
            color="redButton100"
          >
            {i18n["postAJob.scrapeSpec"]}
          </StyledButton>
        </Box>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            ml: 1,
            mb: 1,
          }}
        >
          {POST_JOB_STEPS[1]}
        </Typography>
        <Box>
          <TextEditor
            value={detailData?.role_summary}
            title={i18n["postAJob.howTheyWillRole"]}
            type="role_summary"
            onInputCHange={handleInputChange}
          />
          {detailData?.role_summary == "" &&
            errors.find((error) => error.key == "role_summary") && (
              <Typography color={"red"}>
                {`*${
                  errors.find((error) => error.key == "role_summary").message
                }`}
              </Typography>
            )}
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextEditor
            value={detailData?.role_responsibilty}
            title={i18n["postAJob.whatTheyWillDo"]}
            type="role_responsibilty"
            onInputCHange={handleInputChange}
          />
          {detailData?.role_responsibilty == "" &&
            errors.find((error) => error.key == "role_responsibilty") && (
              <Typography color={"red"}>
                {`*${
                  errors.find((error) => error.key == "role_responsibilty")
                    .message
                }`}
              </Typography>
            )}
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextEditor
            value={detailData.role_requirements}
            title={i18n["postAJob.whatTheyWillNeed"]}
            type="role_requirements"
            onInputCHange={handleInputChange}
          />
          {detailData.role_requirements == "" &&
            errors.find((error) => error.key == "role_requirements") && (
              <Typography color={"red"}>
                {`*${
                  errors.find((error) => error.key == "role_requirements")
                    .message
                }`}
              </Typography>
            )}
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
            changeStep(1);
          }}
        >
          {POST_JOB_STEPS[0]}
        </StyledButton>
        <StyledButton
          onClick={saveDetail}
          // onClick={handleNext}
          variant="outlined"
          color="redButton100"
        >
          {i18n["postAJob.theCulture"]}
        </StyledButton>
      </Box>
    </>
  );
}
