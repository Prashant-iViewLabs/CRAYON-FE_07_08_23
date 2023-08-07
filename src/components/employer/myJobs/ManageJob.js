import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import {
  changeJobApplicationStatus,
  getTalentJobStatusApplications,
  getTalentJobStatusCount,
} from "../../../redux/employer/myJobsSlice";
import { useDispatch } from "react-redux";
import {
  setAlert,
  setLoading,
} from "../../../redux/employer/employerJobsConfigSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import InfiniteScroll from "react-infinite-scroll-component";
import SortButton from "./SortButton";
import { useParams } from "react-router-dom";
import { Grid, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  TALENT_LEFT_JOB_APPLICATION_BUTTON_GROUP,
  TALENT_RIGHT_JOB_INFO_BUTTON_GROUP,
  TALENT_RIGHT_JOB_ACTIVITY_BUTTON_GROUP,
  JOBS_LEFT_TYPES_BUTTON_GROUP,
} from "../../../utils/Constants";
import ButtonPanel from "../../common/ButtonPanel";

const StyledBox = (props) => {
  const { children, color } = props;
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: 37,
        backgroundColor: theme.palette[color].main,
        borderRadius: "0 0 20px 20px",
        color: theme.palette.white,
        justifyContent: "space-between",
        display: "flex",
        alignItems: "center",
        fontWeight: 500,
        cursor: "pointer",
        padding: "0 20px",
      }}
    >
      {children}
    </Box>
  );
};
export const data = [
  {
    id: "1",
    Task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent.",
    Due_Date: "25-May-2020",
  },
  {
    id: "2",
    Task: "Fix Styling",
    Due_Date: "26-May-2020",
  },
  {
    id: "3",
    Task: "Handle Door Specs",
    Due_Date: "27-May-2020",
  },
  {
    id: "4",
    Task: "morbi",
    Due_Date: "23-Aug-2020",
  },
  {
    id: "5",
    Task: "proin",
    Due_Date: "05-Jan-2021",
  },
];

export const columnsFromBackend = {
  23223: {
    title: "matched",
    items: data,
    color: "orangeButton",
  },
  24312: {
    title: "applications",
    items: [],
    color: "yellowButton100",
  },
  33123: {
    title: "considering",
    items: [],
    color: "blueButton400",
  },
  34123: {
    title: "shortlist",
    items: [],
    color: "blueButton100",
  },
  35223: {
    title: "interview",
    items: [],
    color: "purpleButton200",
  },
  36312: {
    title: "assessment",
    items: [],
    color: "brownButton",
  },
  37123: {
    title: "hired",
    items: [],
    color: "lightGreenButton100",
  },
  38123: {
    title: "rejected",
    items: [],
    color: "redButton",
  },
};

export default function ManageJob() {
  const dispatch = useDispatch();
  // const [isSort, setIsSort] = useState(false);
  const [talentStatus, setTalentStatus] = useState([]);
  const { jobId } = useParams();

  const [talents, setTalents] = useState([]);

  const getTalentStatusApplications = async (
    jobId,
    jobStatusId,
    manageStatus
  ) => {
    try {
      const [manage] = await Promise.all([
        dispatch(
          getTalentJobStatusApplications({
            job_id: jobId,
            job_status_id: jobStatusId,
          })
        ),
      ]);
      // lastkey += 1;
      setTalents((prevTalents) => {
        const updatedTalents = manageStatus?.map((item) => {
          if (item.id === jobStatusId) {
            return {
              ...item,
              items: manage?.payload?.data,
            };
          } else {
            const existingItem = prevTalents.find(
              (prevItem) => prevItem.id === item.id
            );
            return { ...item, items: existingItem ? existingItem.items : [] };
          }
        });
        return [...updatedTalents];
      });
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: ERROR_MSG,
        })
      );
    }
  };

  const getTalentMyJobStatusCount = async (jobId) => {
    try {
      const [manage] = await Promise.all([
        dispatch(getTalentJobStatusCount({ job_id: jobId })),
      ]);
      setTalentStatus(manage.payload.data);
      manage.payload.data.map((item) => {
        item.count > 0
          ? getTalentStatusApplications(jobId, item.id, manage.payload.data)
          : setTalents((prevTalents) => {
              const updatedTalents = manage.payload.data?.map((item) => {
                const existingItem = prevTalents.find(
                  (prevItem) => prevItem.id === item.id
                );
                return {
                  ...item,
                  items: existingItem ? existingItem.items : [],
                };
              });
              return [...updatedTalents];
            });
      });
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: ERROR_MSG,
        })
      );
    }
  };

  const handleMoveJobApplicationStatus = async (
    jobId,
    destinationColumn,
    draggableColumn
  ) => {
    try {
      const [manage] = await Promise.all([
        dispatch(
          changeJobApplicationStatus({
            job_id: jobId,
            job_status_id: destinationColumn?.id,
            candidateuser_id: draggableColumn?.user_id,
          })
        ),
      ]);
      if (manage?.payload?.data?.at(0) == 1) {
      }
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(
        setAlert({
          show: true,
          type: ALERT_TYPE.ERROR,
          msg: ERROR_MSG,
        })
      );
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId != destination.droppableId) {
      const sourceColumn = talents?.find(
        (item) => item?.id == source?.droppableId
      );
      const destinationColumn = talents?.find(
        (item) => item?.id == destination?.droppableId
      );
      const draggableColumn = talents
        ?.find((item) => item?.id == source?.droppableId)
        ?.items?.find((item) => item?.user_id == draggableId);
      setTalents(
        talents?.map((talent) => {
          if (talent?.id == sourceColumn?.id) {
            return {
              ...talent,
              items: talent?.items?.filter(
                (item) => item?.user_id != draggableColumn?.user_id
              ),
              count: talent?.count - 1,
            };
          }
          if (talent?.id == destinationColumn?.id) {
            return {
              ...talent,
              items: [...talent?.items, draggableColumn],
              count: talent?.count + 1,
            };
          }
          return talent;
        })
      );
      handleMoveJobApplicationStatus(jobId, destinationColumn, draggableColumn);
    }
  };

  const renderColor = (column) => {
    switch (column?.status) {
      case "matched":
        return "orangeButton";
      case "considering":
        return "blueButton400";
      case "shortlist":
        return "blueButton100";
      case "interview":
        return "purpleButton200";
      case "assessment":
        return "brownButton";
      case "hired":
        return "lightGreenButton100";
      case "rejected":
        return "redButton";
      case "review":
        return "yellowButton100";
      default:
        return "orangeButton";
    }
  };

  useEffect(() => {
    getTalentMyJobStatusCount(jobId);
  }, []);

  const handleSortedValue = (columnName, value) => {
    console.log(columnName, value);
    setTalents((prevTalents) => {
      const updatedTalents = talentStatus?.map((item) => {
        if (item.id === columnName) {
          return {
            ...item,
            items: value,
          };
        } else {
          const existingItem = prevTalents.find(
            (prevItem) => prevItem.id === item.id
          );
          return { ...item, items: existingItem ? existingItem.items : [] };
        }
      });
      console.log(updatedTalents);
      return [...updatedTalents];
    });
  };

  return (
    <Grid
      container
      spacing={0}
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      minHeight={"80vh"}
    >
      <ButtonPanel
        panelData={TALENT_LEFT_JOB_APPLICATION_BUTTON_GROUP}
        side="left"
        // onChangeFilter={jobsFilterLeft}
      />
      <Grid
        Grid
        xs={12}
        sm={6}
        md={8}
        lg={9}
        xl={10}
        sx={{
          overflowX: "scroll",
        }}
      >
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          {/*
        <Box sx={{ display: "flex", position: "sticky", left: "0" }}>
        <Typography sx={{ margin: "8px", padding: "20px" }}>Filter</Typography>
        <Box
          sx={{
            backgroundColor: theme.palette.base.main,
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
            width: "100%",
            height: "90px",
            borderRadius: "25px",
          }}
        >
          <Box>
            <Box
              sx={{
                mr: 1,
                width: "43px",
                height: "43px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
              }}
            >
              <Box
                component="img"
                className="dragDots"
                alt="drag dots"
                src={salary}
                sx={{
                  width: "43px",
                  height: "43px",
                  cursor: "pointer",
                }}
              />
            </Box>
            <Typography>Salary</Typography>
          </Box>
        </Box>
      </Box>
      */}

          {/*
      <Tooltip arrow title={job?.title} placement="top">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
          }}
          gutterBottom
        >
          {job?.title?.slice(0, 30)}
        </Typography>
      </Tooltip>
      */}
          <Box sx={{ display: "flex", maxHeight: "100%" }}>
            {Object.entries(talents).map(([columnId, column], index) => {
              return (
                <Droppable key={`${column?.id}`} droppableId={`${column?.id}`}>
                  {(provided) => (
                    <Box
                      xs={3}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        flex: "1 1 0px",
                        margin: "8px",
                        minWidth: "300px",
                      }}
                    >
                      <StyledBox
                        color={renderColor(column)}
                        column={column}
                        jobId={jobId}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {column?.status} ({column?.count})
                        </Box>
                        <SortButton
                          jobId={jobId}
                          jobStatusId={column?.id}
                          handleSortedValue={handleSortedValue}
                        />
                      </StyledBox>
                      <Box id="talentList" sx={{ height: "100%" }}>
                        <InfiniteScroll
                          style={{
                            height: "100%",
                            overflowX: "hidden",
                            scrollbarWidth: "thin",
                          }}
                          key={column?.id}
                          dataLength={talents[index]?.items?.length}
                          next={() => console.log("HIHIHIHI")}
                          hasMore={true}
                          scrollableTarget="talentList"
                          endMessage={
                            <p style={{ textAlign: "center" }}>
                              <b>Yay! You have seen it all</b>
                            </p>
                          }
                        >
                          {talents[index]?.items?.map((item, index) => (
                            <DraggableCard
                              key={item?.user_id}
                              item={item}
                              index={index}
                              droppableId={column?.id}
                              onDragEnd={onDragEnd}
                              jobId={jobId}
                            />
                          ))}
                          <style>
                            {`.infinite-scroll-component::-webkit-scrollbar {
                            width: 7px !important;
                            background-color: #F5F5F5; /* Set the background color of the scrollbar */
                          }

                          .infinite-scroll-component__outerdiv {
                            height:100%
                          }

                          .infinite-scroll-component::-webkit-scrollbar-thumb {
                            background-color: #888c; /* Set the color of the scrollbar thumb */
                          }`}
                          </style>
                        </InfiniteScroll>
                      </Box>
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              );
            })}
          </Box>
        </DragDropContext>
      </Grid>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ButtonPanel
          panelData={TALENT_RIGHT_JOB_INFO_BUTTON_GROUP}
          side="right"
          // onChangeFilter={jobsFilter}
        />
        <ButtonPanel
          panelData={TALENT_RIGHT_JOB_ACTIVITY_BUTTON_GROUP}
          side="right"
          // onChangeFilter={jobsFilter}
        />
        <ButtonPanel
          panelData={JOBS_LEFT_TYPES_BUTTON_GROUP}
          side="right"
          // onChangeFilter={jobsFilter}
        />
      </Box>
    </Grid>
  );
}
