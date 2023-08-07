import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import locale from "../../../i18n/locale";
import Typography from "@mui/material/Typography";
import ProfileCard from "./ProfileCard";

export default function MyCV() {
  const i18n = locale.en;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          sx={{
            fontSize: "36px",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {i18n["myProfile.title"]}
        </Typography>
      </Box>
      <Grid
        container
        spacing={0}
        sx={{ pb: 3 }}
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="center"
      >
        {/* <ButtonPanel panelData={CANDIDATE_MY_CV_LEFT} side='left' /> */}
        <Grid xs={12} sm={6} md={8} lg={9} xl={10}>
          <Paper
            sx={{
              boxShadow: 0,
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {/* <TheBasics handleProfileData={getProfileData} profile={profile} /> */}
              <ProfileCard />
            </Box>
          </Paper>
        </Grid>

        {/* <ButtonPanel panelData={CANDIDATE_MY_CV_RIGHT} side='right' /> */}
      </Grid>
    </>
  );
}