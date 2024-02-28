import React from "react";
import { supabase } from "../services/supabaseClient";
import WatchGrid from "../components/WatchGrid";
import { useTheme } from "@mui/material/styles";
import {useMediaQuery} from "@mui/material";

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div
      style={{
        marginLeft: isMobile ?0 : theme.sidebar.width,
        backgroundColor: "theme.palette.background.default",
      }}
    >
      <WatchGrid supabase={supabase} />
    </div>
  );
}

export default Home;
