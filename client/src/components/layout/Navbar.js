import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Switch,
  Tooltip,
  useTheme as useMuiTheme,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  ExitToApp,
  Add as AddIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount, getNotifications } = useNotifications();
  const { darkMode, toggleDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user, getNotifications]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          Find<span style={{ color: "#ff9800" }}>Me</span>
        </Typography>

        {/* Dark Mode Toggle */}
        <Tooltip
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <LightModeIcon
              sx={{ color: darkMode ? "gray" : "inherit", mr: 0.5 }}
            />
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              color="default"
              size="small"
            />
            <DarkModeIcon
              sx={{ color: darkMode ? "inherit" : "gray", ml: 0.5 }}
            />
          </Box>
        </Tooltip>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              color="inherit"
              component={Link}
              to="/report-item"
              startIcon={<AddIcon />}
              sx={{ mr: 2 }}
            >
              Report Item
            </Button>

            <IconButton
              color="inherit"
              component={Link}
              to="/notifications"
              aria-label="notifications"
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleMenu}
              color="inherit"
              aria-label="account menu"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                {user.firstName ? user.firstName.charAt(0) : <AccountCircle />}
              </Avatar>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>
                <AccountCircle fontSize="small" sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
