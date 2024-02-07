import React, { useEffect, useContext, useState } from "react";
import { Grid } from "@mui/material";
import WatchCard from "./WatchCard";
import { SharedDataContext } from "./SharedDataContext";

function WatchGrid({ supabase }) {
  const { filterBrand, filterMinDiameter, filterMaxDiameter, filterSearchTerm } = useContext(SharedDataContext);
  const [watches, setWatches] = useState([]);
  console.log("Start Watch Grid");

  useEffect(() => {
    const fetchWatchesToRender = async () => {
        console.log("entered fetch")
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
      }
    };
    fetchWatchesToRender();
  }, [filterBrand, filterMinDiameter, filterMaxDiameter, filterSearchTerm]); // Re-run this effect if any filter changes

  console.log("Watches fetched:", watches.length);
  return (
    <div className="watch-cards-container">
      <Grid container spacing={4}>
        {watches.map((watch, index) => (
          <Grid item xs={12} sm={6} md={4} key={watch.id || index}>
            <WatchCard watch={watch} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default WatchGrid;
