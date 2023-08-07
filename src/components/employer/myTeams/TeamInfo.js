import {
  Avatar,
  Box,
  Button,
  Divider,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SmallButton from "../../common/SmallButton";
import TeamInfoDataTable from "./TeamInfoDataTable";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getTeamInfo } from "../../../redux/employer/myTeams";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import CloseIcon from "@mui/icons-material/Close";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, alpha } from "@mui/material/styles";

function createData(
  title,
  status,
  dateAdded,
  lastActive,
  permissions,
  assigned,
  job_id
) {
  return {
    title,
    status,
    dateAdded,
    lastActive,
    permissions,
    assigned,
    job_id,
  };
}

const BlueSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.greenButton.main,
    "&:hover": {
      backgroundColor: alpha(
        theme.palette.greenButton.main,
        theme.palette.action.hoverOpacity
      ),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.greenButton.main,
  },
  "& .MuiSwitch-track": {
    margin: "auto",
    height: "60% !important",
  },
  "& .css-jsexje-MuiSwitch-thumb": {
    borderRadius: "15% !important",
  },
}));

function getColorByIndex(index) {
  // Define an array of colors
  const colors = [
    "#FF5733", // Red
    "#4ea35d", // Green
    "#8268ff", // Blue
    "#ff83ca", // Pink
    "#00b3b3", // Cyan
  ];

  const colorIndex = index % colors.length;
  return colors[colorIndex];
}

export default function TeamInfo() {
  const [randomColor] = useState(() =>
    getColorByIndex(Math.floor(Math.random() * 1000))
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [employerType, setEmployerType] = useState("");
  const [memberName, setmemberName] = useState({});

  const { id } = useParams();

  const getTeamsInfo = async () => {
    try {
      const { payload } = await dispatch(getTeamInfo(id));
      if (payload?.status == "success") {
        setEmployerType(payload.data[0].employer_role_type);
        setRows(
          payload?.data.map((team) => {
            return createData(
              team?.title,
              "Offline",
              team?.created_at,
              team?.last_login_at,
              team?.employer_role_type,
              team?.assigned ? true : false,
              team?.job_id
            );
          })
        );
        setmemberName(payload.name);
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
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: ERROR_MSG,
        })
      );
    }
  };

  const handleOpenDelete = () => {
    setOpenDelete((prevState) => !prevState);
  };

  useEffect(() => {
    getTeamsInfo();
  }, [deleted !== 0]);
  return (
    <Box
      sx={{
        boxShadow: 2,
        borderRadius: "15px",
        backgroundColor: "#ffff",
        margin: "0 24px 24px 24px",
        // minHeight: "80vh",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        width: "57vh",
      }}
    >
      {/* HeaderSection Starts*/}
      <Box
        className="HeaderSection"
        sx={{
          p: "24px 54px 0 54px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          {/*<Avatar sx={{ bgcolor: randomColor }}>
            {`${memberName?.first_name[0]}`}
          </Avatar>*/}
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {`${memberName.first_name} ${memberName.last_name}`}
          </Typography>
          <SmallButton color={"yellowButton100"} m={0} label={employerType} />
          <SmallButton
            backgroundColor={"lightGray"}
            color={"black"}
            m={0}
            label={rows.length}
          />
          <EditIcon color="redButton100" />
          <ChangeHistoryIcon color="grayButton" />
          <DeleteIcon color="blueButton700" />
        </Box>
        <Box>
          <Typography variant="p">
            This user has access to the jobs below
          </Typography>
        </Box>

        <Box
          sx={{
            margin: "30px 0",
            display: "flex",
            gap: 2,
          }}
        >
          <Link to={`/employer/my-team`}>
            <Button
              variant="contained"
              color="grayButton200"
              sx={{
                width: "150px",
              }}
              // onClick={handleAddNewMemberClick}
            >
              Back
            </Button>
          </Link>

          {/*<Button variant="contained" color="redButton">
            remove recruiter
          </Button>
          <Box
            sx={{
              display: "flex",
              marginLeft: "auto",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleOpenDelete}
          >
            <CloseIcon color="redButton100" />
            <Typography>remove selected users</Typography>
          </Box>*/}
          <Box
            sx={{
              display: "flex",
              marginLeft: "auto",
              alignItems: "center",
              cursor: "pointer",
            }}
            // onClick={handleOpenDelete}
          >
            <Typography>Toggle all jobs</Typography>
            <BlueSwitch />
          </Box>
        </Box>
      </Box>
      {/* HeaderSection Ends*/}

      <Divider />
      {/* DataTable Section Starts */}
      <TeamInfoDataTable
        rows={rows}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        setDeleted={setDeleted}
      />

      {/* DataTable Section Ends */}
    </Box>
  );
}
