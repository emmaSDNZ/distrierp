import React from 'react'
import CategoryForm from './CategoryForm'
import CategoryList from './CategoryList'

export default function Category() {
  return (
    <div className="flex flex-row gap-6 p-6">
      <div  className="flex flex-row gap-6 p-6">
      <CategoryForm />

    </div>
    <div className="w-2/3">

      <CategoryList />
    </div>
    </div>
  )
}
