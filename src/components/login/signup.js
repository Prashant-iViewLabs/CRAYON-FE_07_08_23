import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import locale from "../../i18n/locale";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputBox from "../../components/common/InputBox";
import SwipeableButton from "../../components/common/SwipeableButton";
import {
  ALERT_TYPE,
  USER_TYPES,
  AUTHORIZED_TAB_ITEMS_EMPLOYER,
  AUTHORIZED_TAB_ITEMS_CANDIDATE,
  PUBLIC_TAB_ITEMS,
} from "../../utils/Constants";
import { setAlert } from "../../redux/configSlice";
import { USER_ROLES } from "../../utils/Constants";
import { signup } from "../../redux/login/loginSlice";
import "./login.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useLocation } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../../utils/Common";
import { handleSignState } from "../../redux/signUp/action";
import PrivacyPolicy from "../../assets/crayon-privacy-policy.pdf";
import TermsandServices from "../../assets/crayon-terms-of-service.pdf";
import jwt_decode from "jwt-decode";

const FORMDATA = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  contact: "",
};
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("*First name is required."),
  lastName: Yup.string().required("*Last name is required."),
  email: Yup.string()
    .required("*Email address is required.")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "*Email address is invalid."),
  password: Yup.string()
    .required("*Password is required.")
    .min(5, "*Password must be at least 5 characters long."),
  contact: Yup.string()
    .required("*Contact Number is required.")
    .matches(
      /^\d{10,15}$/,
      "*Contact number must be between 10 and 15 digits."
    ),
});
export default function Signup({ onDialogClose }) {
  const i18n = locale.en;
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  const [userType, setUserType] = useState(USER_TYPES[0]);
  const [selectedUserId, setSelectedUserId] = useState();
  const [activeTab, setActiveTab] = useState(pathname.slice(1));
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTabs, setcurrentTabs] = useState(PUBLIC_TAB_ITEMS);

  const user = getLocalStorage("userType");

  useEffect(() => {
    //on refresh
    setIsAdmin(false);
    if (user === 4) {
      if (pathname.slice(1).includes("admin")) {
        setIsAdmin(true);
        setcurrentTabs([]);
      } else {
        if (pathname.slice(1).includes("employer")) {
          setcurrentTabs(AUTHORIZED_TAB_ITEMS_EMPLOYER);
        } else {
          setcurrentTabs(PUBLIC_TAB_ITEMS);
        }
      }
    } else if (user === 3) {
      if (pathname.slice(1).includes("candidate")) {
        setcurrentTabs(AUTHORIZED_TAB_ITEMS_CANDIDATE);
      } else {
        setcurrentTabs(PUBLIC_TAB_ITEMS);
      }
    } else {
      setcurrentTabs(PUBLIC_TAB_ITEMS);
    }
  }, []);

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  const formik = useFormik({
    initialValues: FORMDATA,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formBody = {
        first_name: formik.values.firstName,
        last_name: formik.values.lastName,
        email: formik.values.email,
        password: formik.values.password,
        contact: formik.values.contact,
        remember_token: 1,
        is_verified: 0,
        referrer_id: 1,
        terms: 1,
        role_id: selectedUserId?.role_id || USER_ROLES[0].role_id,
        fileName:
          decodedToken?.data?.role_id === undefined
            ? getLocalStorage("fileName")
            : "",
        job_id:
          decodedToken?.data?.role_id === undefined
            ? getLocalStorage("job_id")
            : "",
        jobs_user_id:
          decodedToken?.data?.role_id === undefined
            ? getLocalStorage("jobs_user_id")
            : "",
      };
      try {
        const { payload } = await dispatch(signup(formBody));
        if (payload?.status === "success") {
          localStorage.setItem("temp", "temp");
          setLocalStorage("token", payload?.token);
          setLocalStorage("isLoggedIn", true);
          localStorage.setItem("rolID", payload.data.role_id);
          localStorage.removeItem("fileName");
          localStorage.removeItem("job_id");
          localStorage.removeItem("jobs_user_id");
          resetForm();
          dispatch(handleSignState());

          dispatch(
            setAlert({
              show: true,
              type: ALERT_TYPE.SUCCESS,
              msg: "User registered successfully!",
            })
          );
          if (onDialogClose) {
            onDialogClose();
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
    },
  });
  useEffect(() => {
    if (pathname.slice(1) !== activeTab) {
      setActiveTab(pathname.slice(1));
    }
  }, [pathname]);

  const onHandleButtonToggle = (event, type) => {
    setUserType(type);
    setSelectedUserId(
      USER_ROLES.filter(
        (role) => role.name.toLowerCase() === type.toLowerCase()
      )[0]
    );
  };
  return (
    <Box>
      <Paper
        component="form"
        sx={{
          p: 2,
          width: { xs: "90%", sm: "70%", md: "60%" },
          margin: "auto",
          mb: 3,
        }}
        className="login-box"
        // style={{
        //   maxWidth: "500px",
        //   minWidth: "300px",
        // }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          {i18n["login.signUp"]}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <SwipeableButton
            selectedUser={userType}
            onButtonToggle={onHandleButtonToggle}
          />
        </Box>
        <Box sx={{ display: "flex", mt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputBox
              id="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={i18n["login.firstName"]}
              sx={{ mr: 1, width: "95%" }}
              style={{ flex: "1" }}
            />
            {formik.errors.firstName && formik.touched.firstName && (
              <div className="error-div">{formik.errors.firstName}</div>
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputBox
              id="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={i18n["login.lastName"]}
              sx={{ ml: 1, width: "95%" }}
              style={{ flex: "1" }}
            />
            {formik.errors.lastName && formik.touched.lastName && (
              <div className="error-div">{formik.errors.lastName}</div>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <InputBox
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={i18n["login.emailAddrees"]}
            style={{ width: "100%" }}
          />
          {formik.errors.email && formik.touched.email && (
            <div className="error-div">{formik.errors.email}</div>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <InputBox
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={i18n["login.password"]}
            type="password"
            style={{ width: "100%" }}
          />
          {formik.errors.password && formik.touched.password && (
            <div className="error-div">{formik.errors.password}</div>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <InputBox
            id="contact"
            value={formik.values.contact}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={i18n["login.contact"]}
            style={{ width: "100%" }}
          />
          {formik.errors.contact && formik.touched.contact && (
            <div className="error-div">{formik.errors.contact}</div>
          )}
        </Box>

        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            mt: 2,
          }}
        >
          {i18n["login.s1"]}
          <Link
            href={PrivacyPolicy}
            target="_blank"
            sx={{ textDecoration: "none" }}
          >
            {i18n["login.s4"]}
          </Link>
          {i18n["login.s3"]}
          <Link href={TermsandServices} target="_blank">
            {i18n["login.s2"]}
          </Link>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{
              width: 150,
              mt: 3,
            }}
            variant="contained"
            color="redButton"
            onClick={formik.handleSubmit}
            style={{ width: "40%" }}
          >
            {i18n["login.letsGo"]}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
