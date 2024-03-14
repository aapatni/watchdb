import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";
import watchImage from "../assets/watch.webp";

function WatchCard({ watch, onClick }) {
  const getImageUrl = () => {
    if (!watch["Photo_URL"] || watch["Photo_URL"] === "") {
      return watchImage; // Default image when Photo_URL is null or empty
    }
    if (watch["Photo_URL"].includes("i.redd.it")) {
      return watch["Photo_URL"];
    } else if (watch["Photo_URL"].includes("preview.redd.it")) {
      return watch["Photo_URL"];
    } else {
      return watchImage;
    }
  };

  return (
    <Card
      className="watch-card"
      onClick={() => onClick(watch)}
      sx={{
        width: "auto",
        borderRadius: 2,
        position: "relative",
        padding: "0px 0px"
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: { xs: "150px", sm: "200px", md: "250px" },
          width: "100%",
          maxWidth: "100%",
          margin: "auto",
        }}
        image={getImageUrl()}
        alt={watch.Model}
      />
      <Chip
        label={`$${watch.Price}`}
        color="primary"
        sx={{ position: "absolute", top: "10px", left: "12px", padding: "0px 0px"}}
      />

      <CardContent
        sx={{
          height: { xs: "75px", sm: "100px", md: "125px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          padding: "8px 12px !important"
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: {
              xs: "body2.fontSize",
              sm: "body1.fontSize",
              md: "body1.fontSize",
            },
            opacity: "40%"
          }}
        >
          Ref: {watch["Reference_Number"]}
        </Typography>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontSize: {
              xs: "h7.fontSize",
              sm: "h6.fontSize",
              md: "h5.fontSize",
            },
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {watch.Brand} {watch.Model}
        </Typography>
        
      </CardContent>
    </Card>
  );
}

export default WatchCard;
