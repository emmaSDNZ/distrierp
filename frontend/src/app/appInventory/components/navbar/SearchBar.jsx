"use client";

import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  };

  return (
    <div className="relative flex items-center rounded-md shadow-sm w-90">
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
        <SearchIcon className="text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-200 focus:border-blue-400 text-sm"
        placeholder="Buscar..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBar;