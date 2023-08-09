import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
export default function TextWrapper({
  children,
  line = 3,
  weight = 400,
  size = 14,
  gutterBottom = true,
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
          fontWeight: weight,
          fontSize: size,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: line,
          ...rest,
        }}
        gutterBottom={gutterBottom}
      >
        {children}
      </Typography>
    </Tooltip>
  );
}
