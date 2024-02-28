import React from 'react';
import { supabase } from "../services/supabaseClient";
import WatchGrid from "../components/WatchGrid";
import { useTheme } from '@mui/material/styles';

function Home() {
    const theme = useTheme();
  return (
    <div style={{ marginLeft: theme.sidebar.width, backgroundColor: theme.palette.background.default }}>
        <WatchGrid supabase={supabase} />
    </div>
  );
}

export default Home;
