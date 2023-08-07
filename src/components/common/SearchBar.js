import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import locale from "../../i18n/locale";
import PlaceIcon from "@mui/icons-material/Place";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Grid from "@mui/material/Unstable_Grid2";
import { styled, alpha } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import LanguageIcon from "@mui/icons-material/Language";
import ButtonMenu from "./ButtonMenu";
import { useTheme } from "@mui/material/styles";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlert, setLoading } from "../../redux/configSlice";
import { getApi } from "../../utils/Apis";
import { useDispatch } from "react-redux";
import { ALERT_TYPE } from "../../utils/Constants";
import { useEffect } from "react";
const StyledBox = styled(Box)(({ theme }) => ({
  height: 40,
  border: `solid ${theme.palette.redButton.main} 1px`,
  borderRadius: 25,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
const RedSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.redButton.main,
    "&:hover": {
      backgroundColor: alpha(
        theme.palette.redButton.main,
        theme.palette.action.hoverOpacity
      ),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.redButton.main,
  },
}));
function valuetext(value) {
  return `${value}°C`;
}
export default function SearchBar({
  placeholder,
  setAllJobs,
  setSearchedJobs,
}) {
  const i18n = locale.en;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [searchFilter, setSearchFilter] = useState(false);
  const [value1, setValue1] = useState([20, 37]);
  const [value2, setValue2] = useState([20, 37]);
  const [isOpen, setIsOpen] = useState(null);
  const [jobSearch, setJobSearch] = useState("");
  const handleChange1 = (event, newValue) => {
    setValue1(newValue);
  };
  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  };
  const handleSearchFilter = () => {
    setSearchFilter(!searchFilter);
  };
  const onMenuClick = (isOpen) => {
    setIsOpen(isOpen);
  };
  const handleSearch = (event) => {
    setJobSearch(event.target.value);
  };
  console.log("JOB SEARCH IN SEARCH BAR", jobSearch);
  const getSearchedJobs = createAsyncThunk(
    "getSearchedJobs",
    async (payload, { dispatch }) => {
      dispatch(setLoading(true));
      const { data } = await getApi(
        "/getjobslist/filter?industry_id=&lastKey=&jobtype_id=&jobstage_id=&personalitytype_id=&title=" +
          encodeURIComponent(jobSearch)
      );
      setSearchedJobs(jobSearch);
      dispatch(setLoading(false));
      return data;
    }
  );
  const handleJobSearch = async () => {
    const { payload } = await dispatch(getSearchedJobs());
    console.log("JOBS SEARCH PAYLOAD", payload);
    if (payload?.status == "success") {
      setAllJobs([]);
      setAllJobs((prevState) => [...prevState, ...payload.data]);
    } else {
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: payload?.message,
        })
      );
    }
  };
  // useEffect(() => {
  //   if (jobSearch.length == 0) {
  //     handleJobSearch();
  //     console.log("REMOVED");
  //   }
  // }, [jobSearch]);
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          display: { xs: "none", md: "flex" },
          m: { xs: 2, md: 0 },
          borderRadius: "25px",
          border: "1px solid rgba(224, 224, 224, 0.5)",
          position: "fixed",
          width: {
            xl: isOpen ? "82.4%" : "83.4%",
            lg: isOpen ? "74.2%" : "75.1%",
          },
          zIndex: "1111",
        }}
      >
        <Button
          sx={{
            width: 140,
            height: "auto",
            boxShadow: 0,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            paddingLeft: "40px",
            ".MuiSvgIcon-root": {
              fontSize: "24px !important",
            },
          }}
          onClick={handleSearchFilter}
          variant="contained"
          endIcon={
            searchFilter ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
          }
          color="black100"
        >
          {i18n["searchBar.filters"]}
        </Button>
        {searchFilter ? (
          <Paper
            elevation={0}
            component="form"
            sx={{ display: "flex", alignItems: "center", width: 1, my: 2 }}
          >
            <Grid
              container
              sx={{ width: 1, ml: 0 }}
              spacing={2}
              justifyContent="center"
            >
              <Grid xs={7}>
                <StyledBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ButtonMenu onMenuClick={onMenuClick} />
                  </Box>
                  <Paper
                    elevation={0}
                    component="form"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <InputBase
                      sx={{
                        ml: 1,
                        width: 1,
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                      placeholder={i18n["searchBar.jobTitle"]}
                    />
                  </Paper>
                  <RedSwitch defaultChecked />
                </StyledBox>
              </Grid>
              <Grid xs={5}>
                <StyledBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      color="redButton"
                      aria-label="search job"
                      component="button"
                    >
                      <PlaceIcon />
                    </IconButton>
                  </Box>
                  <Paper
                    elevation={0}
                    component="form"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <InputBase
                      sx={{
                        ml: 1,
                        width: 1,
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                      placeholder={i18n["searchBar.location"]}
                    />
                  </Paper>
                  <RedSwitch defaultChecked />
                </StyledBox>
              </Grid>
              <Grid xs={7}>
                <StyledBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ButtonMenu onMenuClick={onMenuClick} />
                  </Box>
                  <Paper
                    elevation={0}
                    component="form"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <InputBase
                      sx={{
                        ml: 1,
                        width: 1,
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                      placeholder={i18n["searchBar.skills"]}
                    />
                  </Paper>
                  <RedSwitch defaultChecked />
                </StyledBox>
              </Grid>
              <Grid xs={5}>
                <StyledBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      color="redButton"
                      aria-label="search job"
                      component="button"
                    >
                      <LanguageIcon />
                    </IconButton>
                  </Box>
                  <Paper
                    elevation={0}
                    component="form"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <InputBase
                      sx={{
                        ml: 1,
                        width: 1,
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                      placeholder={i18n["searchBar.region"]}
                    />
                  </Paper>
                  <RedSwitch defaultChecked />
                </StyledBox>
              </Grid>
              <Grid xs={12}>
                <StyledBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ButtonMenu onMenuClick={onMenuClick} />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        opacity: 0.4,
                      }}
                    >
                      {i18n["searchBar.experience"]}
                    </Typography>
                  </Box>
                  <Slider
                    getAriaLabel={() => "Temperature range"}
                    value={value1}
                    onChange={handleChange1}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    color="redButton"
                    sx={{
                      width: "60%",
                      marginLeft: "-30px",
                    }}
                  />
                  <RedSwitch defaultChecked />
                </StyledBox>
              </Grid>
              <Grid xs={12}>
                <StyledBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ButtonMenu onMenuClick={onMenuClick} />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        opacity: 0.4,
                      }}
                    >
                      {i18n["searchBar.salary"]}
                    </Typography>
                  </Box>
                  <Slider
                    getAriaLabel={() => "Temperature range"}
                    value={value2}
                    onChange={handleChange2}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    color="redButton"
                    sx={{
                      width: "60%",
                    }}
                  />
                  <RedSwitch defaultChecked />
                </StyledBox>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <>
            <IconButton
              color="black100"
              aria-label="search job"
              component="button"
            >
              <SearchIcon />
            </IconButton>
            <Paper
              elevation={0}
              component="form"
              sx={{ display: "flex", alignItems: "center", width: 1 }}
            >
              <InputBase
                sx={{
                  ml: 1,
                  width: 1,
                  fontSize: "14px",
                  fontWeight: 700,
                }}
                placeholder={placeholder}
                inputProps={{ "aria-label": "search google maps" }}
                value={jobSearch}
                onChange={handleSearch}
              />
            </Paper>
            <IconButton
              color="redButton"
              aria-label="search job"
              component="button"
            >
              <PlaceIcon />
            </IconButton>
          </>
        )}
        <Button
          sx={{
            width: 140,
            boxShadow: 0,
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            height: "auto",
          }}
          variant="contained"
          color="redButton100"
          onClick={handleJobSearch}
        >
          {i18n["searchBar.letsGo"]}
        </Button>
      </Paper>
      <Paper
        elevation={5}
        sx={{ display: { xs: "flex", md: "none" }, m: { xs: 2, md: 0 } }}
      >
        <Paper
          elevation={0}
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            borderRadius: 0,
            width: 1,
          }}
        >
          <InputBase
            sx={{ ml: 1, width: 1, fontSize: "14px", fontWeight: 700 }}
            placeholder={i18n["searchBar.placeholder"]}
            inputProps={{ "aria-label": "search google maps" }}
          />
        </Paper>
        <IconButton
          color="redButton100"
          aria-label="search job"
          component="button"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
}