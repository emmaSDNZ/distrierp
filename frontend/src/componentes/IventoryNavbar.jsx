"use client";

import Navbar from "./NavBar/Navbar";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";

const InventoryNavbar = () => {
  return (
    <div className="bg-white flex flex-col items-center"> {/* Quitado border-b border-gray-200 */}
      {/* Barra de navegación y UserDropdown */}
      <div className="w-full flex items-center justify-between">
        <Navbar />
        <UserDropdown />
      </div>

      {/* Barra de búsqueda */}
      <div className="w-full flex justify-center py-2">
        <SearchBar />
      </div>
    </div>
  );
};

export default InventoryNavbar;