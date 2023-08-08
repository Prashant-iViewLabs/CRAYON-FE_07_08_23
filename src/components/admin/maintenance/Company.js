import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import {
  approveCompany,
  getAllCompanies,
} from "../../../redux/admin/jobsSlice";
import { dateConverterMonth } from "../../../utils/DateTime";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE } from "../../../utils/Constants";

export default function Company() {
  const dispatch = useDispatch();
  const [lastKey, setLastKey] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [companyCount, setCompanyCount] = useState(0);

  const getCompanies = async (lastkeyy) => {
    try {
      const { payload } = await dispatch(
        getAllCompanies({ lastKey: lastkeyy })
      );
      if (payload.status === "success") {
        console.log(payload);
        setCompanyCount(payload.count);
        setLastKey(payload.pageNumber + 1);
        setTableData((prevState) => [...prevState, ...payload.data]);
      }
    } catch (error) {}
  };

  const getCompanyApproved = async (event, companyId) => {
    console.log(event.target.checked, companyId);
    try {
      const data = {
        company_id: companyId,
        flag: event.target.checked ? 1 : 0,
      };
      const { payload } = await dispatch(approveCompany(data));
      if (payload.status === "success") {
        console.log(payload);
        dispatch(
          setAlert({
            show: true,
            type: ALERT_TYPE.SUCCESS,
            msg: "Company Approved Successfully",
          })
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCompanies(0);
  }, []);

  return (
    <Box sx={{ ml: 6 }}>
      <Typography
        sx={{
          fontSize: "36px",
          fontWeight: 700,
          // ml: 6
        }}
      >
        Company ({companyCount})
      </Typography>

      <Grid
        container
        spacing={2}
        flexDirection={"column"}
        sx={{
          display: { xs: "none", md: "flex" },
          marginTop: "30px",
        }}
      >
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={tableData.length}
          next={() => getCompanies(lastKey)}
          hasMore={true}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <Box
            sx={{
              mt: 2,
            }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Owner
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Status
                      </Typography>
                    </TableCell>
                    {/*<TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Followers
                      </Typography>
                    </TableCell>*/}
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Created At
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Action
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow
                      key={row.id}
                      style={{
                        "& .css-12zgwp-MuiTableCell-root": {
                          padding: "0 16px !important",
                        },
                      }}
                    >
                      <TableCell>{row?.name}</TableCell>
                      <TableCell>
                        {`${row?.user?.first_name} ${row?.user?.last_name}`}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          defaultChecked={row.enabled}
                          onChange={(event) =>
                            getCompanyApproved(event, row.company_id)
                          }
                        />
                      </TableCell>
                      {/*<TableCell >
                        {row.followers}
                      </TableCell>*/}
                      <TableCell>
                        {dateConverterMonth(row.created_at)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="edit"
                          color="blueButton400"
                          sx={{
                            padding: "0 !important",
                            minWidth: "18px !important",
                            "& .MuiSvgIcon-root": {
                              width: "18px",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </InfiniteScroll>
      </Grid>
    </Box>
  );
}
