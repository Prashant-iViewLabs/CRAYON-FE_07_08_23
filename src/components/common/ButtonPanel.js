import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";

export default function ButtonPanel({
  panelData,
  side,
  topMargin = false,
  onChangeFilter = () => {},
}) {
  const theme = useTheme();
  const [selectedBtns, setSelectedBtn] = useState([panelData[0]?.id]);

  useEffect(() => {
    setSelectedBtn([panelData[0]?.id]);
  }, [panelData]);

  const removeBtnSelection = (selectedBtnList, id) => {
    selectedBtnList.splice(
      selectedBtns.findIndex((selectedBtn) => selectedBtn == id),
      1
    );
  };
  const handleButtonClick = (event, { id, name, title }) => {
    if (title == true) {
      if (selectedBtns.find((selectedBtn) => selectedBtn == id)) {
        const selectedBtnList = [...selectedBtns];
        removeBtnSelection(selectedBtnList, id);
        setSelectedBtn(selectedBtnList);
        onChangeFilter(selectedBtnList);
      } else {
        setSelectedBtn([panelData[0]?.id]);
        onChangeFilter([panelData[0]?.id]);
      }
    } else {
      if (selectedBtns.find((selectedBtn) => selectedBtn == id)) {
        const selectedBtnList = [...selectedBtns];
        removeBtnSelection(selectedBtnList, id);
        if (selectedBtnList.length == 0) {
          setSelectedBtn([panelData[0]?.id]);
          onChangeFilter([panelData[0]?.id]);
        } else {
          setSelectedBtn(selectedBtnList);
          onChangeFilter(selectedBtnList);
        }
      } else {
        if (
          selectedBtns.find((selectedBtn) => selectedBtn == panelData[0]?.id)
        ) {
          const selectedBtnList = [...selectedBtns];
          removeBtnSelection(selectedBtnList, id);
          selectedBtnList.push(id);
          setSelectedBtn(selectedBtnList);
          onChangeFilter(selectedBtnList);
        } else {
          setSelectedBtn((prevState) => [...prevState, id]);
          onChangeFilter([...selectedBtns, id]);
        }
      }
    }
  };
  return (
    // <Grid xs >
    <Box
      sx={{
        // mt: { sx: 0, sm: topMargin ? '68px' : '16px' },
        textAlign: side == "right" && "end",
        display: { xs: "none", sm: "flex" },
        flexDirection: "column",
        overflow: { xs: "auto", sm: "hidden" },
      }}
    >
      {panelData?.map((btn) => (
        <Tooltip title={btn.name} placement="top-end">
          <Button
            sx={{
              mb: 1,
              padding: "6px 7px",
              width: 130,
              lineHeight: "inherit",
              borderRadius: "5px",
              borderBottomLeftRadius: side == "left" ? { sm: 0 } : "5px",
              borderTopLeftRadius: side == "left" ? { sm: 0 } : "5px",
              borderTopRightRadius: side == "right" ? { sm: 0 } : "5px",
              borderBottomRightRadius: side == "right" ? { sm: 0 } : "5px",
              mr: { xs: 1, sm: 0 },
              minWidth: { xs: "90px", sm: 0 },
              fontWeight:
                btn.title || selectedBtns.includes(btn.id) ? 900 : 400,
              "&:hover": {
                boxShadow: 15,
                // opacity: 1,
                backgroundColor: theme.palette[btn.color]?.main,
                color: theme.palette.white,
                fontWeight: 900,
              },
              // opacity: selectedBtns.includes(btn.id) ? 1 : 0.5
            }}
            onClick={(e) => handleButtonClick(e, btn)}
            disableElevation
            variant="contained"
            color={selectedBtns.includes(btn.id) ? btn.color : "base"}
            key={btn.id}
          >
            {btn?.name.length <= 14 ? btn.name : btn?.name?.slice(0, 15)}
          </Button>
        </Tooltip>
      ))}
    </Box>
    // </Grid>
  );
}
