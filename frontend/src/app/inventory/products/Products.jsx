import React from 'react'
import Layout from '../components/Layout'
import ProductsList from '../components/products/ProductsList'
import ProductForm from '../components/products/ProductForm'


export default function Products() {
  return (

    <Layout>
      <div className="flex flex-row gap-6 p-6">
        <div className="w-full">
          <ProductForm />
        </div>
      </div>
    </Layout>
  );
}

