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
  useMediaQuery
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import CloseIcon from "@mui/icons-material/Close";

import Avatar from "@mui/material/Avatar";
import watchImage from "../assets/watch.webp";

import WatchIcon from "@mui/icons-material/Watch";
import MenuIcon from "@mui/icons-material/Menu";
import Search from "./Search";
import { supabase } from "../services/supabaseClient";


function Sidebar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = React.useState(false);
  return (
    <>
      {isMobile && (
        <Box
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            p: 2,
            position: "sticky",
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 50,
            borderBottom: "1px solid",

          }}
        >
          <Typography variant="h6" component="h1">
            Chrono Codex
          </Typography>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        anchor={isMobile ? "top" : "left"}
      >
        <Box
          display="flex"
          flexDirection={"column"}
          justifyContent="space-between"
          sx={{
            width: isMobile ? "100vw" : theme.sidebar.width,
            height: isMobile ? "auto" : "100vh",
            padding: 2,
            position: "relative",
          }}
        >
          {isMobile && <IconButton
            aria-label="close"
            onClick={() => setOpen(false)} // Fixed to call the onClose function correctly
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>}
          <Box>
            <Avatar sx={{ margin: "auto" }}>
              <WatchIcon />
            </Avatar>
            <Typography variant="h6" align="center">
              Chrono Codex
            </Typography>
            <Search supabase={supabase} />
          </Box>
          <Box>
            <form
              action="https://www.paypal.com/donate"
              method="post"
              target="_top"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <input type="hidden" name="business" value="NYWYJ6V5XP672" />
              <input type="hidden" name="no_recurring" value="1" />
              <input
                type="hidden"
                name="item_name"
                value="Thanks for supporting Chrono Codex! I use this to pay for server costs. Glad you were able to save some money or find a cool watch."
              />
              <input type="hidden" name="currency_code" value="USD" />
              <input
                type="image"
                src={require("../assets/donate.png")}
                border="0"
                name="submit"
                title="PayPal - The safer, easier way to pay online!"
                alt="Donate with PayPal button"
                width="50%"
              />
              <img
                alt=""
                border="0"
                src="https://www.paypal.com/en_US/i/scr/pixel.gif"
                width="1"
                height="1"
              />
            </form>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;

