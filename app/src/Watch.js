import React from 'react';

function Watch({ watch }) {
  return (
    <div className="watch">
      <img src={watch["Photo URL"]} alt={watch.Model} style={{ width: '100px', height: '100px' }} />
      <h2>{watch.Brand} {watch.Model}</h2>
      <p>Reference Number: {watch["Reference Number"]}</p>
      <p>Price: ${watch.Price}</p>
      <a href={watch["Product URL"]} target="_blank" rel="noopener noreferrer">View Product</a>
    </div>
  );
}

export default Watch;