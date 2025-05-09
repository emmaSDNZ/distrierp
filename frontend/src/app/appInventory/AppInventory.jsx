"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation';
import ProductsList from './components/products/ProductList';

export default function AppInventory() {
  return (
    <div><ProductsList/></div>
  )
}




