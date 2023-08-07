import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import ButtonPanel from "../../common/ButtonPanel";
import { EMPLOYER_JOB_POSTING_SPEC_LEFT } from "../../../utils/Constants";
import locale from "../../../i18n/locale";
import { useState } from "react";
import { Typography } from "@mui/material";
import TheBasicsNew from "./TheBasics";
import TheDetailsNew from "./TheDetails";
import CultureAddNew from "./CultureAdd";

const i18n = locale.en;

const StyledButtonLeft = styled(Button)(({ theme }) => ({
  // marginRight: "24px",
  fontSize: "14px",
  width: "140px",
  border: `1px solid ${theme.palette.redButton100.main}`,
  "& .MuiSvgIcon-root": {
    fontSize: "16px",
  },
  borderRadius: "2px",
}));

export default function MyCV() {
  const [step, setStep] = useState(1);

  const handleRightButtonClick = (param) => {
    setStep(param);
  };

  const handleChangeStep = (value) => {
    setStep(value);
  };

  return (
    <Box>
      <Grid
        container
        spacing={0}
        sx={{ pb: 3, justifyContent: "space-between" }}
        flexDirection="row"
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <ButtonPanel panelData={EMPLOYER_JOB_POSTING_SPEC_LEFT} side="left" />
        </Box>
        <Grid xs={12} sm={6} md={8} lg={9} xl={10} sx={{ px: 3 }}>
          <Typography
            sx={{
              fontSize: "36px",
              mb: 3,
              fontWeight: 700,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {i18n["postAJob.title"]}
          </Typography>
          <Box
            sx={{
              boxShadow: 4,
              p: 3,
              minHeight: "748px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {step === 1 && <TheBasicsNew changeStep={handleChangeStep} />}
              {step === 2 && <TheDetailsNew changeStep={handleChangeStep} />}
              {step === 3 && <CultureAddNew changeStep={handleChangeStep} />}
            </Box>
          </Box>
        </Grid>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <StyledButtonLeft
            onClick={() => handleRightButtonClick(1)}
            variant={step === 1 ? "contained" : "outlined"}
            color="redButton100"
            sx={{ mb: 2 }}
          >
            {i18n["postAJob.theBasics"]}
          </StyledButtonLeft>
          <StyledButtonLeft
            onClick={() => handleRightButtonClick(2)}
            // disabled={!jobId}
            variant={step === 2 ? "contained" : "outlined"}
            color="redButton100"
            sx={{ mb: 2 }}
          >
            {i18n["postAJob.theDetails"]}
          </StyledButtonLeft>
          <StyledButtonLeft
            onClick={() => handleRightButtonClick(3)}
            variant={step === 3 ? "contained" : "outlined"}
            color="redButton100"
            // disabled={!jobId}
          >
            {i18n["postAJob.theCulture"]}
          </StyledButtonLeft>
        </Box>
        {/* <ButtonPanel panelData={CANDIDATE_MY_CV_RIGHT} side='right' /> */}
      </Grid>
    </Box>
  );
}
