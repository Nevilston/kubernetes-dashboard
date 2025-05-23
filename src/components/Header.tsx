import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Menu, MenuItem, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    // Add your logout logic here
    console.log("Logged out");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "#2E2E2E",
        color: "#FFFFFF",
        height: "70px",
        display: "flex",
        justifyContent: "center",
        px: 0,
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          px: 2,
        }}
      >
        {/* Left: Logo and Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img src="/LS-logo.svg" alt="Logo" style={{ height: "40px" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                textDecoration: "none",
                color: "#FFFFFF",
                fontSize: "20px",
                ml: 1,
              }}
            >
              Kubernetes Dashboard
            </Typography>
          </Link>
        </Box>

        {/* Center: Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Button 
            onClick={() => navigate("/")} 
            sx={{ color: "#FFFFFF", textTransform: "none", fontWeight: "bold" }}
          >
            Dashboard
          </Button>
          <Button 
            onClick={() => navigate("/pods")} 
            sx={{ color: "#FFFFFF", textTransform: "none", fontWeight: "bold" }}
          >
            Pods
          </Button>
        </Box>

        {/* Right: Profile Avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ bgcolor: "#d32f2f", cursor: "pointer", width: "36px", height: "36px" }}
            onClick={handleMenuOpen}
          >
            L
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
