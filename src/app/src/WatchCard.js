import React, { useState,useEffect, useCallback } from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import WatchDetailsModal from "./WatchDetailsModal";

function WatchCard({ watch, onClick }) {
  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle card click
  const handleCardClick = () => {
    setIsModalOpen(true); // Open the modal
    // if(onClick) onClick(); // Call the onClick prop if provided
  };

  // Function to handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleModalClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleModalClose]);

  return (
    <Card className="watch-card" onClick={handleCardClick}>
      <CardMedia
        component="img"
        height="140"
        image={watch["Photo URL"]}
        alt={watch.Model}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {watch.Brand} {watch.Model}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference Number: {watch["Reference Number"]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${watch.Price}
        </Typography>
      </CardContent>
      {isModalOpen && (
        <WatchDetailsModal
          watch={watch}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {/* Placeholder for future actions like heart icon or view button */}
    </Card>
  );
}

export default WatchCard;
