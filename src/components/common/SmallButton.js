import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import locale from "../../i18n/locale";
import { Tooltip } from "@mui/material";

export default function SmallButton({
  color,
  label,
  startIcon,
  endIcon,
  textColor,
  height = 20,
  startIconMargin,
  onClick,
  value,
  justifyContent,
  disabled,
  ...props
}) {
  const i18n = locale.en;
  const theme = useTheme();

  return (
    <Tooltip title={value ? value : label} placement="top-end">
      <Button
        variant="contained"
        disabled={disabled}
        color={color}
        startIcon={startIcon}
        endIcon={endIcon}
        onClick={onClick}
        sx={{
          justifyContent: justifyContent,
          fontSize: 12,
          fontWeight: 300,
          letterSpacing: "0.75px",
          height: height,
          boxShadow: 0,
          borderRadius: "5px",
          color: textColor,
          minWidth: "fit-content",
          padding: "0 8px",
          ".MuiButton-startIcon": {
            marginRight: startIconMargin,
            marginLeft: 0,
          },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          ...props,
        }}
      >
        {/*{label?.length > 12 ? label.split(" ").at(0) : label}*/}
        {label}
      </Button>
    </Tooltip>
  );
}
