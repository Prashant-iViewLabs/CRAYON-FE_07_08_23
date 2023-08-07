import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CustomDialog from "../../common/CustomDialog";
import NameInfo from "./NameInfo";
import SelectPermission from "./SelectPermission";
import EditIcon from "@mui/icons-material/Edit";
import RoundCrossSign from "../../../assets/roundCrossSign.png";
import CircleIcon from "@mui/icons-material/Circle";
import { useDispatch } from "react-redux";
import { dateConverterMonth } from "../../../utils/DateTime";
import {
  editUserPassword,
  removeMember,
} from "../../../redux/employer/myTeams";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE } from "../../../utils/Constants";
import { IconButton, InputBase, Popover } from "@mui/material";
import { useTheme } from "@emotion/react";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "dateAdded",
    numeric: true,
    disablePadding: false,
    label: "Date Added",
  },
  {
    id: "lastActive",
    numeric: true,
    disablePadding: false,
    label: "Last Active",
  },
  {
    id: "permission",
    numeric: true,
    disablePadding: false,
    label: "Permissions",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all rows",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function TeamsDataTable({
  rows,
  openDelete,
  setOpenDelete,
  setDeleted,
}) {
  const theme = useTheme();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [newPassword, setNewPassword] = useState("");

  const dispatch = useDispatch();

  const handleOpenDelete = () => {
    setOpenDelete((prevState) => !prevState);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDeleteMember = async () => {
    try {
      const data = {
        userids: selected,
      };
      const { payload } = await dispatch(removeMember(data));
      if (payload.status === "success") {
        setOpenDelete(false);
        setDeleted(payload.data);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Member removed",
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, userID) => {
    const selectedIndex = selected.indexOf(userID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, userID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (event) => {
    setOpenInfoDialog(true);
    !openInfoDialog && setAnchorEl(event.target);
  };

  const onHandleClose = () => {
    setOpenInfoDialog(false);
    setAnchorEl(null);
  };

  const handleShowPassword = () => {
    if (showPassword) setInputType("password");
    else setInputType("text");

    setShowPassword(!showPassword);
  };

  const handleChangePassword = async () => {
    try {
      const data = {
        userid: selected,
        password: newPassword,
      };
      console.log(data);
      const { payload } = await dispatch(editUserPassword(data));
      if (payload.status === "success") {
        console.log(payload);
        setOpenInfoDialog(false);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Password changed successfully",
          })
        );
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: payload.message,
          })
        );
      }
    } catch (error) {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.SUCCESS,
          msg: error,
        })
      );
    }
  };

  const isSelected = (user_id) => selected.indexOf(user_id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // const visibleRows = useMemo(
  //   () =>
  //     stableSort(rows, getComparator(order, orderBy)).slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage
  //     ),
  //   [order, orderBy, page, rowsPerPage, rows]
  // );

  const visibleRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            {console.log(visibleRows)}
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.user_id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.user_id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      width={"20%"}
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <NameInfo
                        name={row.name}
                        email={row.email}
                        user_id={row.user_id}
                      />
                    </TableCell>

                    <TableCell>
                      <div>
                        {row.status === "Active" ? (
                          // <ActiveChip label="Active"/>
                          <Button
                            startIcon={<CircleIcon />}
                            size="small"
                            variant="outlined"
                            sx={{
                              padding: "0 8px 0 5px",
                              color: "green",
                              borderRadius: "8px",
                              border: "1px solid #009700",
                              height: 1,
                              fontSize: "14px",
                              fontWeight: "bold",
                              background: "#defbde",
                            }}
                          >
                            Active{" "}
                          </Button>
                        ) : (
                          <Button
                            startIcon={
                              <CircleIcon
                                sx={{
                                  fontSize: "small",
                                }}
                              />
                            }
                            size="small"
                            variant="contained"
                            color="grayButton200"
                            sx={{
                              padding: "0 5px",
                              color: "gray",
                              borderRadius: "8px",
                              height: 1,
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            Offline
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{dateConverterMonth(row.dateAdded)}</TableCell>
                    <TableCell>{dateConverterMonth(row.lastActive)}</TableCell>
                    <TableCell>
                      <SelectPermission
                        selectedPermission={row.permissions}
                        user_id={row.user_id}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                        }}
                      >
                        {row.permissions !== "Super Admin" ? (
                          <DeleteIcon
                            color="primary"
                            onClick={handleOpenDelete}
                          />
                        ) : null}
                        {/*<smallButton>
                          <Box>
                            <img
                              src={RoundCrossSign}
                              alt="crossSign"
                              height={25}
                            />
                          </Box>
                        </smallButton>*/}

                        <EditIcon color="redButton100" onClick={handleEdit} />
                      </Box>
                      <Popover
                        id="dropdown-menu"
                        open={openInfoDialog}
                        anchorEl={anchorEl}
                        onClose={onHandleClose}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        sx={{
                          width: "100% !important",
                          "& .css-ll95b0-MuiPaper-root-MuiPopover-paper": {
                            padding: "16px !important",
                          },
                        }}
                      >
                        <Box sx={{ mt: 3 }}>
                          <Paper
                            sx={{
                              display: "flex",
                              height: "40px",
                              borderRadius: "25px",
                              boxShadow: "none",
                              border: `1px solid ${theme.palette.grayBorder}`,
                            }}
                          >
                            <InputBase
                              sx={{ ml: 2, mr: 2, width: "100%" }}
                              id="password"
                              type={inputType}
                              placeholder="Change password"
                              onChange={(event) =>
                                setNewPassword(event.target.value)
                              }
                            />
                            <IconButton
                              sx={{ py: 0 }}
                              color=""
                              aria-label="reset password"
                              component="button"
                              onClick={handleShowPassword}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </Paper>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 0,
                          }}
                        >
                          <Button
                            sx={{
                              width: 150,
                              mt: 3,
                            }}
                            variant="contained"
                            color="redButton"
                            onClick={handleChangePassword}
                          >
                            Confirm
                          </Button>
                        </Box>
                      </Popover>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: emptyRows,
                  }}
                >
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {console.log(rowsPerPage, page)}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <CustomDialog
        show={openDelete}
        hideButton={false}
        dialogWidth="xs"
        showFooter={false}
        onDialogClose={handleOpenDelete}
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
            Sure you want to delete?
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={"bold"}
            textAlign={"center"}
            paragraph
          >
            Please confirm that you want to delete the selected user
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>Click to confirm</Typography>
            <Switch />
          </Box>
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
            onClick={handleOpenDelete}
          >
            cancel
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
            onClick={handleDeleteMember}
          >
            continue
          </Button>
        </Box>
      </CustomDialog>
    </Box>
  );
}
