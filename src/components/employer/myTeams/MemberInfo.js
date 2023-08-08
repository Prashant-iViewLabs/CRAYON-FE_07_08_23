import { Box } from "@mui/material";
import React from "react";
import NameInfo from "./NameInfo";

export default function MemberInfo({ rows }) {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      // alignItems={"center"}
    >
      {rows.map((row, index) => {
        return (
          <NameInfo name={row.name} email={row.email} user_id={row.user_id} />
        );
      })}
    </Box>
  );
}
