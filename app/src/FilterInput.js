import React, { useState, useEffect, useContext } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Input,
} from "@mui/material";
import { SharedDataContext } from "./SharedDataContext";

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

  const handleChange = (event) => {
    setFilterBrand(event.target.value || null);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="brand-dropdown-label">Brand</InputLabel>
        <Select
          labelId="brand-dropdown-label"
          id="brand-dropdown"
          value={filterBrand || ""}
          label="Brand"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
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

function SearchBar({ setSearchTerm }) {
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

function FilterInput({ supabase }) {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <BrandDropdown supabase={supabase} />
      <SizeFilter supabase={supabase} />
      <SearchBar supabase={supabase} />
    </Box>
  );
}

export default FilterInput;
