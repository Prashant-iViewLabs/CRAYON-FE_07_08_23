import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SearchBar from "../components/common/SearchBar";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import locale from "../i18n/locale";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputBox from "../components/common/InputBox";
import SwipeableButton from "../components/common/SwipeableButton";
import { USER_TYPES } from "../utils/Constants";
import Signup from "../components/login/signup";
import { getAllIndustries } from "../redux/configSlice";
import { handleSignState } from "../redux/signUp/action";

const StyledGrid = styled(Grid)(({ theme }) => ({
  "& .MuiTypography-root": {
    ".talent": {
      color: theme.palette.redButton.main,
    },
    ".fast": {
      color: theme.palette.blueButton400.main,
    },
  },
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  margin: "8px 0",
  "& .MuiOutlinedInput-notchedOutline": {
    // borderColor: theme.palette.black,
    borderRadius: "20px",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
}));

export default function Home() {
  const i18n = locale.en;
  const dispatch = useDispatch();

  // const signUpHandle =(role_id)=>{
  //   console.log("home..............................................")
  //   //const role_id = localStorage.getItem("rolID")
  //   let tabs;
  //   if (role_id == 4) {
  //     tabs = AUTHORIZED_TAB_ITEMS_EMPLOYER;
  //     navigate("employer/my-profile", { replace: true });
  //     setActiveTab("employer/my_profile");
  //   } else {
  //     tabs = AUTHORIZED_TAB_ITEMS_CANDIDATE;
  //     navigate("candidate/my-profile", { replace: true });
  //     setActiveTab("candidate/my_profile");
  //   }
  //   setcurrentTabs(tabs);
  //  }

  return (
    <Grid container spacing={0} flexDirection={{ xs: "column", sm: "row" }}>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Paper
            elevation={5}
            sx={{
              display: "flex",
              m: 1,
              borderRadius: "25px",
              width: "100%",
              height: "45px",
              maxWidth: { xs: "90%", sm: "70%" },
            }}
          >
            <IconButton
              color="redButton"
              aria-label="search job"
              component="button"
              sx={{ ml: 1 }}
            >
              <SearchIcon />
            </IconButton>
            <Paper
              elevation={0}
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                borderRadius: "25px",
                width: 1,
              }}
            >
              <InputBase
                sx={{ ml: 1, width: 1, fontSize: "14px", fontWeight: 700 }}
                inputProps={{ "aria-label": "search google maps" }}
              />
            </Paper>
            <IconButton
              color="redButton"
              aria-label="search job"
              component="button"
            >
              <PlaceIcon />
            </IconButton>
            <Button
              sx={{
                width: 146,
                height: "45px",
                boxShadow: 0,
                borderBottomRightRadius: 0,
                borderTopRightRadius: 0,
                lineHeight: { sm: "15px", xs: "15px" },
              }}
              variant="contained"
              color="blueButton400"
            >
              {i18n["login.findWork"]}
            </Button>
            <Button
              sx={{
                width: 146,
                height: "45px",
                boxShadow: 0,
                borderBottomLeftRadius: 0,
                borderTopLeftRadius: 0,
                lineHeight: { sm: "15px", xs: "15px" },
              }}
              variant="contained"
              color="yellowButton100"
            >
              {i18n["login.findTalent"]}
            </Button>
          </Paper>
        </Box>
        <StyledGrid
          container
          spacing={0}
          flexDirection={{ xs: "column", sm: "row" }}
          paddingBottom={1}
        >
          <Grid
            item
            xs={12}
            sm={6}
            lg={7}
            sx={{
              padding: { sm: "28px 40px", xl: "32px 100px", md: "70px 40px" },
            }}
          >
            <Box sx={{ ml: 5, pt: 2 }}>
              <Typography
                sx={{
                  //   fontSize: { xs: "32px", sm: "35px", lg:"50px"},
                  fontSize: { xs: "32px", sm: "35px", lg: "45px" },
                  fontWeight: 700,
                  mr: 1,
                }}
              >
                <span className="talent">{i18n["login.talent"]}</span>
                <span>{i18n["login.title1"]}</span>
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "32px", sm: "35px", lg: "45px" },
                  //   fontSize: { xs: "32px", sm: "35px", lg:"50px" },
                  fontWeight: 700,
                  mr: 1,
                }}
              >
                <span>{i18n["login.done"]}</span>
                <span className="fast">{i18n["login.fast"]}</span>
                <span>{i18n["login.title2"]}</span>
              </Typography>
              <Button
                sx={{ width: 150, mt: 3 }}
                variant="contained"
                color="redButton"
              >
                {i18n["login.viewPlans"]}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} lg={5} sx={{ paddingTop: 3 }}>
            <Signup />
          </Grid>
        </StyledGrid>
      </Grid>
    </Grid>
  );
}
