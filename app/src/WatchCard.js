import React from 'react';

function WatchCard({ watch, onClick }) {
  return (
    <div className="watch-card" onClick={() => onClick(watch)}>
      <img src={watch["Photo URL"]} alt={watch.Model} className="watch-image" />
      <div className="watch-info">
        <h3>{watch.Brand} {watch.Model}</h3>
        <p>Reference Number: {watch["Reference Number"]}</p>
        <p>Price: ${watch.Price}</p>
      </div>
    </div>
  );
}

export default WatchCard;
