import React from 'react'

export default function EntityAuditHeader({title}) {
  return (
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">{title}</h2>
    </div>
  )
}
