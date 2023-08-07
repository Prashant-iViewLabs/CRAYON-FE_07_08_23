import React, { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import done from "../../../assets/relocate.svg";
import Box from "@mui/material/Box";
import SmallButton from "../../common/SmallButton";
import { Link } from "react-router-dom";

const TrackButton = ({ job }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(job);
  return (
    <>
      <Button
        variant="contained"
        sx={{
          marginLeft: 1,
        }}
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Track
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        elevation={2}
      >
        <Box
          sx={{
            padding: "10px",
          }}
        >
          <Box mb={2}>
            <strong>My Stage:</strong>
            <SmallButton
              color="lightGreenButton300"
              ml={1}
              label={job?.job_users[0]?.job_user_status?.name}
            />
          </Box>
          <Box>
            <h4>
              <strong>Application Steps:</strong>
            </h4>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "15rem",
                  borderRadius: "10px",
                }}
                color={"lightGreenButton300"}
                endIcon={<CheckIcon />}
              >
                {" "}
                Q&A
              </Button>

              <Button
                variant="outlined"
                sx={{
                  width: "15rem",
                  borderRadius: "10px",
                }}
              >
                {" "}
                Application video
              </Button>

              {job?.profileCompleted ? (
                <Button
                  variant={job?.profileCompleted ? "contained" : "outlined"}
                  sx={{
                    width: "15rem",
                    borderRadius: "10px",
                  }}
                  color={job?.profileCompleted ? "lightGreenButton300" : ""}
                  endIcon={job?.profileCompleted ? <CheckIcon /> : ""}
                >
                  {" "}
                  My Profile
                </Button>
              ) : (
                <Link to={"/candidate/my-profile"}>
                  <Button
                    variant="outlined"
                    sx={{
                      width: "15rem",
                      borderRadius: "10px",
                    }}
                  >
                    {" "}
                    My Profile
                  </Button>
                </Link>
              )}

              {job?.cvCompleted ? (
                <Button
                  variant={job?.cvCompleted ? "contained" : "outlined"}
                  sx={{
                    width: "15rem",
                    borderRadius: "10px",
                  }}
                  color={job?.cvCompleted ? "lightGreenButton300" : ""}
                  endIcon={job?.cvCompleted ? <CheckIcon /> : ""}
                >
                  {" "}
                  Crayon vitae
                </Button>
              ) : (
                <Link to={"/candidate/my-cv"}>
                  <Button
                    variant="outlined"
                    sx={{
                      width: "15rem",
                      borderRadius: "10px",
                    }}
                  >
                    {" "}
                    Crayon vitae
                  </Button>
                </Link>
              )}
            </Box>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default TrackButton;
