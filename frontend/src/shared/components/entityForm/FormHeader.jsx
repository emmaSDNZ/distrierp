import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';


export default function FormHeader({ onDelete }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-lg font-medium"></div>
      <button
        onClick={onDelete}
        className="text-gray-600 hover:text-red-600 transition"
        title="Eliminar producto"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}