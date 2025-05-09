import React from 'react'
import MenuItem from './MenuItem';

export default function DropdownMenu({items}) {
  return (
    <div className="py-1">
    {items.map((item, index) => (
      <MenuItem key={index} href={item.href} isTitle={item.isTitle}>
        {item.label}
      </MenuItem>
    ))}
  </div>
  )
}
