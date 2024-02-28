import React, { useEffect, useContext, useState } from "react";
import { Grid, Box } from "@mui/material";
import WatchCard from "./WatchCard";
import { SharedDataContext } from "../services/SharedDataContext";

function WatchGrid({ supabase }) {
  const {
    filterBrand,
    filterMinDiameter,
    filterMaxDiameter,
    filterSearchTerm,
  } = useContext(SharedDataContext);

  const [watches, setWatches] = useState([]);

  useEffect(() => {
    const fetchWatchesToRender = async () => {
      console.log("entered fetch");
      let { data, error } = await supabase.rpc("get_filtered_watches", {
        p_brand: filterBrand,
        p_min_diameter: filterMinDiameter,
        p_max_diameter: filterMaxDiameter,
        p_search_query: filterSearchTerm,
      });
      if (error) {
        console.error("Error fetching watches:", error);
      } else {
        console.log("Fetched watches count:", data.length);
        setWatches(data);
        console.log(data)
      }
    };
    fetchWatchesToRender();
    console.log("Watches fetched:", watches.length);
    console.log(watches)
  }, [filterBrand, filterMinDiameter, filterMaxDiameter, filterSearchTerm]);
  
  return (
    <Box className="watch-cards-container" sx={{ p: 2 }}>
      <Grid container spacing={4}>
        {watches.map((watch, index) => (
          <Grid item xs={12} sm={6} md={4} key={watch.id || index}>
            <WatchCard watch={watch} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default WatchGrid;