// components/ui/DropdownInput.js
"use client";
import React, { useState } from "react";

export default function DropdownInput({ items = [], labelKey = "label", onSelect }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item);
    setShowDropdown(false);
    onSelect?.(item); // Callback al componente padre
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        placeholder="Seleccione una opción"
        className="w-full p-2 border border-gray-300 rounded"
        onClick={() => setShowDropdown(!showDropdown)}
        value={selected?.[labelKey] ?? ""}
        readOnly
      />

      {showDropdown && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
          {items.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item[labelKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}