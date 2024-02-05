import React, { useEffect } from "react";

function WatchDetailsModal({ watch, onClose }) {
  // Effect for adding and cleaning up the event listener
  useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === "Escape" ? onClose() : null);
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onClose]);

  if (!watch) return null;
  // This function is triggered when the modal backdrop is clicked
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      onClose();
    }
  };
  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>
          {watch.Brand} {watch.Model} - Specifications
        </h2>
        <div className="modal-content">
          <p>Reference Number: {watch["Reference Number"]}</p>
          <p>Case Material: {watch["Case Material"]}</p>
          <p>Case Diameter: {watch["Case Diameter"]} mm</p>
          <p>Case Thickness: {watch["Case Thickness"]} mm</p>
          <p>Lug Width: {watch["Lug Width"]} mm</p>
          <p>Lug-to-Lug: {watch["Lug-to-Lug"]} mm</p>
          <p>Dial Color: {watch["Dial Color"]}</p>
          <p>Crystal Type: {watch["Crystal Type"]}</p>
          <p>Water Resistance: {watch["Water Resistance"]}</p>
          <p>Movement: {watch["Movement"]}</p>
          <p>Caliber: {watch["Caliber"]}</p>
          <p>Movement Type: {watch["Movement Type"]}</p>
          <p>Power Reserve: {watch["Power Reserve"]}</p>
          <p>Bracelet/Strap Material: {watch["Bracelet/Strap Material"]}</p>
          <p>Clasp Type: {watch["Clasp Type"]}</p>
          <p>Product Weight: {watch["Product Weight"]}</p>
          <p>Features: {watch["Features"]}</p>
          <p>Price: ${watch["Price"]}</p>
          <p>Availability: {watch["Availability"]}</p>
          <p>Merchant Name: {watch["Merchant Name"]}</p>
          <a
            href={watch["Product URL"]}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Product
          </a>
        </div>
      </div>
    </div>
  );
}

export default WatchDetailsModal;
