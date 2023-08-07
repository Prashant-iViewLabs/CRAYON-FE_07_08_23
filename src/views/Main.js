import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Toolbar from "@mui/material/Toolbar";
import TopBar from "../components/common/TopBar";
import ButtonPanel from "../components/common/ButtonPanel";
import { useEffect, useState } from "react";
import {
  JOBS_LEFT_INDUSTRIES_BUTTON_GROUP,
  JOBS_RIGHT_BUTTON_GROUP,
} from "../utils/Constants";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import LeftDrawer from "../components/admin/LeftDrawer";
import { useTheme } from "@mui/material/styles";
import Snackbar from "../components/common/SnackBar";
import Backdrop from "../components/common/Backdrop";
export default function Main() {
  const navigate = useNavigate();
  let { pathname } = useLocation();
  const theme = useTheme();

  useEffect(() => {
    if (pathname === "/") navigate("/", { replace: true });
  }, []);

  const onHandleTabChange = (tab) => {
    // switch (tab) {
    //     case 'jobs': {
    //         setLeftPanel(JOBS_LEFT_INDUSTRIES_BUTTON_GROUP)
    //         setRightPanel(JOBS_RIGHT_BUTTON_GROUP)
    //         break;
    //     }
    //     case 'talent':
    //         setLeftPanel(TALENT_LEFT_BUTTON_GROUP)
    //         setRightPanel(TALENT_RIGHT_BUTTON_GROUP)
    //         break;
    //     case 'my-jobs':
    //         setLeftPanel(EMPLOYER_MY_JOBS_LEFT)
    //         setRightPanel(EMPLOYER_MY_JOBS_RIGHT)
    //         break;
    //     default:
    //         setLeftPanel([])
    //         setRightPanel([])
    //         break;
    // }
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Snackbar />
        <Backdrop />
        <TopBar />
        <Box component="main" sx={{ pt: 2, width: 1 }}>
          <Toolbar sx={{ marginTop: "-16px" }} />
          <Box
            sx={{
              paddingTop: "24px",
              background: theme.palette.mainBackground,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}