import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
export default function TextWrapper({
  children,
  line = 3,
  weight = 400,
  size = 14,
  minHeight,
  ...rest
}) {
  return (
    <Tooltip
      arrow
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      title={children}
      placement="top"
    >
      <Typography
        sx={{
          minHeight: minHeight ? minHeight : "60px",
          fontWeight: weight,
          fontSize: size,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: line,
          ...rest,
        }}
        gutterBottom
      >
        {children}
      </Typography>
    </Tooltip>
  );
}
