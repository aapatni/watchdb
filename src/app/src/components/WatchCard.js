import React, { useState, useEffect, useCallback } from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import WatchDetailsModal from "./WatchDetailsModal";
import watchImage from "../assets/watch.webp";

function WatchCard({ watch, onClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <Card
      className="watch-card"
      onClick={handleCardClick}
      sx={{
        height: "25vh",
        width: "auto",
        borderRadius: 8,
      }}
    >
      <CardMedia
        component="img"
        sx={{ height: "50%", width: "auto", maxWidth: "100%", margin: "auto" }}
        image={
          watch["Photo_URL"].includes("i.redd.it")
            ? watch["Photo_URL"]
            : watchImage
        }
        alt={watch.Model}        
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: { xs: 'h7.fontSize', sm: 'h6.fontSize', md: 'h5.fontSize' } }}>
          {watch.Brand} {watch.Model}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 'body2.fontSize', sm: 'body1.fontSize', md: 'body1.fontSize' } }}>
          Reference Number: {watch["Reference_Number"]}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 'body2.fontSize', sm: 'body1.fontSize', md: 'body1.fontSize' } }}>
          Price: ${watch.Price}
        </Typography>
      </CardContent>
      {isModalOpen && (
        <WatchDetailsModal watch={watch} onClose={handleModalClose} />
      )}
    </Card>
  );
}

export default WatchCard;
