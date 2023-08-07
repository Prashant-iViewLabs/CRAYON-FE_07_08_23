import * as React from "react";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";

const steps = [
  {
    label: "Step1",
    description: `Apply if you're a fit`,
  },
  {
    label: "Step2",
    description:
      "Answer Q&A section and create your application video (if required)",
  },
  {
    label: "Step3",
    description: `Sing-up and complete your profile and 'the basic' section of your Crayon Vitae to be considered`,
  },
  {
    label: "Step4",
    description: `Review the stage and status of your application on your Crayon dashboard`,
  },
];

export default function VerticalStepper() {
  return (
    <Grid container display="flex"  margin={"auto"}>
      <Box style={{ marginLeft: "20px" }}>
        <Grid container sx={{ marginTop: "20px" }}>
          {steps.map((step, index) => (
            <Grid item xs={12} key={index} sx={{ marginTop: "20px" }}>
              <Box
                style={{
                  position: "relative",
                  paddingLeft: "20px",
                }}
              >
                {index < 3 && (
                  <Box
                    style={{
                      position: "absolute",
                      left: "-10px",
                      top: "35px",
                      height: "95%",
                      borderLeft: `2px solid #2FA84F`,
                    }}
                  />
                )}
                <Box
                  style={{
                    backgroundColor: "#2FA84F",
                    borderRadius: "50%",
                    color: "#FFFFFF",
                    width: "30px",
                    height: "30px",
                    textAlign: "center",
                    lineHeight: "30px",
                    fontWeight: "bold",
                    position: "absolute",
                    top: "0px",
                    left: "-23px",
                  }}
                >
                  {index + 1}
                </Box>
                <Box style={{ marginLeft: "15px" }}>
                  <h3 style={{ color: "#000000", margin: "0" }}>
                    {step.label}
                  </h3>
                  <p style={{ marginTop: "0" }}>{step.description}</p>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Grid>
  );
}
