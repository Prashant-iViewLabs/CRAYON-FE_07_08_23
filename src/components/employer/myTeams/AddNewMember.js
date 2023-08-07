import React, { useState } from "react";
import {
  Grid,
  Box,
  Divider,
  Typography,
  InputLabel,
  Button,
  InputBase,
} from "@mui/material";

import {
  ALERT_TYPE,
  ERROR_MSG,
  MY_TEAMS_LEFT_PANEL,
} from "../../../utils/Constants";
import ButtonPanel from "../../common/ButtonPanel";
import InputBox from "../../common/InputBox";
import CustomDialog from "../../common/CustomDialog";
import { IconButton } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import SelectMenu from "../../common/SelectMenu";
import AutoComplete from "../../common/AutoComplete";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getPermissions,
  getCompanies,
  addNewMember,
} from "../../../redux/employer/myTeams";
import { setAlert } from "../../../redux/configSlice";
import { useSelector } from "react-redux";

const InviteStatus = [
  {
    id: "Invite Status",
    name: "Invite Status",
  },
  {
    id: "accepted",
    name: "accepted",
  },
  {
    id: "pending",
    name: "pending",
  },
  {
    id: "rejected",
    name: "rejected",
  },
];

const MEMBER_INFO = {
  first_name: "",
  last_name: "",
  email: "",
  contact: "",
  password: "",
  company_id: "",
  role_type_id: "",
};

const AddNewMember = () => {
  const navigate = useNavigate();
  const [invitSent, setInviteSent] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [companies, setCompanies] = useState([]);
  // const [permission, setPermission] = useState([]);
  const [memberData, setMemberData] = useState(MEMBER_INFO);
  const [newPassword, setNewPassword] = useState("");
  const { permission } = useSelector((state) => state.configMyTeams);

  const dispatch = useDispatch();

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleCancelButton = () => {
    navigate("/employer/my-team");
  };

  const getAllData = async () => {
    try {
      await dispatch(getPermissions());
      const company = await dispatch(getCompanies());
      setCompanies(company.payload.data);
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

  const handleCompVal = (event, newValue, id) => {
    let newmemberData = {};
    newmemberData = {
      ...memberData,
      [id]: newValue?.company_id || newValue?.inputValue,
    };
    setMemberData(newmemberData);
  };

  const handleChange = (event) => {
    const {
      target: { value },
      target: { name },
    } = event;

    const newmemberData = {
      ...memberData,
      [name]: value,
    };
    setMemberData(newmemberData);
  };

  const handleInputChange = (event) => {
    console.log(event.target.id);
    if (event.target.id === "contact") {
      const newmemberData = {
        ...memberData,
        [event.target.id]: event.target.value,
      };
      setMemberData(newmemberData);
    } else {
      const newmemberData = {
        ...memberData,
        [event.target.id]: event.target.value,
      };
      setMemberData(newmemberData);
    }
  };

  const saveNewMember = async () => {
    try {
      console.log(memberData);
      const { payload } = await dispatch(addNewMember(memberData));
      if (payload.status === "success") {
        setInviteSent((prevState) => !prevState);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Member added successfully",
          })
        );
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.ERROR,
            msg: payload.error,
          })
        );
      }
    } catch (error) {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: error,
        })
      );
    }
  };

  const handlePassword = (event) => {
    setNewPassword(event.target.value);
    console.log(event.target.id);
    const newmemberData = {
      ...memberData,
      [event.target.id]: event.target.value,
    };
    console.log(newmemberData);
    setMemberData(newmemberData);
  };

  const handleAddAnotherUser = () => {
    setMemberData(MEMBER_INFO);
    setInviteSent(false);
    navigate("/employer/my-team/add-new-member");
  };

  useEffect(() => {
    getAllData();
  }, []);
  return (
    // <Grid
    //     container
    //     spacing={0}
    //     // flexDirection={{ xs: "column", sm: "row" }}
    //     justifyContent="space-between"
    //     flexWrap={"nowrap"}
    // >
    //     <Box>

    //         <ButtonPanel
    //             panelData={MY_TEAMS_LEFT_PANEL}
    //             side="left"
    //         // onChangeFilter={teamStatusFilter}
    //         />
    //     </Box>
    <Box
      sx={{
        boxShadow: 2,
        borderRadius: "15px",
        backgroundColor: "#ffff",
        margin: "0 24px 0 24px",
        // minHeight: "80vh",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        className="HeaderSection"
        sx={{
          p: "24px 54px 24px 54px",
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
            Add a new user
          </Typography>
        </Box>
        <Box>
          <Typography variant="p">
            Add a team member, recruiter or promoter to your team
          </Typography>
        </Box>
      </Box>
      <Divider />
      {console.log(memberData)}
      <Grid
        container
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          padding: "24px 54px 24px 54px",
        }}
      >
        <Grid item xs={12} md={6}>
          <InputLabel
            htmlFor="role_type_id"
            sx={{
              color: "black",

              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Permission Type
          </InputLabel>
          <SelectMenu
            name="role_type_id"
            value={memberData?.permission !== "" ? memberData?.permission : ""}
            onHandleChange={handleChange}
            options={permission}
            sx={{ width: "95%" }}
            placeholder={"Select permission for new user"}
          />
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12} md={6}>
          <InputLabel
            htmlFor="email"
            sx={{
              color: "black",

              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Email
          </InputLabel>

          <InputBox
            value={memberData?.email !== "" ? memberData?.email : ""}
            id="email"
            onChange={handleInputChange}
            placeholder="Enter the new user's email address"
          ></InputBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel
            htmlFor="company_id"
            sx={{
              color: "black",

              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Company
          </InputLabel>
          <AutoComplete
            showAddOption={true}
            allowCustomInput={true}
            id="company_id"
            // value={getCompValue()}
            value={
              companies?.find(
                (title) => title.company_id === memberData?.company_name
              ) || memberData?.company_name
            }
            onChange={handleCompVal}
            placeholder={"Enter the user's compnay"}
            data={companies}
          ></AutoComplete>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel
            htmlFor="first_name"
            sx={{
              color: "black",

              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            First Name
          </InputLabel>
          <InputBox
            id="first_name"
            value={memberData?.first_name !== "" ? memberData?.first_name : ""}
            onChange={handleInputChange}
            placeholder="Enter their first name"
          ></InputBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel
            htmlFor="last_name"
            sx={{
              color: "black",

              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Surname
          </InputLabel>
          <InputBox
            value={memberData?.surname !== "" ? memberData?.surname : ""}
            id="last_name"
            onChange={handleInputChange}
            placeholder="Enter their surname"
          ></InputBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel
            htmlFor="contact"
            sx={{
              color: "black",

              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Phone Number
          </InputLabel>
          <InputBox
            value={memberData?.contact ? memberData?.contact : ""}
            id="contact"
            onChange={handleInputChange}
            placeholder="Enter their contact number"
          ></InputBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel
            htmlFor="password"
            sx={{
              color: "black",

              paddingBottom: "2px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Create Temporary Password
          </InputLabel>
          <Box
            sx={{
              display: "flex",
              height: "40px",
              borderRadius: "25px",
              boxShadow: "none",
              justifyContent: "space-between",
              padding: "0 10px",
              border: `1px solid lightGray`,
            }}
          >
            <InputBase
              sx={{
                flexGrow: 1,
              }}
              id="password"
              value={newPassword !== "" ? newPassword : ""}
              type={"password"}
              placeholder="Enter a temporary password"
              onChange={handlePassword}
            ></InputBase>
            <IconButton
              sx={{ py: 0 }}
              color=""
              aria-label="reset password"
              component="button"
              onClick={handleShowPassword}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={{
          margin: "auto",
        }}
      >
        <Button
          variant="contained"
          sx={{
            borderRadius: "20px 0 0 0",
            backgroundColor: "lightgray",
            width: "11rem",
            padding: "25px 40px",
            color: "black",
          }}
          onClick={handleCancelButton}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          backgroundColor={"redButton"}
          sx={{
            borderRadius: "0 20px 0 0",
            width: "11rem",
            padding: "25px 40px",
          }}
          color="redButton100"
          onClick={saveNewMember}
        >
          Send Invite
        </Button>
        <CustomDialog
          show={invitSent}
          hideButton={false}
          dialogWidth="xs"
          showFooter={false}
          onDialogClose={saveNewMember}
          padding={0}
        >
          <Box
            sx={{
              padding: 4,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={"Bold"}
              textAlign={"center"}
              sx={{
                marginBottom: 3,
              }}
            >
              invite sent!
            </Typography>
            <Typography
              fontSize={16}
              fontWeight={"bold"}
              textAlign={"center"}
              paragraph
            >
              the new admin or member will receive an invite to join via email.
            </Typography>
          </Box>
          <Box>
            <Button
              sx={{
                boxShadow: 0,
                fontSize: "14px",
                width: "50%",
                borderRadius: 0,
                height: "43px",
                background: "lightgray",
                color: "black",
                padding: 3,
              }}
              variant="contained"
              onClick={handleCancelButton}
            >
              Back To Team Status
            </Button>

            <Button
              sx={{
                boxShadow: 0,
                fontSize: "14px",
                width: "50%",
                borderRadius: 0,
                height: "43px",
                padding: 3,
              }}
              variant="contained"
              color="redButton100"
              onClick={handleAddAnotherUser}
            >
              Add another user
            </Button>
          </Box>
        </CustomDialog>
      </Box>
    </Box>
    //     <Box>

    //         <ButtonPanel
    //             panelData={InviteStatus}
    //             side="right"
    //         // onChangeFilter={}
    //         />
    //     </Box>
    // </Grid >
  );
};

export default AddNewMember;
