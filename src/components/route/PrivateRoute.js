import { Route, Navigate, useLocation } from "react-router-dom";
import { getLocalStorage } from "../../utils/Common";
import jwt_decode from "jwt-decode";

export default function PrivateRoute({ children }) {
  const token = localStorage?.getItem("token");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }
  const auth = getLocalStorage("token");
  const userType = decodedToken?.data?.role_id;
  const { pathname } = useLocation();

  if (!auth) {
    return <Navigate to="/" replace={true} />;
  }

  if (userType == 10) {
    if (pathname.includes("candidate")) {
      return <Navigate to="employer/my-jobs" replace={true} />;
    }
  } else if (userType == 20) {
    if (pathname.includes("employer") || pathname.includes("admin")) {
      return <Navigate to="candidate/my-jobs" replace={true} />;
    }
  }
  return children;
}
