// src/analytics.js
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-GSR5YWE20Y'); // Replace 'YOUR_MEASUREMENT_ID' with your actual Measurement ID
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};
