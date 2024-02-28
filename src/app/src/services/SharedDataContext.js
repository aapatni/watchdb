import React, { createContext, useState, useContext } from 'react';

const SharedDataContext = createContext();

const DataProvider = ({ children }) => {

  const [filterSearchTerm, setFilterSearchTerm] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [filterMinDiameter, setFilterMinDiameter] = useState(null);
  const [filterMaxDiameter, setFilterMaxDiameter] = useState(null);
  const [filterMinPrice, setFilterMinPrice] = useState(null);
  const [filterMaxPrice, setFilterMaxPrice] = useState(null);

  const value = {
    filterSearchTerm, setFilterSearchTerm,
    filterBrand, setFilterBrand,
    filterMinDiameter, setFilterMinDiameter,
    filterMaxDiameter, setFilterMaxDiameter,
    filterMinPrice, setFilterMinPrice,
    filterMaxPrice, setFilterMaxPrice,
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};

export { SharedDataContext, DataProvider };