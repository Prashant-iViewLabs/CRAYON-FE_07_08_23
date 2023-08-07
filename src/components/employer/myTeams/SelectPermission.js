import React, { useEffect, useState } from "react";
import { MenuItem, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { useDispatch } from "react-redux";
import { changeStatus } from "../../../redux/employer/myTeams";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE } from "../../../utils/Constants";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 12,
    position: "relative",
    // backgroundColor: theme.palette.background.default,
    border: "1px solid #ced4da",
    fontSize: 14,
    fontWeight: "Bold",
    padding: "5px 26px 5px 12px",
    backgroundColor: "lightGray",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 12,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const SelectPermission = ({ selectedPermission, user_id }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const permissionOptions = [
    { value: 1, label: "Super Admin" },
    { value: 2, label: "Admin" },
    { value: 3, label: "Team Member" },
    { value: 4, label: "Recruiter" },
    { value: 5, label: "Promoter" },
  ];

  useEffect(() => {
    setSelectedValue(findValueByLabel(selectedPermission));
  }, [selectedPermission]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    permissionChange(event.target.value);
  };

  const findValueByLabel = (label) => {
    const option = permissionOptions.find((option) => option.label === label);
    return option ? option.value : "";
  };

  const permissionChange = async (role_id) => {
    try {
      const data = {
        new_role_id: role_id,
        employerid: user_id,
      };
      const { payload } = await dispatch(changeStatus(data));
      console.log(payload);
      if (payload.status === "success") {
        console.log(payload);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Permission changed successfully",
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
          msg: error,
        })
      );
    }
  };

  return (
    <Select
      // defaultValue={selectedPermission}
      value={selectedValue}
      input={<BootstrapInput />}
      onChange={handleChange}
      sx={{
        width: 200,
      }}
    >
      {permissionOptions.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          // onClick={permissionChange}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectPermission;
