import React from "react";
import { Grid, Box } from "@mui/material";
import ButtonPanel from "../../common/ButtonPanel";
import {
  MY_TEAMS_LEFT_PANEL,
  MY_TEAMS_INVITE_STATUS,
} from "../../../utils/Constants";
import { Outlet } from "react-router-dom";

const MyTeams = () => {
  return (
    <Grid
      container
      spacing={0}
      // flexDirection={{ xs: "column", sm: "row" }}
      flexWrap={"nowrap"}
      justifyContent="space-between"
    >
      <Box>
        <ButtonPanel
          panelData={MY_TEAMS_LEFT_PANEL}
          side="left"
          // onChangeFilter={teamStatusFilter}
        />
      </Box>
      <Outlet />
      <Box>
        <ButtonPanel
          panelData={MY_TEAMS_INVITE_STATUS}
          side="right"

          // onChangeFilter={}
        />
      </Box>
    </Grid>
  );
};

export default MyTeams;
