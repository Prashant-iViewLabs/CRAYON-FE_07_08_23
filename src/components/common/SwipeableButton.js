import { useRef } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { styled, useTheme } from "@mui/material/styles";
import locale from "../../i18n/locale";
import Typography from "@mui/material/Typography";
import { USER_TYPES } from "../../utils/Constants";

export default function SwipeableButton({ selectedUser, onButtonToggle }) {
  const i18n = locale.en;
  const slider = useRef();
  const container = useRef();
  const theme = useTheme();

  const ButtonComponent = ({ selectedUser, nextUser }) => {
    return (
      <Button
        sx={{
          width: 100,
          boxShadow: 0,
        }}
        variant="contained"
        color="blueButton400"
        onClick={(e) => onButtonToggle(e, nextUser)}
      >
        {selectedUser}
      </Button>
    );
  };

  const TypographyComponent = ({ user, children, ...otherStyles }) => {
    return (
      <Typography
        onClick={(e) => onButtonToggle(e, user)}
        sx={{
          fontWeight: 300,
          color: theme.palette.lightGray,
          cursor: "pointer",
          ...otherStyles,
        }}
        variant="subtitle1"
      >
        {children}
      </Typography>
    );
  };
  return (
    <Paper
  elevation={3}
  sx={{
    display: "flex",
    borderRadius: "25px",
    height: "40px",
    alignItems: "center",
    justifyContent: "space-between",
    overflowX: "auto",
    whiteSpace: "nowrap",
    padding: "0 1px",
  }}
  style={{
    maxWidth: "100%",
  }}
>
  {selectedUser === USER_TYPES[0] ? (
    <ButtonComponent selectedUser={selectedUser} nextUser={USER_TYPES[1]} />
  ) : (
    <TypographyComponent user={USER_TYPES[0]} ml={3}>
      {USER_TYPES[0]}
    </TypographyComponent>
  )}
  {selectedUser === USER_TYPES[1] ? (
    <ButtonComponent selectedUser={selectedUser} nextUser={USER_TYPES[2]} />
  ) : (
    <TypographyComponent
      user={USER_TYPES[1]}
      mr={selectedUser === USER_TYPES[0] ? 3 : 0}
      ml={selectedUser === USER_TYPES[2] ? 3 : 0}
    >
      {USER_TYPES[1]}
    </TypographyComponent>
  )}
  {selectedUser === USER_TYPES[2] ? (
    <ButtonComponent selectedUser={selectedUser} nextUser={USER_TYPES[0]} />
  ) : (
    <TypographyComponent user={USER_TYPES[2]} mr={3}>
      {USER_TYPES[2]}
    </TypographyComponent>
  )}
</Paper>
  );
}
