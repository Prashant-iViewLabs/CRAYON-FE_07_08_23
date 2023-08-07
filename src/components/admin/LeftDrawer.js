import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { ADMIN_LFET_PANEL } from "../../utils/Constants";
import { styled } from "@mui/material/styles";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useNavigate, useLocation } from "react-router-dom";

const StyledList = styled(List)(({ theme }) => ({
  "& .MuiButtonBase-root": {
    paddingLeft: "8px",
    "& .MuiListItemIcon-root": {
      minWidth: "35px",
    },
    ".menuItems": {
      marginRight: "24px",
      "& span": {
        fontSize: "20px",
        fontWeight: 500,
      },
      "& p": {
        fontSize: "16px",
        fontWeight: 400,
        color: theme.palette.black,
      },
    },
    "& .MuiTypography-root": {},
  },
  "& .MuiCollapse-root": {
    marginLeft: "64px",
    "& .MuiButtonBase-root": {
      padding: 0,
      ":hover": {
        background: "none",
      },
      "& .MuiListItemText-root": {
        margin: 0,
        "& .MuiTypography-root": {
          // fontSize: '14px',
          // ':hover': {
          //     fontWeight: 'bold'
          // },
          // ':active': {
          //     fontWeight: 'bold'
          // }
        },
      },
    },
  },
}));

export default function LeftDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  let { pathname } = useLocation();

  const [open, setOpen] = useState(
    ADMIN_LFET_PANEL.map((item, index) => (index == 0 ? true : false))
  );
  const [subMenuIndex, setSubMenuIndex] = useState(0);

  const handleClick = (event, parentPath, childPath, menuIndex) => {
    event.stopPropagation();
    const newOpen = open.map((item, index) => {
      if (index == menuIndex) {
        return !item;
      }
      return false;
    });
    setOpen(newOpen);
    setSubMenuIndex(0);
    navigate(`${parentPath}/${childPath}`, { replace: true });
  };
  const handleSubMenuClick = (event, parentPath, childPath, subIndex) => {
    setSubMenuIndex(subIndex);
    navigate(`${parentPath}/${childPath}`, { replace: false });
  };

  const renderIcon = ({ icon, color }) => {
    switch (icon) {
      case "CreditCardIcon":
        return <CreditCardIcon color={color} />;
      case "PermIdentityIcon":
        return <PermIdentityIcon color={color} />;
      case "NotificationsActiveOutlinedIcon":
        return <NotificationsActiveOutlinedIcon color={color} />;
      case "LanguageIcon":
        return <LanguageIcon color={color} />;
      case "ChatBubbleOutlineIcon":
        return <ChatBubbleOutlineIcon color={color} />;
      case "ShowChartIcon":
        return <ShowChartIcon color={color} />;
      default:
        return <CreditCardIcon color={color} />;
    }
  };

  return (
    <StyledList
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {ADMIN_LFET_PANEL.map((item, index) => (
        <div key={index}>
          <ListItemButton
            onClick={(event) =>
              handleClick(event, item.path, item.menuItems[0].path, index)
            }
            sx={{
              background: open[index] ? theme.palette.hoverBlue : "none",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              mb: 1,
            }}
          >
            <ListItemIcon>{renderIcon(item)}</ListItemIcon>
            <ListItemText
              primary={item.title}
              secondary={item.subTitle}
              className="menuItems"
            />
            {open[index] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={open[index]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.menuItems.map((subMenuItem, subIndex) => (
                <ListItemButton
                  key={subIndex}
                  onClick={(event) =>
                    handleSubMenuClick(
                      event,
                      item.path,
                      subMenuItem.path,
                      subIndex
                    )
                  }
                >
                  <ListItemText
                    primary={subMenuItem.label}
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: subIndex == subMenuIndex ? "bold" : "",
                        fontSize: "14px",
                        ":hover": {
                          fontWeight: "bold",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </div>
      ))}
    </StyledList>
  );
}
