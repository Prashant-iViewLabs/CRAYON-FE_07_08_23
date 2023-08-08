import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

export default function Maintenance() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
