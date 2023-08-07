import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { useTheme } from "@emotion/react";

export default function InputBox({
  id,
  placeholder,
  sx,
  type = "text",
  value,
  onChange,
  disabled = false,
  multiline = false,
}) {
  const theme = useTheme();
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        borderRadius: "25px",
        height: "40px !important",
        boxShadow: "none",
        border: `1px solid ${theme.palette.grayBorder}`,
        ...sx,
      }}
    >
      <InputBase
        sx={{ ml: 2, mr: 2, width: "100%" }}
        id={id}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        multiline={multiline}
        rows={multiline ? 4 : 1}
      />
    </Paper>
  );
}
