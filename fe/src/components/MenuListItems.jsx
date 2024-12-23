import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import StoreIcon from "@mui/icons-material/Store";
import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ADMIN_URL = process.env.REACT_APP_API_ADMIN_URL;

const icons = [
  {
    icon: <DashboardIcon />,
    title: "Dashboard",
    url: "/stock/",
  },
  {
    title: "Purchase",
    icon: <ShoppingCartIcon />,
    url: "/stock/purchases/",
  },
  {
    title: "Sales",
    icon: <AttachMoneyIcon />,
    url: "/stock/sales/",
  },
  {
    title: "Firms",
    icon: <StoreIcon />,
    url: "/stock/firms/",
  },
  {
    title: "Brands",
    icon: <StarsIcon />,
    url: "/stock/brands/",
  },
  {
    title: "Products",
    icon: <InventoryIcon />,
    url: "/stock/products/",
  },
  {
    title: "Admin Panel",
    icon: <SupervisorAccountIcon />,
    url: ADMIN_URL,
  },
];

const iconStyle = (url) =>
  url.startsWith("http")
    ? {
        color: "#fff",
        "&:hover": { color: "grey" },
        "& .MuiSvgIcon-root": { color: "#fff" },
        "&:hover .MuiSvgIcon-root": { color: "grey" },
      }
    : {
        color: "#fff",
        "&:hover": { color: "#fa5a5a" },
        "& .MuiSvgIcon-root": { color: "#fff" },
        "&:hover .MuiSvgIcon-root": { color: "#fa5a5a" },
      };

const MenuListItems = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div>
      <List>
        {icons.map(({ title, icon, url }, index) => (
          <ListItem key={index} disablePadding>
            {url.startsWith("http") && (
              <ListItemButton
                to={url}
                sx={iconStyle(url)}
                component={Link}
                disabled={!isAdmin ? true : false}
              >
                <ListItemIcon>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  {icon}
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItemButton>
            )}
            {!url.startsWith("http") && (
              <ListItemButton
                onClick={() => {
                  navigate(url);
                }}
                sx={iconStyle(url)}
              >
                <ListItemIcon>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  {icon}
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default MenuListItems;
