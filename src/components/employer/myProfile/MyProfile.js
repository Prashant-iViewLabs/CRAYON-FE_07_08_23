import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ButtonPanel from "../../common/ButtonPanel";
import {
  CANDIDATE_MY_CV_LEFT,
  CANDIDATE_MY_CV_RIGHT,
} from "../../../utils/Constants";
import locale from "../../../i18n/locale";
import Typography from "@mui/material/Typography";
import ProfileCard from "./ProfileCard";
import { useState } from "react";

// const StyledButtonLeft = styled(Button)(({ theme }) => ({
//   // marginRight: "24px",
//   fontSize: "14px",
//   width: "140px",
//   border: `2px solid ${theme.palette.redButton100.main}`,
//   "& .MuiSvgIcon-root": {
//     fontSize: "16px",
//   },
//   borderRadius:"5px"
// }));

export default function MyProfile() {
  const i18n = locale.en;
  // const [color,setColor] = useState("1");

  return (
    <>
      {/* <Typography
        sx={{
          fontSize: "36px",
          fontWeight: 700,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {i18n["myProfile.title"]}
      </Typography> */}
      {/* <Grid
        container
        spacing={0}
        sx={{ pb: 3 }}
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
      > */}
        {/* <ButtonPanel panelData={CANDIDATE_MY_CV_LEFT} side="left" /> */}
        {/* <Box sx={{ display: "flex", flexDirection: "column"}}>
            <StyledButtonLeft
              // onClick={()=>func("1")}
              variant= {color == "1" ? "contained" : "outlined"}
              color="redButton100"
              sx={{mb:2}}
            >
              {i18n["myProfile.myInfo"]}
            </StyledButtonLeft>
            <StyledButtonLeft
              // onClick={()=>func("2")}
              variant= {color == "2" ? "contained" : "outlined"}
              color="redButton100"
              sx={{mb:2}}
            >
              {i18n["myProfile.companyInfo"]}
            </StyledButtonLeft>
            <StyledButtonLeft
              //  onClick={()=>func("3")}
              variant= {color == "3" ? "contained" : "outlined"}
              color="redButton100"
            >
              {i18n["myProfile.myPlan"]}
            </StyledButtonLeft>
            <StyledButtonLeft
              //  onClick={()=>func("3")}
              variant= {color == "4" ? "contained" : "outlined"}
              color="redButton100"
              sx={{mt:2}}
            >
              {i18n["myProfile.billing"]}
            </StyledButtonLeft>
          </Box> */}
        
        {/* <Grid xs={12} sm={6} md={8} lg={9} xl={10}> */}
          {/* <Paper
            sx={{
              boxShadow: 0,
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          > */}
            {/* <Box> */}
              <ProfileCard />
            {/* </Box> */}
          {/* </Paper> */}
        {/* </Grid> */}
        {/* <div></div> */}
        {/* <ButtonPanel panelData={CANDIDATE_MY_CV_RIGHT} side='right' /> */}
      {/* </Grid> */}
    </>
  );
}