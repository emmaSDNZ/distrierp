import React from 'react';

export default function NewButton({ onClick }) {
  return (
    <button
      className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-md"
      onClick={onClick}
    >
      Nuevo
    </button>
  );
}