import React, { useState, useEffect, useCallback } from "react";
import { Card, CardMedia, CardContent, Typography, Box, Chip } from "@mui/material";
import watchImage from "../assets/watch.webp";
import WatchIcon from "@mui/icons-material/Watch";

function WatchCard({ watch, onClick }) {
  return (
    <Card
      className="watch-card"
      onClick={() => onClick(watch)}
      sx={{
        height: "25vh",
        width: "auto",
        borderRadius: 8,
        position: "relative"
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
      <Chip label={`$${watch.Price}`} color="primary" sx={{ position: "absolute", top: 10, left: 10 }} />
      
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: { xs: 'h7.fontSize', sm: 'h6.fontSize', md: 'h5.fontSize' } }}>
          {watch.Brand} {watch.Model}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 'body2.fontSize', sm: 'body1.fontSize', md: 'body1.fontSize' } }}>
          Reference Number: {watch["Reference_Number"]}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default WatchCard;


