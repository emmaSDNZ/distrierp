"use client"
import React from "react";
import InventoryNavBar from "./components/navbar/InventoryNavBar";
import { ApiProductProvider } from '../../shared/context/ProductContext';
import { ApiUserProvider } from '../../shared/context/UserContext';
import { ApiCsvProvider } from '../../shared/context/CsvContext';

export default function InventoryLayout({ children }) {
  return (
    <ApiProductProvider>
    <ApiUserProvider>
    <ApiCsvProvider>
        <div className="flex flex-col h-screen">
          <InventoryNavBar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </ApiCsvProvider>
    </ApiUserProvider>    
    </ApiProductProvider>
  );
}