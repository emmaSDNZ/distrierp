import React from 'react';
import InventoryNavbar from './navbar/InventoryNavBar';
import { ProductProvider } from '@/context/ProductContext';

export default function Layout({ children, page }) {
  return (
    <>
    <ProductProvider>
      <InventoryNavbar />
      <main>{children}</main>
    </ProductProvider>
    </>
  );
}
