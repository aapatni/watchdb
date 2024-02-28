import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Drawer,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

import Avatar from "@mui/material/Avatar";
import watchImage from "../assets/watch.webp";

import WatchIcon from "@mui/icons-material/Watch";
import Search from "./Search";
import { supabase } from "../services/supabaseClient";


function Sidebar() {
    const theme = useTheme();

  return (
    <Drawer variant="permanent" open={true}>
      <Box sx={{ width: theme.sidebar.width , padding: 2 }}>
        <Avatar sx={{ margin: "auto" }}>
          <WatchIcon />
        </Avatar>
        <Typography variant="h6" align="center">Chrono Codex</Typography>
        <Search supabase={supabase}/>

      </Box>
    </Drawer>
  );
}

export default Sidebar;
