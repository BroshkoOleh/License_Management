"use client";
import React, { useEffect, useState, ChangeEvent } from "react";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import { useStore } from "../../../store/useStore";

const GroupListSearchBar: React.FC = () => {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const [query, setQuery] = useState<string>("");

  const setSearchString = useStore((state) => state.setSearchString);
  const searchString = useStore((state) => state.searchString);

  useEffect(() => {
    setSearchString(query);

    // localStorage.setItem("searchQuery", query);
  }, [query, setSearchString]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleClear = (): void => {
    setSearchString("");
    setQuery("");
    // localStorage.setItem("searchQuery", "");
  };

  if (!hasHydrated) {
    return <div></div>;
  }

  return (
    <TextField
      variant="outlined"
      value={searchString}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {query !== "" && (
              <IconButton onClick={handleClear}>
                <ClearIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default GroupListSearchBar;
