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
import Avatar from "@mui/material/Avatar";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  answer: Yup.string().required('Answer is required'),
});


export default function ApplyJobs({ questions, setopenApplyJobDialog }) {
  const fileAccept = "application/pdf, application/doc, application/docx";
  const hiddenFileInput = useRef(null);

  const i18n = locale.en;
  const dispatch = useDispatch();
  const theme = useTheme();
  const history = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [cvName, setCvName] = useState("No file chosen");
  const [openQandADialog, setopenQandADialog] = useState(false);
  const [openCVDialog, setopenCVDialog] = useState(false);
  const [openSignUpLogin, setOpenSignUpLogin] = useState(false);
  const [openSignUpDialog, setOpenSignUpDialog] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [userID, setuserID] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit or perform any necessary action here
      // For example, you can reset the dialog state to show the first question again
      setCurrentQuestionIndex(0);
      setAnswers([]);
      // setopenQandADialog(false); 
      handleApply()
      setopenCVDialog(true);
    }
  };
  const handleApply = async () => {
    setopenQandADialog(false)
    console.log(answers)
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
          console.log(payload.data);
          setuserID(payload?.jobs_user_id);
          // setopenCVDialog(true);
          // setopenApplyJobDialog(false);
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
    formData.append("jobs_user_id", userID);
    try {
      const { payload } = await dispatch(
        decodedToken?.data?.role_id === undefined
          ? uploadCvWithoutLogin(formData)
          : uploadCv(formData)
      );
      if (payload?.status === "success") {
        if (decodedToken?.data?.role_id === undefined) {
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
    setOpenSignUpLogin(false)
    setOpenLoginDialog(true);
  };

  const handleSignup = () => {
    setOpenSignUpLogin(false)
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
        // setLocalStorage("isLoggedIn", true);
        // setLocalStorage("userType", user);
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

  const handleQandAContinue = () => {
    console.log(questions)
    if (questions.length === 0) {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: "No Questions",
        }))
    } else {
      setopenApplyJobDialog(false)
      setopenQandADialog(true)
    }
  }

  const handleQuestions = () => {
    setopenQandADialog(false)
    setCurrentQuestionIndex(0)

  }

  const handleUploadCVLater = () => {
    setopenCVDialog(false);
    setOpenSignUpLogin(true);
  }
  const toggleForm = () => {
    setOpenLoginDialog(prevState => !prevState)
    setOpenSignUpDialog(prevState => !prevState);

  };

  // const formik = useFormik({
  //   initialValues: {
  //     answer: ''
  //   },
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => {
      
  //     if (answers.find((item) => item.question_id === questions[currentQuestionIndex].question_id)) {
  //       setAnswers(
  //         answers.map((item) =>
  //           item.question_id === questions[currentQuestionIndex].question_id
  //             ? { ...item, answer: values.answer }
  //             : item
  //         )
  //       );
  //     } else {
  //       setAnswers([...answers, { question_id: questions[currentQuestionIndex].question_id, answer: values.answer }]);
  //     }
  //     nextQuestion()
  //     formik.resetForm()
  //   }
  // })
  console.log(answers)
  return (
    <Box>
      <Box sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}>
        <Avatar
          src="/static/images/avatar/1.jpg"
          sx={{ width: 96, height: 96, margin: "auto" }} />
        <Typography
          sx={{
            fontSize: "22px",
            fontWeight: 700,
            paddingX: 3
          }}
        >
          Let's get you started
        </Typography>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            paddingX: 3
          }}
        >
          We'll kick-off with a quick Q&A session,
          followed by your CV upload.
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 500,
            paddingX: 3
          }}
        >
          A valid application requiews a Crayon profile, your completed Crayon Vitae, the Q&A session
          as well as a possible video application if required by the employer.
        </Typography>
        <Button
          variant="contained"
          color="redButton100"
          sx={{
            borderRadius: 0
          }}
          onClick={handleQandAContinue}
        >
          Continue
        </Button>
      </Box>
      {questions.map((question, index) => {
        const isCurrentQuestion = index === currentQuestionIndex;
        return (
          <CustomDialog
            show={openQandADialog && isCurrentQuestion}
            hideButton={false}
            onDialogClose={handleQuestions}
            dialogWidth="xs"
            showFooter={false}
            // title={isLoggedIn ? i18n["login.login"] : i18n["login.signUp"]}
            isApplyJob
            padding={0}
          >
            <Box sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}>
              <Avatar
                src="/static/images/avatar/1.jpg"
                sx={{ width: 96, height: 96, margin: "auto" }} />
              <Typography
                sx={{
                  fontSize: "22px",
                  fontWeight: 700,
                  paddingX: 3
                }}
              >
                A quick Q&A session
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  paddingX: 3
                }}
              >
                Question {currentQuestionIndex + 1}/{questions.length}
              </Typography>
              <Box >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    paddingX: 3,
                    mb: 3
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
                  // onBlur={formik.handleBlur}
                  // value={formik.values.answer}
                  // onChange={ }
                  placeholder={"Answer"}
                  sx={{
                    mb: 2,
                    height: "30px !important",
                    width: "90%",
                    margin: "auto"
                  }}
                />
                {/* {formik.errors && (<Typography sx={{
                  color: "red",
                  fontSize: "0.8rem",
                }}>{formik.errors.answer}</Typography>)} */}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 0 }}>
                <Button
                  sx={{
                    boxShadow: 0,
                    fontSize: "12px",
                    width: "100%",
                    height: "43px",
                    borderRadius: 0
                  }}
                  variant="contained"
                  color="redButton100"
                  // onClick={formik.handleSubmit}
                  onClick={nextQuestion}
                >
                  {/* {i18n["jobCard.apply"]} */}
                  continue
                </Button>
              </Box>
            </Box>
          </CustomDialog>
        );
      })}

      <CustomDialog
        show={openCVDialog}
        hideButton={false}
        onDialogClose={onHandleClose}
        dialogWidth="xs"
        showFooter={false}
        // title={isLoggedIn ? i18n["login.login"] : i18n["login.signUp"]}
        isApplyJob
        padding={0}
      >
        <Box sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}>
          <Avatar
            src="/static/images/avatar/1.jpg"
            sx={{ width: 96, height: 96, margin: "auto" }} />
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 700,
              paddingX: 3
            }}
          >
            Please upload your CV.
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              paddingX: 3
            }}
          >
            Your CV gives us a head start,
            but you'll still need to sign-up, complete your
            profile and Crayin Vitar post applying.
          </Typography>
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
          <Box>
            <Button
              variant="contained"
              color="grayButton100"
              sx={{
                borderRadius: 0,
                width: "50%"
              }}
            // onClick={handleUploadCVLater}
            >I'll do it later</Button>
            <input
              accept={fileAccept}
              ref={hiddenFileInput}
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              required
            />

            <Button
              onClick={handleFileClick}
              variant="contained"
              color="redButton100"
              sx={{
                borderRadius: 0,
                width: "50%"
              }}
            >
              {i18n["myCV.uploadCV"]}
            </Button>
            {/* <StyledButton
              sx={{ opacity: 0.5, mt: 1 }}
              variant="contained"
              color="redButton100"
            >
              {i18n["myCV.scrapeCV"]}
            </StyledButton> */}

          </Box>
        </Box>
      </CustomDialog>
      <CustomDialog
        show={openSignUpLogin}
        hideButton={false}
        onDialogClose={onHandleCloseSingUpLogin}
        dialogWidth="xs"
        showFooter={false}
        // title={i18n["login.signUp"]}
        isApplyJob
        padding={0}
      >
        <Box sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}>

          <Avatar
            src="/static/images/avatar/1.jpg"
            sx={{ width: 96, height: 96, margin: "auto" }} />
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 700,
              paddingX: 3
            }}
          >Thank you
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              paddingX: 3
            }}
          >
            You've applied, well, sort if.
            You'll need to create and complete your
            proile and Crayon Vitae in order for your
            application to be eligible.
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              paddingX: 3
            }}
          >
            If you're already on the Crayon platform,
            you can simply login to continue.
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              paddingX: 3
            }}
          >
            Note: If you exit now, your application will be discarded.
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="grayButton100"
              sx={{
                borderRadius: 0,
                width: "50%"
              }} onClick={handleLogin}
            >
              {i18n["topBar.login"]}
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: 0,
                width: "50%"
              }}
              color="redButton"
              onClick={handleSignup}
            >
              {/* {i18n["topBar.join"]} */}
              Join Crayon
            </Button>
          </Box>
        </Box>

      </CustomDialog>
      <Login handleLogin={onHandleLogin} openFunc={openLoginDialog} toggleForm={toggleForm} closeFunc={onHandleCloseLogin} />
      {/* <CustomDialog
        show={openLoginDialog}
        hideButton={false}
        onDialogClose={onHandleCloseLogin}
        dialogWidth="xs"
        showFooter={false}
        // title={showLogin ? i18n["login.login"] : i18n["login.signUp"]}
        isApplyJob
        padding={0}
      >
      </CustomDialog> */}
      <Signup onDialogClose={onHandleCloseSignUp} openFunc={openSignUpDialog} toggleForm={toggleForm} closeFunc={onHandleCloseSignUp} />
      {/* <CustomDialog
        show={openSignUpDialog}
        hideButton={false}
        onDialogClose={onHandleCloseSignUp}
        dialogWidth="xs"
        showFooter={false}
        // title={showLogin ? i18n["login.login"] : i18n["login.signUp"]}
        isApplyJob
        padding={0}
      >
      </CustomDialog> */}
    </Box>
  );
}
