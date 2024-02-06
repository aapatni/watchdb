import React from 'react';
import { Grid } from '@mui/material';
import WatchCard from './WatchCard';

function WatchGrid({ watches }) {
  return (
    <div className="watch-cards-container">
      <Grid container spacing={4}>
        {watches.map((watch, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <WatchCard watch={watch} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default WatchGrid;
