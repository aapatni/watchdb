import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  DialogContentText,
  CardMedia,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function WatchDetailsModal({ watch, onClose }) {
  return (
    <Dialog
      open={!!watch}
      onClose={onClose}
      aria-labelledby="watch-details-title"
      aria-describedby="watch-details-description"
      maxWidth="md"
    >
      <DialogTitle id="watch-details-title">
        {watch.Brand} {watch.Model} - Specifications
        <IconButton
          aria-label="close"
          onClick={onClose} // Fixed to call the onClose function correctly
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
        <CardMedia
          component="img"
          image={
            watch["Photo_URL"].includes("i.redd.it")
              ? watch["Photo_URL"]
              : null
          }
          alt={`${watch.Brand} ${watch.Model}`}
          sx={{ width: "100%", height: "auto", marginBottom: 2 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DialogContentText id="watch-details-description">
              <Typography gutterBottom>
                <b>Reference Number:</b> {watch["Reference_Number"]}
              </Typography>
              <Typography gutterBottom>
                <b>Case Material:</b> {watch["Case_Material"]}
              </Typography>
              <Typography gutterBottom>
                <b>Case Diameter:</b> {watch["Case_Diameter"]} mm
              </Typography>
              <Typography gutterBottom>
                <b>Case Thickness:</b> {watch["Case_Thickness"]} mm
              </Typography>
              <Typography gutterBottom>
                <b>Lug Width:</b> {watch["Lug_Width"]} mm
              </Typography>
              <Typography gutterBottom>
                <b>Lug-to-Lug:</b> {watch["Lug-to-Lug"]} mm
              </Typography>
            </DialogContentText>
          </Grid>
          <Grid item xs={12} md={6}>
            <DialogContentText id="watch-details-description">
              <Typography gutterBottom>
                <b>Dial Color:</b> {watch["Dial_Color"]}
              </Typography>
              <Typography gutterBottom>
                <b>Crystal Type:</b> {watch["Crystal Type"]}
              </Typography>
              <Typography gutterBottom>
                <b>Water Resistance:</b> {watch["Water Resistance"]}
              </Typography>
              <Typography gutterBottom>
                <b>Movement:</b> {watch["Movement"]}
              </Typography>
              <Typography gutterBottom>
                <b>Caliber:</b> {watch["Caliber"]}
              </Typography>
              <Typography gutterBottom>
                <b>Movement Type:</b> {watch["Movement_Type"]}
              </Typography>
              <Typography gutterBottom>
                <b>Power Reserve:</b> {watch["Power_Reserve"]}
              </Typography>
              <Typography gutterBottom>
                <b>Bracelet/Strap Material:</b>{" "}
                {watch["Bracelet_Strap_Material"]}
              </Typography>
              <Typography gutterBottom>
                <b>Clasp Type:</b> {watch["Clasp_Type"]}
              </Typography>
              <Typography gutterBottom>
                <b>Product Weight:</b> {watch["Product_Weight"]}
              </Typography>
              <Typography gutterBottom>
                <b>Features:</b> {watch["Features"]}
              </Typography>
              <Typography gutterBottom>
                <b>Price:</b> ${watch["Price"]}
              </Typography>
              {/* <Typography gutterBottom>
                <b>Availability:</b> {watch["Availability"]}
              </Typography> */}
              <Typography gutterBottom>
                <b>Merchant Name:</b> {watch["Merchant_Name"]}
              </Typography>
              <Typography
                gutterBottom
                component="a"
                href={watch["Product_URL"]}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "none", color: "primary.main" }}
              >
                View Product
              </Typography>
            </DialogContentText>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default WatchDetailsModal;
