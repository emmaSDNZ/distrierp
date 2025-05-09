"use client";
import React, { useState, useContext, useRef } from 'react';
import { ApiUserContext } from "@/shared/context/UserContext";

export default function InternalCardSearch({ onUserSelect }) {
  const { apiUsersList } = useContext(ApiUserContext);

  const [usersListAll, setUsersListAll] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef(null);

  const fetchAllUsers = async () => {
    try {
      const data = await apiUsersList();
      setUsersListAll(data.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error al traer usuarios:", error);
    }
  };

  const handleSelectUser = (selectedUser) => {
    console.log("Seleccionando usuario:", selectedUser.name);  
    setInputValue(selectedUser.name);
    onUserSelect(selectedUser);  // Llamamos directamente con el usuario seleccionado
    setShowDropdown(false); 
  };

  const handleBlur = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="flex items-center gap-2">
        <input
          type="text"
          onClick={fetchAllUsers}
          value={inputValue}
          onBlur={handleBlur}
          placeholder="Ingrese Laboratorio"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {showDropdown && usersListAll.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10"
        >
          {usersListAll.map((userItem, index) => (
            <div
              key={index}
              onMouseDown={() => handleSelectUser(userItem)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer border-b last:border-0"
            >
              {userItem.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
