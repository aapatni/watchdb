import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function WatchDetailsModal({ watch, onClose }) {
  return (
    <Dialog
      open={!!watch}
      onClose={onClose}
      aria-labelledby="watch-details-title"
      aria-describedby="watch-details-description"
      maxWidth="false"
    >
      <DialogTitle id="watch-details-title">
        {watch.Brand} {watch.Model} - Specifications
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Reference Number: {watch["Reference Number"]}
        </Typography>
        <Typography gutterBottom>
          Case Material: {watch["Case Material"]}
        </Typography>
        <Typography gutterBottom>
          Case Diameter: {watch["Case Diameter"]} mm
        </Typography>
        <Typography gutterBottom>
          Case Thickness: {watch["Case Thickness"]} mm
        </Typography>
        <Typography gutterBottom>Lug Width: {watch["Lug Width"]} mm</Typography>
        <Typography gutterBottom>
          Lug-to-Lug: {watch["Lug-to-Lug"]} mm
        </Typography>
        <Typography gutterBottom>Dial Color: {watch["Dial Color"]}</Typography>
        <Typography gutterBottom>
          Crystal Type: {watch["Crystal Type"]}
        </Typography>
        <Typography gutterBottom>
          Water Resistance: {watch["Water Resistance"]}
        </Typography>
        <Typography gutterBottom>Movement: {watch["Movement"]}</Typography>
        <Typography gutterBottom>Caliber: {watch["Caliber"]}</Typography>
        <Typography gutterBottom>
          Movement Type: {watch["Movement Type"]}
        </Typography>
        <Typography gutterBottom>
          Power Reserve: {watch["Power Reserve"]}
        </Typography>
        <Typography gutterBottom>
          Bracelet/Strap Material: {watch["Bracelet/Strap Material"]}
        </Typography>
        <Typography gutterBottom>Clasp Type: {watch["Clasp Type"]}</Typography>
        <Typography gutterBottom>
          Product Weight: {watch["Product Weight"]}
        </Typography>
        <Typography gutterBottom>Features: {watch["Features"]}</Typography>
        <Typography gutterBottom>Price: ${watch["Price"]}</Typography>
        <Typography gutterBottom>
          Availability: {watch["Availability"]}
        </Typography>
        <Typography gutterBottom>
          Merchant Name: {watch["Merchant Name"]}
        </Typography>
        <Typography
          gutterBottom
          component="a"
          href={watch["Product URL"]}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: "none", color: "primary.main" }}
        >
          View Product
        </Typography>
      </DialogContent>
    </Dialog>
  ); // Added missing closing parenthesis for the return statement
}

export default WatchDetailsModal;
