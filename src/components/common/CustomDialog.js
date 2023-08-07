import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import locale from "../../i18n/locale";
import Paper from "@mui/material/Paper";

const StyledDialog = styled(Dialog)(
  ({ theme, isApplyJob, isTalentMyJobsDialog, isProfile }) => ({
    "& .MuiDialog-container": {
      height: (isApplyJob && "auto") || (isTalentMyJobsDialog && "100%"),
    },
    "& .MuiPaper-root": {
      background: theme.palette.menuBackground,
      height:
        (isApplyJob && "65%") ||
        (isTalentMyJobsDialog && "100%") ||
        (isProfile && "92%"),
      padding: isTalentMyJobsDialog ? "16px" : "",
    },
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
      overflowY: isTalentMyJobsDialog && "hidden",
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    ".dialogContainer": {
      minHeight: "90%",
      maxHeight: "90%",
    },
    "& .MuiDialog-paper": {
      overflow: isTalentMyJobsDialog && "hidden",
    },
  })
);

function StyledDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        display: "flex",
        justifyContent: "center",
        fontWeight: 700,
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

StyledDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function StyledDialogAction(props) {
  const { children, ...other } = props;

  return (
    <DialogActions sx={{ justifyContent: "center" }} {...other}>
      {children}
    </DialogActions>
  );
}

export default function CustomDialog(props) {
  const i18n = locale.en;
  const {
    title,
    onDialogClose,
    show,
    children,
    dialogWidth = "xl",
    showFooter = true,
    footer,
    hideButton = true,
    isApplyJob,
    isTalentMyJobsDialog,
    isProfile,
    isInfo,
    padding,
  } = props;
  return (
    <StyledDialog
      isApplyJob={isApplyJob}
      isTalentMyJobsDialog={isTalentMyJobsDialog}
      isProfile={isProfile}
      isInfo={isInfo}
      open={show}
      keepMounted
      fullWidth={true}
      maxWidth={dialogWidth}
      classes={Paper}
      title={title}
      sx={{
        //             width: "500px",
        //             marginLeft: "auto",
        // marginRight: "auto",
        height:
          (title === "Login" && "420px") || (isTalentMyJobsDialog && "auto"),
      }}
    >
      <StyledDialogTitle id="customized-dialog-title" onClose={onDialogClose}>
        {/* {title} */}
      </StyledDialogTitle>
      <DialogContent sx={{ padding: `${padding} !important` }}>
        {children}
      </DialogContent>
      {hideButton && (
        <StyledDialogAction>
          {showFooter && footer ? (
            footer
          ) : (
            <Button
              disableElevation
              variant="contained"
              color="redButton"
              onClick={onDialogClose}
              sx={{
                width: "15%",
              }}
            >
              {i18n["dialog.close"]}
            </Button>
          )}
        </StyledDialogAction>
      )}
    </StyledDialog>
  );
}

CustomDialog.propTypes = {
  onDialogClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};
