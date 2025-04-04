"use client";

import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Aquí puedes agregar la lógica para realizar la búsqueda
  };

  return (
    <div className="relative flex items-center rounded-md shadow-sm w-90">
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
        <SearchIcon className="text-gray-400" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className="block w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 text-sm"
        // Ajustado pl-8 pr-2 py-1 y focus
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;