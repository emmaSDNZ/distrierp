// /appInventory/products/page.jsx

"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation';

import ProductView from './view/ProductView';
import VariantsView from './view/VariantsView';

export default function ProductPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  const renderView = () => {
    // 👇 ambos casos se manejan por ProductView
    if (view === 'products' || view === 'new' || view === null) {
      return <ProductView />;
    }
    if (view === 'productsvariants') {
      return <VariantsView />;
    }

    return <div>Selecciona una operación del menú</div>;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {renderView()}
      </div>
    </div>
  );
}
