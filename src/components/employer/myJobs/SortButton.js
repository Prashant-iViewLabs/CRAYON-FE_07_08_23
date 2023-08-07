import React, { useState } from "react";
import { Button, MenuList, Box } from "@mui/material";
import sortLogo from "../../../assets/sort_logo.svg";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";

import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { getTalentJobStatusApplications } from "../../../redux/employer/myJobsSlice";

const sortingOptions = [
  "A to Z",
  "Lowest Salary",
  "Highest Salary",
  "Lowest QL",
  "Highest Ql",
];

const StyledMenu = styled((props) => (
  <Menu
    elevation={4}
    // anchorOrigin={{
    //     vertical: 'bottom',
    //     horizontal: 'right',
    // }}
    // transformOrigin={{
    //     vertical: 'top',
    //     horizontal: 'right',
    // }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 5,
    minWidth: 80,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    backgroundColor: theme.palette.menuBackground,
    padding: "0 8px 0 9px",
    "& .MuiList-root": {
      paddingTop: 0,
    },
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
// const StyledMenu = styled((props) => (
//     <Menu
//         elevation={4}
//         anchorOrigin={{
//             vertical: "bottom",
//             horizontal: "right",
//         }}
//         // transformOrigin={{
//         //     vertical: 'top',
//         //     horizontal: 'right',
//         // }}
//         {...props}
//     />
// ))(({ theme }) => ({
//     "& .MuiPaper-root": {
//         borderRadius: 5,
//         minWidth: 260,
//         color:
//             theme.palette.mode === "light"
//                 ? "rgb(55, 65, 81)"
//                 : theme.palette.grey[300],
//         backgroundColor: theme.palette.menuBackground,
//         padding: "8px 8px 8px 8px",
//         "& .MuiList-root": {
//             paddingTop: 0,
//         },
//         // boxShadow:
//         //     'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
//         // '& .MuiMenu-list': {
//         //     padding: '4px 0',
//         // },
//         // '& .MuiMenuItem-root': {
//         //     '& .MuiSvgIcon-root': {
//         //         fontSize: 18,
//         //         color: theme.palette.text.secondary,
//         //         marginRight: theme.spacing(1.5),
//         //     },
//         //     '&:active': {
//         //         backgroundColor: alpha(
//         //             theme.palette.primary.main,
//         //             theme.palette.action.selectedOpacity,
//         //         ),
//         //     },
//         // },
//         "& .MuiTypography-root": {
//             fontSize: "14px",
//             fontWeight: 700,
//         },
//     },
//     "& .MuiFormControlLabel-root": {
//         height: "30px",
//         "& .MuiTypography-root": {
//             fontSize: "12px",
//             color: theme.palette.lightText,
//             fontWeight: 400,
//         },
//     },
// }));

const SortButton = ({ jobId, jobStatusId, handleSortedValue }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = async (sortoption) => {
    console.log(sortoption, jobId, jobStatusId);
    try {
      const { payload } = await dispatch(
        getTalentJobStatusApplications({
          job_id: jobId,
          job_status_id: jobStatusId,
          sortType: sortoption,
        })
      );
      setAnchorEl(null);
      handleSortedValue(jobStatusId, payload?.data);
      console.log(payload);
    } catch (error) {}
  };

  return (
    <>
      <Button
        variant="text"
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Box component="img" alt="sortLogo" src={sortLogo} />
      </Button>
      <StyledMenu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {sortingOptions.map((selectedOption, index) => (
          <MenuList
            sx={{
              padding: 0,
            }}
          >
            <Button
              sx={{
                borderRadius: "10px",
                width: "100%",
                color: "black",
              }}
              variant="text"
              onClick={() => handleSort(index)}
            >
              {selectedOption}
            </Button>
          </MenuList>
        ))}
      </StyledMenu>
    </>
  );
};

export default SortButton;
