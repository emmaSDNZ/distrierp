import React from 'react'
import EntityAuditHeader from '../entityAuditTrial/EntityAuditHeader'
import SearchBar from '@/app/appInventory/components/navbar/SearchBar'
import EntityPagination from '../entityGeneral/EntityPagination'

export default function HeaderList({title,nextUrl,prevUrl, onPageChange,onSearch }) {
    return (
    <div>
    <EntityAuditHeader
      title= {title}
    />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
        <div className="flex-grow min-w-[200px]">
          <SearchBar 
          onSearch= {onSearch}
          />
        </div>
        {/* Aquí usas el paginador del contexto */}
        <EntityPagination
        nextUrl={nextUrl}
        prevUrl={prevUrl}
        onPageChange={onPageChange}
      />
      </div>
    </div>
    
  )
}
