import React from 'react'

export default function EntityButtonLine({title,setShowInput}) {
  return (
        <button
          className="text-blue-400 hover:text-blue-500 transition"
          onClick={() => setShowInput(true)}
        >
            {title}
        </button>
  )
}
