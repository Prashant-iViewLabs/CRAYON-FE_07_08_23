// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import locale from "../../i18n/locale";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import InputBox from "../../components/common/InputBox";
// import SwipeableButton from "../../components/common/SwipeableButton";
// import {
//   ALERT_TYPE,
//   USER_TYPES,
//   AUTHORIZED_TAB_ITEMS_EMPLOYER,
//   AUTHORIZED_TAB_ITEMS_CANDIDATE,
//   PUBLIC_TAB_ITEMS,
// } from "../../utils/Constants";
// import { setAlert } from "../../redux/configSlice";
// import { USER_ROLES } from "../../utils/Constants";
// import { signup } from "../../redux/login/loginSlice";
// import "./login.css";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import { Link, useLocation } from "react-router-dom";
// import { getLocalStorage, setLocalStorage } from "../../utils/Common";
// import { handleSignState } from "../../redux/signUp/action";
// import PrivacyPolicy from "../../assets/crayon-privacy-policy.pdf";
// import TermsandServices from "../../assets/crayon-terms-of-service.pdf";
// import jwt_decode from "jwt-decode";

// const FORMDATA = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
//   contact: "",
// };
// const validationSchema = Yup.object().shape({
//   firstName: Yup.string().required("*First name is required."),
//   lastName: Yup.string().required("*Last name is required."),
//   email: Yup.string()
//     .required("*Email address is required.")
//     .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "*Email address is invalid."),
//   password: Yup.string()
//     .required("*Password is required.")
//     .min(5, "*Password must be at least 5 characters long."),
//   contact: Yup.string()
//     .required("*Contact Number is required.")
//     .matches(
//       /^\d{10,15}$/,
//       "*Contact number must be between 10 and 15 digits."
//     ),
// });
// export default function Signup({ onDialogClose }) {
//   const i18n = locale.en;
//   const dispatch = useDispatch();
//   let { pathname } = useLocation();
//   const [userType, setUserType] = useState(USER_TYPES[0]);
//   const [selectedUserId, setSelectedUserId] = useState();
//   const [activeTab, setActiveTab] = useState(pathname.slice(1));
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [currentTabs, setcurrentTabs] = useState(PUBLIC_TAB_ITEMS);
//   const token = localStorage?.getItem("token");
//   let decodedToken;
//   if (token) {
//     decodedToken = jwt_decode(token);
//   }

//   const user = decodedToken?.data?.role_id;

//   useEffect(() => {
//     //on refresh
//     setIsAdmin(false);
//     if (user === 4) {
//       if (pathname.slice(1).includes("admin")) {
//         setIsAdmin(true);
//         setcurrentTabs([]);
//       } else {
//         if (pathname.slice(1).includes("employer")) {
//           setcurrentTabs(AUTHORIZED_TAB_ITEMS_EMPLOYER);
//         } else {
//           setcurrentTabs(PUBLIC_TAB_ITEMS);
//         }
//       }
//     } else if (user === 3) {
//       if (pathname.slice(1).includes("candidate")) {
//         setcurrentTabs(AUTHORIZED_TAB_ITEMS_CANDIDATE);
//       } else {
//         setcurrentTabs(PUBLIC_TAB_ITEMS);
//       }
//     } else {
//       setcurrentTabs(PUBLIC_TAB_ITEMS);
//     }
//   }, []);

//   const formik = useFormik({
//     initialValues: FORMDATA,
//     validationSchema: validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       const formBody = {
//         first_name: formik.values.firstName,
//         last_name: formik.values.lastName,
//         email: formik.values.email,
//         password: formik.values.password,
//         contact: formik.values.contact,
//         remember_token: 1,
//         is_verified: 0,
//         referrer_id: 1,
//         terms: 1,
//         role_id: selectedUserId?.role_id || USER_ROLES[0].role_id,
//         fileName:
//           decodedToken?.data?.role_id === undefined
//             ? getLocalStorage("fileName")
//             : "",
//         job_id:
//           decodedToken?.data?.role_id === undefined
//             ? getLocalStorage("job_id")
//             : "",
//         jobs_user_id:
//           decodedToken?.data?.role_id === undefined
//             ? getLocalStorage("jobs_user_id")
//             : "",
//       };
//       try {
//         const { payload } = await dispatch(signup(formBody));
//         if (payload?.status === "success") {
//           // localStorage.setItem("temp", "temp");
//           setLocalStorage("token", payload?.token);
//           // setLocalStorage("isLoggedIn", true);
//           // localStorage.setItem("rolID", payload.data.role_id);
//           localStorage.removeItem("fileName");
//           localStorage.removeItem("job_id");
//           localStorage.removeItem("jobs_user_id");
//           resetForm();
//           dispatch(handleSignState());

//           dispatch(
//             setAlert({
//               show: true,
//               type: ALERT_TYPE.SUCCESS,
//               msg: "User registered successfully!",
//             })
//           );
//           if (onDialogClose) {
//             onDialogClose();
//           }
//         } else if (payload?.status === "error") {
//           console.log(payload);
//           dispatch(
//             setAlert({
//               show: true,
//               type: ALERT_TYPE.ERROR,
//               msg: payload?.message?.message,
//             })
//           );
//         }
//       } catch (error) {
//         dispatch(setAlert({ show: true }));
//       }
//     },
//   });
//   useEffect(() => {
//     if (pathname.slice(1) !== activeTab) {
//       setActiveTab(pathname.slice(1));
//     }
//   }, [pathname]);

//   const onHandleButtonToggle = (event, type) => {
//     setUserType(type);
//     setSelectedUserId(
//       USER_ROLES.filter(
//         (role) => role.name.toLowerCase() === type.toLowerCase()
//       )[0]
//     );
//   };
//   return (
//     <Box>
//       <Paper
//         component="form"
//         sx={{
//           p: 2,
//           width: { xs: "90%", sm: "70%", md: "60%" },
//           margin: "auto",
//           mb: 3,
//         }}
//         className="login-box"
//         // style={{
//         //   maxWidth: "500px",
//         //   minWidth: "300px",
//         // }}
//       >
//         <Typography
//           sx={{
//             fontSize: "20px",
//             fontWeight: 700,
//           }}
//         >
//           {i18n["login.signUp"]}
//         </Typography>

//         <Box sx={{ mt: 2 }}>
//           <SwipeableButton
//             selectedUser={userType}
//             onButtonToggle={onHandleButtonToggle}
//           />
//         </Box>
//         <Box sx={{ display: "flex", mt: 3 }}>
//           <Box sx={{ display: "flex", flexDirection: "column" }}>
//             <InputBox
//               id="firstName"
//               value={formik.values.firstName}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               placeholder={i18n["login.firstName"]}
//               sx={{ mr: 1, width: "95%" }}
//               style={{ flex: "1" }}
//             />
//             {formik.errors.firstName && formik.touched.firstName && (
//               <div className="error-div">{formik.errors.firstName}</div>
//             )}
//           </Box>
//           <Box sx={{ display: "flex", flexDirection: "column" }}>
//             <InputBox
//               id="lastName"
//               value={formik.values.lastName}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               placeholder={i18n["login.lastName"]}
//               sx={{ ml: 1, width: "95%" }}
//               style={{ flex: "1" }}
//             />
//             {formik.errors.lastName && formik.touched.lastName && (
//               <div className="error-div">{formik.errors.lastName}</div>
//             )}
//           </Box>
//         </Box>

//         <Box sx={{ mt: 2 }}>
//           <InputBox
//             id="email"
//             value={formik.values.email}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             placeholder={i18n["login.emailAddrees"]}
//             style={{ width: "100%" }}
//           />
//           {formik.errors.email && formik.touched.email && (
//             <div className="error-div">{formik.errors.email}</div>
//           )}
//         </Box>
//         <Box sx={{ mt: 2 }}>
//           <InputBox
//             id="password"
//             value={formik.values.password}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             placeholder={i18n["login.password"]}
//             type="password"
//             style={{ width: "100%" }}
//           />
//           {formik.errors.password && formik.touched.password && (
//             <div className="error-div">{formik.errors.password}</div>
//           )}
//         </Box>
//         <Box sx={{ mt: 2 }}>
//           <InputBox
//             id="contact"
//             value={formik.values.contact}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             placeholder={i18n["login.contact"]}
//             style={{ width: "100%" }}
//           />
//           {formik.errors.contact && formik.touched.contact && (
//             <div className="error-div">{formik.errors.contact}</div>
//           )}
//         </Box>

//         <Typography
//           sx={{
//             fontSize: "12px",
//             fontWeight: 400,
//             mt: 2,
//           }}
//         >
//           {i18n["login.s1"]}
//           <Link
//             href={PrivacyPolicy}
//             target="_blank"
//             sx={{ textDecoration: "none" }}
//           >
//             {i18n["login.s4"]}
//           </Link>
//           {i18n["login.s3"]}
//           <Link href={TermsandServices} target="_blank">
//             {i18n["login.s2"]}
//           </Link>
//         </Typography>
//         <Box sx={{ display: "flex", justifyContent: "center" }}>
//           <Button
//             sx={{
//               width: 150,
//               mt: 3,
//             }}
//             variant="contained"
//             color="redButton"
//             onClick={formik.handleSubmit}
//             style={{ width: "40%" }}
//           >
//             {i18n["login.letsGo"]}
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }


import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
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
import { Avatar, DialogTitle, InputBase } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";

const FORMDATA = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  contact: "",
};
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("required"),
  lastName: Yup.string().required("required"),
  email: Yup.string()
    .required("Email address is required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Weak"),
  contact: Yup.string()
    .required("number is required")
    .matches(
      /^\d{10,15}$/,
      "Invalid number"
    ),
});
export default function Signup({onDialogClose, toggleForm, openFunc, closeFunc }) {
  const i18n = locale.en;
  const theme = useTheme();
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  const [userType, setUserType] = useState(USER_TYPES[0]);
  const [selectedUserId, setSelectedUserId] = useState();
  const [activeTab, setActiveTab] = useState(pathname.slice(1));
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTabs, setcurrentTabs] = useState(PUBLIC_TAB_ITEMS);
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  const user = decodedToken?.data?.role_id;

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
          // setLocalStorage("isLoggedIn", true);
          // localStorage.setItem("rolID", payload.data.role_id);
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
        } else if (payload?.status === "error") {
          console.log(payload);
          dispatch(
            setAlert({
              show: true,
              type: ALERT_TYPE.ERROR,
              msg: payload?.message?.message,
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

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Dialog
      open={openFunc}
      // hideButton={false}
      onDialogClose={closeFunc}
      dialogWidth="xs"
      showFooter={false}
      title={i18n["login.login"]}
      // isApplyJob
      padding={0}
    >
      <DialogTitle onClose={closeFunc}>
        <IconButton
          aria-label="close"
          onClick={closeFunc}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "auto",
        width: "400px",
        padding: "30px 0 0",
      }}>
        <Avatar
          src="/static/images/avatar/1.jpg"
          sx={{ width: 96, height: 96 }} />
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          hi, let's get you started
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            marginTop: 3,
            fontWeight: "bold",
          }}
        >
          Join crayon
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          select a profile below and complete to join
        </Typography>
        <Box sx={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          mt: 2,
          gap: 2
        }}>

          <Box >
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

          <Box >
            <Paper
              sx={{
                display: "flex",
                height: "40px",
                borderRadius: "25px",
                boxShadow: "none",
                border: `1px solid ${theme.palette.grayBorder}`,
              }}
            >
              <InputBase
                sx={{ ml: 2, mr: 2, width: "100%" }}
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={i18n["login.emailAddrees"]}
                style={{ width: "100%" }}
              />
              {formik.errors.email && formik.touched.email && (
                <span className="error-div">{formik.errors.email} <CancelIcon fontSize="small" /></span>
              )}
            </Paper>
          </Box>
          <Box >
            <Paper
              sx={{
                display: "flex",
                height: "40px",
                borderRadius: "25px",
                boxShadow: "none",
                border: `1px solid ${theme.palette.grayBorder}`,
              }}
            >
              <InputBase
                sx={{ ml: 2, mr: 2, width: "100%" }}
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={i18n["login.password"]}
                type={showPassword ? "text" : "password"}
              />
              {formik.errors.password && formik.touched.password && (
                <div className="error-div">{formik.errors.password}</div>
              )}
              <IconButton
                sx={{ py: 0 }}
                color=""
                aria-label="reset password"
                component="button"
                onClick={handleShowPassword}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Paper>
          </Box>
          <Box >
            <Paper
              sx={{
                display: "flex",
                height: "40px",
                borderRadius: "25px",
                boxShadow: "none",
                border: `1px solid ${theme.palette.grayBorder}`,
              }}
            >
              <InputBase
                sx={{ ml: 2, mr: 2, width: "100%" }}
                id="contact"
                value={formik.values.contact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={i18n["login.contact"]}
                style={{ width: "100%" }}
                type="number"
                classes={{
                  input: 'custom-input', // This class name can be used for styling
                }}
              />
              {formik.errors.contact && formik.touched.contact && (
                <span className="error-div">{formik.errors.contact} <CancelIcon fontSize="small" /></span>
              )}
            </Paper>
          </Box>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}>
            <Typography sx={{
              fontSize: "14px",
              fontWeight: 500,
            }}>
              Already a user?
            </Typography>
            <Link >
              <Typography sx={{
                color: "black",
                fontSize: "14px",
                fontWeight: 500,
              }}
                onClick={toggleForm}>
                Sign in
              </Typography>
            </Link>
          </Box>
          <Box sx={{
            width: "65%",
            margin: "auto"
          }}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 400,
                textAlign: "center"
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
          </Box>

        </Box>

        <Box
          sx={{ display: "flex", width: "100%", mt: 2, justifyContent: "space-between" }}
        >

          <Button
            sx={{
              width: "50%",
              borderRadius: 0,
              padding: 3
            }}
            variant="contained"
            color="grayButton100"
          // onClick={(event) => handleLogin(event, loginData)}
          // onClick={(event) => formik.handleSubmit(event)}
          // onClick={formik.handleSubmit}
          >
            forgot Password?
          </Button>
          <Button
            sx={{
              width: "50%",
              borderRadius: 0,
              padding: 3
            }}
            variant="contained"
            color="redButton"
            onClick={formik.handleSubmit}
          >
            {/* {i18n["login.letsGo"]} */}
            join crayon
          </Button>
        </Box>
      </Box>
    </Dialog>

  );
}
