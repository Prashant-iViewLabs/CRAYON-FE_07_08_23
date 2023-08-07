import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import locale from "../../i18n/locale";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputBox from "../../components/common/InputBox";
import { useTheme } from "@mui/material/styles";
import "./login.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { IconButton, InputBase } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import jwt_decode from "jwt-decode";
import { getLocalStorage } from "../../utils/Common";

const LOGINDATA = {
  username: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("*Email address is required.")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "*Email address is invalid."),
  password: Yup.string()
    .required("*Password is required.")
    .min(5, "*Password must be at least 5 characters long."),
});

export default function Login({ handleLogin }) {
  const i18n = locale.en;
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState("password");

  const handleShowPassword = () => {
    if (showPassword) setInputType("password");
    else setInputType("text");

    setShowPassword(!showPassword);
  };

  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }

  const formik = useFormik({
    initialValues: LOGINDATA,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formBody = {
        username: formik.values.username,
        password: formik.values.password,
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
      await handleLogin(formBody);
    },
  });

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
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          {i18n["login.login"]}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <InputBox
            id="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={i18n["login.emailAddrees"]}
          />
          {formik.errors.username && formik.touched.username && (
            <div className="error-div">{formik.errors.username}</div>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
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
              type={inputType}
              placeholder={i18n["login.password"]}
            />
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
          {formik.errors.password && formik.touched.password && (
            <div className="error-div">{formik.errors.password}</div>
          )}
        </Box>

        {/*<Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
          <Link style={{ textDecoration: "none" }}>Forgot Password?</Link>
        </Box>*/}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 0 }}>
          <Button
            sx={{
              width: 150,
              mt: 3,
            }}
            variant="contained"
            color="redButton"
            // onClick={(event) => handleLogin(event, loginData)}
            // onClick={(event) => formik.handleSubmit(event)}
            onClick={formik.handleSubmit}
          >
            {i18n["login.login"]}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
