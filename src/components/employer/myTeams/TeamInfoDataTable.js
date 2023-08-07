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
import { styled, alpha } from "@mui/material/styles";
import CustomDialog from "../../common/CustomDialog";
import NameInfo from "./NameInfo";
import SelectPermission from "./SelectPermission";

import EditIcon from "@mui/icons-material/Edit";
import RoundCrossSign from "../../../assets/roundCrossSign.png";
import CircleIcon from "@mui/icons-material/Circle";
import { useDispatch } from "react-redux";
import { dateConverterMonth } from "../../../utils/DateTime";
import { assignJobs, removeMembersJobs } from "../../../redux/employer/myTeams";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE } from "../../../utils/Constants";
import { useParams } from "react-router-dom";

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
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Job title name",
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
    label: "Edit",
  },
];

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
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { id } = useParams();
  // const [openDelete, setOpenDelete] = useState(false);
  // const [rows, setRows] = useState([]);

  const dispatch = useDispatch();

  const handleOpenDelete = () => {
    setOpenDelete((prevState) => !prevState);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.job_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const handleJobAccess = async (event, job_id) => {
    try {
      const data = {
        userid: id,
        jobid: job_id,
        flag: event.target.checked,
      };
      // console.log(user_id, jobId);
      const { payload } = await dispatch(assignJobs(data));
      if (payload.status === "success") {
        console.log(payload);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Job access removed successfully",
          })
        );
      } else {
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: payload?.error,
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  const handleDeleteMember = async () => {
    try {
      const data = {
        jobids: selected,
      };
      const { payload } = await dispatch(removeMembersJobs(data));
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
            {console.log(rows)}
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.job_id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.job_id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.job_id}
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
                      {/*<NameInfo
                        name={row.title}
                        email={row.email}
                        user_id={row.user_id}
                      />*/}
                      {row.title}
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
                      <Button
                        variant="contained"
                        color="grayButton200"
                        sx={{
                          borderRadius: "8px",
                          width: "200px",
                          height: 1,
                          justifyContent: "start !important",
                        }}
                        // onClick={handleAddNewMemberClick}
                      >
                        {row.permissions}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                        }}
                      >
                        {console.log(row.assigned)}
                        {row.assigned ? (
                          <BlueSwitch
                            defaultChecked={row.assigned}
                            onChange={(event) =>
                              handleJobAccess(event, row.job_id)
                            }
                          />
                        ) : (
                          <DeleteIcon
                            color="blueButton700"
                            onClick={handleOpenDelete}
                          />
                        )}
                      </Box>
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
