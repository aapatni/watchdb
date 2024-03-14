import React, { useState, useEffect, useContext } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
  Input,
  Autocomplete,
  TextField
} from "@mui/material";
import { SharedDataContext } from "../services/SharedDataContext";

function BrandDropdown({ supabase }) {
    const { filterBrand, setFilterBrand } = useContext(SharedDataContext);
    const [brands, setBrands] = useState([]);
  
    useEffect(() => {
      async function fetchBrands() {
        let { data, error } = await supabase.rpc("get_unique_brands");
  
        if (error) {
          console.error("error", error);
        } else {
          setBrands(data.map((item) => item.brand));
        }
      }
  
      fetchBrands();
    }, [supabase]);
  
    return (
      <Box sx={{ minWidth: 120 }}>
        <Autocomplete
          value={filterBrand}
          onChange={(event, newValue) => {
            setFilterBrand(newValue || null);
          }}
          options={brands}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Brand"
              placeholder="Select or type"
            />
          )}
          fullWidth
          freeSolo // Allows arbitrary input values not specified in the options
        />
      </Box>
    );
  }

function SizeFilter({ }) {
  const { setFilterMinDiameter, setFilterMaxDiameter } =
    useContext(SharedDataContext);

  const [minDiameter, setMinDiameter] = useState("");
  const [maxDiameter, setMaxDiameter] = useState("");

  const handleMinChange = (event) => {
    const value = event.target.value === "" ? null : event.target.value;
    setFilterMinDiameter(value);
    setMinDiameter(value);
  };

  const handleMaxChange = (event) => {
    const value = event.target.value === "" ? null : event.target.value;
    setFilterMaxDiameter(value);
    setMaxDiameter(value);
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel htmlFor="min-size">Min Size</InputLabel>
        <Select
          native
          value={minDiameter || ""}
          onChange={handleMinChange}
          inputProps={{
            name: "min-size",
            id: "min-size",
          }}
        >
          <option aria-label="None" value="" />
          {[...Array(21).keys()].map((i) => (
            <option key={i} value={i + 30}>
              {i + 30} mm
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel htmlFor="max-size">Max Size</InputLabel>
        <Select
          native
          value={maxDiameter || ""}
          onChange={handleMaxChange}
          inputProps={{
            name: "max-size",
            id: "max-size",
          }}
        >
          <option aria-label="None" value="" />
          {[...Array(21).keys()].map((i) => (
            <option key={i} value={i + 30}>
              {i + 30} mm
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function SearchBar({ }) {
  const { setFilterSearchTerm } = useContext(SharedDataContext);
  return (
    <Box sx={{ minWidth: 120, mt: 2 }}>
      <FormControl fullWidth>
        <InputLabel htmlFor="search-bar">Search</InputLabel>
        <Input
          id="search-bar"
          aria-describedby="search-bar-text"
          onChange={(event) => setFilterSearchTerm(event.target.value || null)}
        />
      </FormControl>
    </Box>
  );
}

function PriceFilter( ) {
    const {
      filterMinPrice,
      setFilterMinPrice,
      filterMaxPrice,
      setFilterMaxPrice,
    } = useContext(SharedDataContext);
    const [isInvalid, setIsInvalid] = useState(false);
  useEffect(() => {
    setIsInvalid(filterMinPrice < 0 || filterMinPrice > filterMaxPrice);
  }, [filterMinPrice, filterMaxPrice]);
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <FormControl fullWidth error={isInvalid}>
        <InputLabel htmlFor="min-price">Min Price</InputLabel>
        <Input
          id="min-price"
          type="number"
          value={filterMinPrice ? parseFloat(filterMinPrice) : ""}
          onChange={(event) => setFilterMinPrice(event.target.value ? parseFloat(event.target.value) : null)}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />
      </FormControl>
      <FormControl fullWidth error={isInvalid}>
        <InputLabel htmlFor="max-price">Max Price</InputLabel>
        <Input
          id="max-price"
          type="number"
          value={filterMaxPrice ? parseFloat(filterMaxPrice) : ""}
          onChange={(event) => setFilterMaxPrice(event.target.value ? parseFloat(event.target.value) : null)}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />
      </FormControl>
    </Box>
  );
}


function Search({ supabase }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <SearchBar />
      <BrandDropdown supabase={supabase} />
      <SizeFilter />
      <PriceFilter />
    </Box>
  );
}

export default Search;
