import React from "react";
import { Box, Typography, Link, Button, Divider } from "@mui/material";

import { useNavigate } from "react-router-dom";
import TeamsDataTable from "./TeamsDataTable";
import SmallButton from "../../common/SmallButton";
import {
  getAllTeamMembers,
  removeMember,
} from "../../../redux/employer/myTeams";
import { useDispatch } from "react-redux";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import { useEffect } from "react";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

function createData(
  name,
  email,
  status,
  dateAdded,
  lastActive,
  permissions,
  user_id
) {
  return {
    name,
    email,
    status,
    dateAdded,
    lastActive,
    permissions,
    user_id,
  };
}

const TeamTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [companyName, setCompanyName] = useState("");

  const handleAddNewMemberClick = () => {
    navigate("add-new-member");
  };

  const getTeamsMember = async () => {
    try {
      const { payload } = await dispatch(getAllTeamMembers({ job_id: "" }));
      if (payload?.status == "success") {
        setCompanyName(payload.companyName);
        setRows(
          payload?.data.map((team) => {
            return createData(
              team?.user?.first_name,
              team?.user?.email,
              "Offline",
              team?.created_at,
              team?.user?.last_login_at,
              team?.employer_role_type?.name,
              team?.user_id
            );
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
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: ERROR_MSG,
        })
      );
    }
  };

  useEffect(() => {
    console.log(deleted);
    getTeamsMember();
  }, [deleted !== 0]);

  const handleOpenDelete = () => {
    setOpenDelete((prevState) => !prevState);
  };
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
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {companyName}
          </Typography>
          <SmallButton
            backgroundColor={"lightGray"}
            color={"black"}
            m={0}
            label={rows.length}
          />
        </Box>
        <Box>
          <Typography variant="p">
            Add and manage your team's and recruiter account permissions
          </Typography>
        </Box>
        <Box
          sx={{
            margin: "30px 0",
            display: "flex",
            gap: 2,
          }}
        >
          {/* <Link to={`add-new-member`}> */}
          <Button
            variant="contained"
            color="redButton"
            onClick={handleAddNewMemberClick}
          >
            add new member
          </Button>
          {/* </Link> */}
          <Button variant="contained" color="grayButton">
            download CSV
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
          </Box>
        </Box>
      </Box>
      {/* HeaderSection Ends*/}

      <Divider />
      {/* DataTable Section Starts */}
      <TeamsDataTable
        rows={rows}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        setDeleted={setDeleted}
      />
      {/* DataTable Section Ends */}
    </Box>
  );
};

export default TeamTable;
