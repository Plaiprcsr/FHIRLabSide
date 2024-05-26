import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#006600",
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Lab B
        </Typography>
        <Button color="inherit" style={{ marginLeft: "auto" }}>
          Sign in or sign up
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
