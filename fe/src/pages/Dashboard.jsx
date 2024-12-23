import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuListItems from "../components/MenuListItems";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useAuthCall from "../hooks/useAuthCall";
import { Outlet } from "react-router-dom";
import { blueGrey } from "@mui/material/colors";
import ThemeToggle from "../components/Theme/ThemeToggle";
import { Helmet } from "react-helmet";

const drawerWidth = 240;

function Dashboard(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { currentUser } = useSelector((state) => state.auth);

  const { logout } = useAuthCall();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <MenuListItems />
      {/* <Divider /> */}
      {/* <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </div>
  );

  const brandSpanStyle = makeStyles({
    root: {
      color: "aqua",
    },
  });

  const brandSpanClasses = brandSpanStyle();

  const container =
    window !== undefined ? () => window().document.body : undefined;

  // + Material-UI (MUI) CSS Baseline, modern bir tarayıcıda daha tutarlı ve düzenli bir stil sağlamak için tasarlanmış bir sıfırlama style component'idir. Çeşitli tarayıcılar ve işletim sistemleri arasında stil ve görünümdeki farklılıkları gidermek için HTML elemanlarının başlangıç stilini sıfırlar ve uyumlu bir temel sağlar. Boyutlar, yazı tipi stilleri, aralıklar ve diğer özellikler gibi bazı varsayılan tarayici stillerini sifirlamayi saglar. Bu şekilde, projedeki tüm component'lar ve layout'lar, daha tutarlı ve düzenli bir temel üzerine inşa edilir, böylece geliştirme süreci daha verimli ve düzenli olur.

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Cool<span className={brandSpanClasses.root}>Stock</span>
          </Typography>
          <ThemeToggle />
          {currentUser && (
            <Button
              color="inherit"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        {/* Toggled Drawer on XS */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: blueGrey[900],
              color: "#fff",
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Fixed Drawer on SM */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: blueGrey[900],
              color: "#fff",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {/* <Typography paragraph>
          Lorem ipsum dolor sit amet.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit.
        </Typography> */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
