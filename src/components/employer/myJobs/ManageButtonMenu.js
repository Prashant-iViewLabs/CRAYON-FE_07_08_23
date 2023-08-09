import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import locale from "../../../i18n/locale";
import { alpha, styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import profile from "../../../assets/profile.png";
import {
  duplicateThejob,
  getManage,
  statusChange,
} from "../../../redux/employer/myJobsSlice";
import { useDispatch } from "react-redux";
import { setAlert, setLoading } from "../../../redux/configSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import SmallButton from "../../common/SmallButton";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { RemoveRedEyeOutlined } from "@mui/icons-material";

const StyledMenu = styled((props) => (
  <Menu
    elevation={4}
    // anchorOrigin={{
    //   vertical: "bottom",
    //   horizontal: "right",
    // }}
    // transformOrigin={{
    //     vertical: 'top',
    //     horizontal: 'right',
    // }}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 5,
    // minWidth: 260,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    backgroundColor: theme.palette.menuBackground,

    "& .MuiList-root": {
      paddingTop: 0,
    },
    // boxShadow:
    //     'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    // '& .MuiMenu-list': {
    //     padding: '4px 0',
    // },
    // '& .MuiMenuItem-root': {
    //     '& .MuiSvgIcon-root': {
    //         fontSize: 18,
    //         color: theme.palette.text.secondary,
    //         marginRight: theme.spacing(1.5),
    //     },
    //     '&:active': {
    //         backgroundColor: alpha(
    //             theme.palette.primary.main,
    //             theme.palette.action.selectedOpacity,
    //         ),
    //     },
    // },
    "& .MuiTypography-root": {
      fontSize: "14px",
      fontWeight: 700,
    },
  },
  "& .MuiFormControlLabel-root": {
    height: "30px",
    "& .MuiTypography-root": {
      fontSize: "12px",
      color: theme.palette.lightText,
      fontWeight: 400,
    },
  },
}));

const BlueSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.blueButton400.main,
    "&:hover": {
      backgroundColor: alpha(
        theme.palette.blueButton400.main,
        theme.palette.action.hoverOpacity
      ),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.blueButton400.main,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  p: 4,
  boxShadow: "none !important",
  border: "1px solid rgb(197, 197, 197) !important",
};

const ManageButtonMenu = ({ job }) => {
  const i18n = locale.en;
  const theme = useTheme();
  const history = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [manage, setManage] = useState("");
  const dispatch = useDispatch();
  const [temp, setTemp] = useState("");
  const [open2, setOpen2] = useState(false);

  const handleClose2 = () => setOpen2(false);

  const pauseJobData = {
    job_id: job?.job_id,
    status: "paused",
  };
  const closeJobData = {
    job_id: job?.job_id,
    status: "closed",
  };
  const reactivateJobData = {
    job_id: job?.job_id,
    status: "reactivate",
  };
  const duplicateJobData = {
    job_id: job?.job_id,
  };
  const reactivateJob = async () => {
    try {
      const { payload } = await dispatch(statusChange(reactivateJobData));
      if (payload?.status == "success") {
        setManage(payload?.statusname);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Job Reactivated successfully!",
          })
        );
        handleClose2();
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: payload?.message,
          })
        );
      }
    } catch (error) {
      dispatch(setAlert({ show: true }));
    }
  };
  const pauseJob = async () => {
    try {
      const { payload } = await dispatch(statusChange(pauseJobData));
      if (payload?.status == "success") {
        setManage(payload?.statusname);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Job Paused successfully!",
          })
        );
        handleClose2();
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: payload?.message,
          })
        );
      }
    } catch (error) {
      dispatch(setAlert({ show: true }));
    }
  };
  const closeJob = async () => {
    try {
      const { payload } = await dispatch(statusChange(closeJobData));
      if (payload?.status == "success") {
        setManage(payload?.statusname);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Job Closed successfully!",
          })
        );
        handleClose2();
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: payload?.message,
          })
        );
      }
    } catch (error) {
      dispatch(setAlert({ show: true }));
    }
  };
  const duplicateJob = async () => {
    try {
      console.log(duplicateJobData);
      const { payload } = await dispatch(duplicateThejob(duplicateJobData));
      if (payload?.status == "success") {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Job Duplicated successfully!",
          })
        );
        console.log(payload.data[0].job_id);
        history(`/employer/post-a-job/${payload.data[0]?.job_id}`);
        handleClose2();
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: payload?.message,
          })
        );
      }
    } catch (error) {
      dispatch(setAlert({ show: true }));
    }
  };

  const handleOpen2 = (str) => {
    setOpen2(true);
    setTemp(str);
  };
  const handleJobStatus = () => {
    if (temp == "a") {
      history(`/employer/post-a-job/${job?.job_id}`);
    } else if (temp == "b") {
      pauseJob();
    } else if (temp == "c") {
      closeJob();
    } else if (temp == "d") {
      duplicateJob();
    } else if (temp == "e") {
      reactivateJob();
    }
  };

  const getManageData = async () => {
    try {
      dispatch(setLoading(true));
      const [manage] = await Promise.all([dispatch(getManage(job?.job_id))]);
      setManage(manage.payload.statusname);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: ERROR_MSG,
        })
      );
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    getManageData();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        id="customized-button"
        aria-controls={open ? "customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        elevation={0}
        onClick={handleClick}
        startIcon={<KeyboardArrowUpIcon />}
        color="grayButton100"
        sx={{ boxShadow: 0, width: "100%", height: "50px", borderRadius: 0 }}
      >
        {i18n["manageJob.manage"]}
      </Button>
      <StyledMenu
        id="customized-menu"
        MenuListProps={{
          "aria-labelledby": "customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {/* <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.25px",
            }}
          >
            Job status:{" "}
            {manage == "active" && (
              <SmallButton color="greenButton200" label={manage} mr={1} />
            )}
            {manage == "pending" && (
              <SmallButton color="orangeButton" label={manage} mr={1} />
            )}
            {manage == "paused" && (
              <SmallButton color="orangeButton" label={manage} mr={1} />
            )}
            {manage == "closed" && (
              <SmallButton color="redButton100" label={manage} mr={1} />
            )}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.25px",
            }}
          >
            Job actions:
          </Typography>
        </Box> */}
        <Box sx={{ display: "flex", flexDirection: "column", padding: 0, boxShadow: 0 }}>
          <Button
            sx={{
              boxShadow: 0,
              fontSize: "12px",
              height: "38px",
              borderRadius: 0,
              padding: "20px 8px",
              justifyContent: "start"
            }}
            onClick={() => handleOpen2("a")}
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            color="grayButton100"
          >
            {i18n["manageJob.editJob"]}
          </Button>
          {manage == "paused" || manage == "closed" ? (
            <Button
              sx={{
                boxShadow: 0,
                fontSize: "12px",
                height: "38px",
                borderRadius: 0,
                padding: "20px 8px",
                justifyContent: "start"
                
              }}
              onClick={() => handleOpen2("e")}
              variant="contained"
              color="grayButton100"
              >
              {i18n["manageJob.reactivateJob"]}
            </Button>
          ) : (
            <Button
              sx={{
                boxShadow: 0,
                fontSize: "12px",
                height: "38px",
                borderRadius: 0,
                padding: "20px 8px",
                justifyContent: "start"
                
              }}
              startIcon={<PauseIcon/>}
              onClick={() => handleOpen2("b")}
              variant="contained"
              color="grayButton100"
            >
              {i18n["manageJob.pauseJob"]}
            </Button>
          )}

          <Button
            sx={{
              boxShadow: 0,
              fontSize: "12px",
              height: "38px",
              borderRadius: 0,
              padding: "20px 8px",
              justifyContent: "start"
              
            }}
            onClick={() => handleOpen2("c")}
            variant="contained"
            color="grayButton100"
            startIcon={<CloseIcon />}
          >
            {i18n["manageJob.closeJob"]}
          </Button>
          <Button
            sx={{
              boxShadow: 0,
              fontSize: "12px",
              height: "38px",
              borderRadius: 0,
              padding: "20px 8px",
              justifyContent: "start"
              
            }}
            variant="contained"
            color="grayButton100"
            onClick={() => handleOpen2("d")}
            startIcon={<FilterNoneIcon />}

          >
            {i18n["manageJob.duplicateJob"]}
          </Button>
          <Modal
            open={open2}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure that you want to {temp == "a" && "Edit"}
                {temp == "b" && "Pause"}
                {temp == "c" && "Close"}
                {temp == "d" && "Duplicate"}
                {temp == "e" && "Reactivate"} this job?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  sx={{
                    height: "38px",
                    
                    mr: 2,
                  }}
                  variant="contained"
                  color="grayButton100"
                  onClick={handleJobStatus}
                >
                  YES
                </Button>
                <Button
                  sx={{
                    height: "38px",
                    
                    mr: 2,
                  }}
                  onClick={handleClose2}
                  variant="contained"
                  color="redButton100"
                >
                  CANCEL
                </Button>
              </Box>
            </Box>
          </Modal>
          <Button
            sx={{
              boxShadow: 0,
              fontSize: "12px",
              height: "38px",
              borderRadius: 0,
              padding: "20px 8px",
              justifyContent: "start"
              
            }}
            // onClick={() => handleOpen2("c")}
            variant="contained"
            color="grayButton100"
            startIcon={<RemoveRedEyeOutlined />}

          >
            View Job
          </Button>
        </Box>
      </StyledMenu>
    </>
  );
};

export default ManageButtonMenu;
