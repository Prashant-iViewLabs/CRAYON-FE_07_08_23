import React, { useState } from "react";
import SmallButton from "../../common/SmallButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useDispatch } from "react-redux";
import { statusChange } from "../../../redux/employer/myJobsSlice";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE } from "../../../utils/Constants";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ChangeStatusButton = ({ loggedInUser, jobId, jobStatus }) => {
  const [status, setStatus] = useState(jobStatus);
  console.log(jobId);
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pauseJobData = {
    job_id: jobId,
    status: "paused",
  };
  const closeJobData = {
    job_id: jobId,
    status: "closed",
  };
  const pauseJob = async () => {
    try {
      const { payload } = await dispatch(statusChange(pauseJobData));
      if (payload?.status == "success") {
        setStatus(status);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Job Paused successfully!",
          })
        );
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
        setStatus(status);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Job Closed successfully!",
          })
        );
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

  const isDisabled = loggedInUser === 4 && status === "pending";
  const handleStatusChange = (status) => {
    if (status === "paused") {
      pauseJob();
    } else if (status === "closed") {
      closeJob();
    }
    handleClose();
  };
  return (
    <>
      <SmallButton
        id="fade-button"
        color={
          (status === "paused" && "redButton") ||
          (status === "closed" && "redButton") ||
          (status === "pending" && "orangeButton") ||
          (status === "active" && "lightGreenButton300")
        }
        endIcon={loggedInUser === 4 ? "" : <KeyboardArrowDownIcon />}
        height={24}
        fontWeight={700}
        label={status}
        borderRadius="25px"
        mr="8px"
        onClick={handleClick}
        disabled={isDisabled}
      ></SmallButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {status === "pending" && [
          <MenuItem key="pending" onClick={() => handleStatusChange("pending")}>
            Pending
          </MenuItem>,
          <MenuItem key="active" onClick={() => handleStatusChange("active")}>
            Active
          </MenuItem>,
        ]}
        {status === "active" && [
          <MenuItem key="paused" onClick={() => handleStatusChange("paused")}>
            Pause
          </MenuItem>,
          <MenuItem key="closed" onClick={() => handleStatusChange("closed")}>
            Close
          </MenuItem>,
        ]}
        {(status === "paused" || status === "closed") && (
          <MenuItem onClick={() => handleStatusChange("pending")}>
            Reactivate
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ChangeStatusButton;
