import React, { useEffect, useContext, useState, useCallback } from "react";
import { Grid, Box } from "@mui/material";
import WatchCard from "./WatchCard";
import { SharedDataContext } from "../services/SharedDataContext";
import WatchDetailsModal from "./WatchDetailsModal";

function WatchGrid({ supabase }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState(null);

  const handleOpenModal = useCallback((watch) => {
    console.log("opening shit")
    setModalOpen(true);
    setSelectedWatch(watch);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log("closing shit")

    setModalOpen(false);
    setSelectedWatch(null);
  }, []);

  const {
    filterBrand,
    filterMinDiameter,
    filterMaxDiameter,
    filterSearchTerm,
    filterMinPrice,
    filterMaxPrice
  } = useContext(SharedDataContext);

  const [watches, setWatches] = useState([]);

  useEffect(() => {
    const fetchWatchesToRender = async () => {
      console.log("entered fetch");
      let { data, error } = await supabase.rpc("get_filtered_watches", {
        p_brand: filterBrand,
        p_min_diameter: filterMinDiameter,
        p_max_diameter: filterMaxDiameter,
        p_min_price: filterMinPrice,
        p_max_price: filterMaxPrice,
        p_search_query: filterSearchTerm,
      });
      if (error) {
        console.error("Error fetching watches:", error);
      } else {
        console.log("Fetched watches count:", data.length);
        setWatches(data);
        console.log(data);
      }
    };
    fetchWatchesToRender();
    console.log("Watches fetched:", watches.length);
    console.log(watches);
  }, [filterBrand, filterMinDiameter, filterMaxDiameter, filterSearchTerm, filterMinPrice, filterMaxPrice]);

  return (
    <Box className="watch-cards-container" sx={{ p: 2 }}>
      <Grid container spacing={6}>
        {watches.map((watch, index) => (
          <Grid item xs={12} sm={4} md={3} key={watch.id || index}>
            <WatchCard watch={watch} onClick={handleOpenModal} />
          </Grid>
        ))}
      </Grid>
      {modalOpen && (
        <WatchDetailsModal watch={selectedWatch} onClose={handleCloseModal} />
      )}
    </Box>
  );
}

export default WatchGrid;
