import React, { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel, Box, Input } from "@mui/material";

function BrandDropdown({ supabase }) {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");

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

  const handleChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="brand-dropdown-label">Brand</InputLabel>
        <Select
          labelId="brand-dropdown-label"
          id="brand-dropdown"
          value={selectedBrand}
          label="Brand"
          onChange={handleChange}
        >
          {brands.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function SizeFilter({ supabase }) {
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");

  const handleMinSizeChange = (event) => {
    setMinSize(event.target.value);
  };

  const handleMaxSizeChange = (event) => {
    setMaxSize(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel htmlFor="min-size">Min Size</InputLabel>
        <Select
          native
          value={minSize}
          onChange={handleMinSizeChange}
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
          value={maxSize}
          onChange={handleMaxSizeChange}
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

function SearchBar({ setSearchTerm }) {
    return (
      <Box sx={{ minWidth: 120, mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel htmlFor="search-bar">Search</InputLabel>
          <Input
            id="search-bar"
            aria-describedby="search-bar-text"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </FormControl>
      </Box>
    );
  }

function SearchFilter({ supabase, handleDataFromFilter}) {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <BrandDropdown supabase={supabase} />
      <SizeFilter supabase={supabase} />
      <SearchBar supabase={supabase} />
    </Box>
  );
}

export default SearchFilter;
