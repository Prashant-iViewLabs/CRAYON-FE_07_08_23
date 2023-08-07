import React, { useRef, useState } from "react";
import {
  postAnswers,
  postAnswersWithoutLogin,
} from "../../../redux/guest/getQuestions";
import { useDispatch } from "react-redux";
import { ALERT_TYPE } from "../../../utils/Constants";
import { Box, Button, Paper, Typography } from "@mui/material";
import InputBox from "../../common/InputBox";
import locale from "../../../i18n/locale";
import { useNavigate } from "react-router-dom";
import { setAlert } from "../../../redux/configSlice";
import CustomDialog from "../../common/CustomDialog";
import StyledButton from "../../common/StyledButton";
import {
  uploadCv,
  uploadCvWithoutLogin,
} from "../../../redux/candidate/myCvSlice";
import jwt_decode from "jwt-decode";
import { setLocalStorage } from "../../../utils/Common";
import Signup from "../../login/signup";
import { useTheme } from "@emotion/react";
import Login from "../../login/login";
import { login } from "../../../redux/login/loginSlice";

export default function ApplyJobs({ questions, setopenApplyJobDialog }) {
  const fileAccept = "application/pdf, application/doc, application/docx";
  const hiddenFileInput = useRef(null);

  const i18n = locale.en;
  const dispatch = useDispatch();
  const theme = useTheme();
  const history = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [cvName, setCvName] = useState("No file chosen");
  const [openCVDialog, setopenCVDialog] = useState(false);
  const [openSignUpLogin, setOpenSignUpLogin] = useState(false);
  const [openSignUpDialog, setOpenSignUpDialog] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  const handleApply = async () => {
    try {
      const { payload } = await dispatch(
        decodedToken?.data?.role_id === undefined
          ? postAnswersWithoutLogin({
              data: answers,
              job_id: questions?.at(0).job_id,
            })
          : postAnswers({ data: answers, job_id: questions?.at(0).job_id })
      );
      if (payload?.status === "sccess") {
        if (decodedToken?.data?.role_id === undefined) {
          setopenCVDialog(true);
          setopenApplyJobDialog(false);
        } else {
          history("/candidate/my-jobs");
        }
        setLocalStorage("job_id", payload.job_id);
        setLocalStorage("jobs_user_id", payload.jobs_user_id);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Applied Successfully",
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
      setopenCVDialog(true);
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: "",
        })
      );
    }
  };
  const handleChange = (event, id) => {
    if (answers.find((item) => item.question_id === id)) {
      setAnswers(
        answers.map((item) =>
          item.question_id === id
            ? { ...item, answer: event.target.value }
            : item
        )
      );
    } else {
      setAnswers([...answers, { question_id: id, answer: event.target.value }]);
    }
  };

  const handleFileChange = async (event) => {
    const formData = new FormData();
    formData.append(
      decodedToken?.data?.role_id === undefined ? "tempcv" : "cv",
      event.target.files[0]
    );
    try {
      const { payload } = await dispatch(
        decodedToken?.data?.role_id === undefined
          ? uploadCvWithoutLogin(formData)
          : uploadCv(formData)
      );
      if (payload?.status === "success") {
        if (decodedToken?.data?.role_id === undefined) {
          setLocalStorage("fileName", payload.fileName);
          setopenCVDialog(false);
          setOpenSignUpLogin(true);
        }
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

  const handleFileClick = () => {
    hiddenFileInput.current.click();
  };

  const onHandleClose = () => {
    setopenCVDialog(false);
  };

  const onHandleCloseSingUpLogin = () => {
    setOpenSignUpLogin(false);
  };

  const handleLogin = () => {
    setOpenLoginDialog(true);
  };

  const handleSignup = () => {
    setOpenSignUpDialog(true);
  };

  const onHandleLogin = async (loginData) => {
    try {
      const { payload } = await dispatch(login(loginData));
      if (payload?.status === "success" && payload?.token) {
        const user = payload.data.role_id;
        setLocalStorage("token", payload?.token);
        onHandleClose();
        const jwt = localStorage?.getItem("token");
        const parts = jwt?.split(".");
        if (parts?.length !== 3) {
          throw new Error("Invalid JWT");
        }
        const encodedPayload = parts[1];
        const decodedPayload = atob(encodedPayload);
        const payloadData = JSON.parse(decodedPayload);
        const profileCompletion = payloadData.data?.profile_percent_complete;
        if (user === 4) {
          if (profileCompletion === 100) {
            history("/employer/my-jobs", { replace: true });
          } else {
            history("/employer/my-profile", { replace: true });
          }
        } else {
          if (profileCompletion === 0) {
            history("/candidate/my-jobs", { replace: true });
          } else {
            history("/candidate/my-profile", { replace: true });
          }
        }
        setLocalStorage("isLoggedIn", true);
        setLocalStorage("userType", user);
        localStorage.removeItem("fileName");
        localStorage.removeItem("job_id");
        localStorage.removeItem("jobs_user_id");
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Successfully Login!",
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

  const onHandleCloseLogin = () => {
    setOpenLoginDialog(false);
  };

  const onHandleCloseSignUp = () => {
    setOpenSignUpDialog(false);
  };

  return (
    <Box>
      <Paper
        component="form"
        sx={{
          p: 2,
          width: { xs: "90%", sm: "70%", md: "60%" },
          margin: "auto",
        }}
        className="login-box"
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          A quick Q&A session
        </Typography>
        <Box sx={{ mt: 3 }}>
          {questions.map((question, index) => {
            return (
              <>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  Q.{index + 1} &nbsp;
                  {question.question}
                </Typography>
                <InputBox
                  id="answer"
                  type="text"
                  onChange={(event) =>
                    handleChange(event, question.question_id)
                  }
                  placeholder={"Answer"}
                  sx={{ mb: 2, height: "30px !important" }}
                />
              </>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 0 }}>
          <Button
            sx={{
              boxShadow: 0,
              fontSize: "12px",
              width: "100%",
              height: "43px",
            }}
            variant="contained"
            color="redButton100"
            onClick={handleApply}
          >
            {i18n["jobCard.apply"]}
          </Button>
        </Box>
      </Paper>
      <CustomDialog
        show={openCVDialog}
        hideButton={false}
        onDialogClose={onHandleClose}
        dialogWidth="sm"
        showFooter={false}
        // title={isLoggedIn ? i18n["login.login"] : i18n["login.signUp"]}
        isApplyJob
      >
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
      </CustomDialog>
      <CustomDialog
        show={openSignUpLogin}
        hideButton={false}
        onDialogClose={onHandleCloseSingUpLogin}
        dialogWidth="sm"
        showFooter={false}
        // title={i18n["login.signUp"]}
        isApplyJob
      >
        <Button
          variant="contained"
          sx={{
            mr: 2,
            width: "96px",
            border: `solid ${theme.palette.redButton.main} 2px`,
            color: theme.palette.redButton.main,
          }}
          color="base"
          onClick={handleLogin}
        >
          {i18n["topBar.login"]}
        </Button>
        <Button
          variant="contained"
          sx={{ width: "96px" }}
          color="redButton"
          onClick={handleSignup}
        >
          {i18n["topBar.join"]}
        </Button>
      </CustomDialog>
      <CustomDialog
        show={openLoginDialog}
        hideButton={false}
        onDialogClose={onHandleCloseLogin}
        dialogWidth="sm"
        showFooter={false}
        // title={showLogin ? i18n["login.login"] : i18n["login.signUp"]}
        isApplyJob
      >
        <Login handleLogin={onHandleLogin} />
      </CustomDialog>
      <CustomDialog
        show={openSignUpDialog}
        hideButton={false}
        onDialogClose={onHandleCloseSignUp}
        dialogWidth="sm"
        showFooter={false}
        // title={showLogin ? i18n["login.login"] : i18n["login.signUp"]}
        isApplyJob
      >
        <Signup onDialogClose={onHandleCloseSignUp} />
      </CustomDialog>
    </Box>
  );
}
