import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import usePaginatedSearch from "@/shared/hooks/usePaginatedSearch";
import SearchBar from "@/app/appInventory/components/navbar/SearchBar";
import Link from 'next/link';
export default function VirtualizedList({
  fetchDataFn,
  fields,
  fieldLabels,
  renderItem,
  searchPlaceholder = "Buscar...",
  itemUrlFn,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    dataList,
    nextUrl,
    prevUrl,
    totalCount,
    loading,
    fetch,
  } = usePaginatedSearch(fetchDataFn, searchTerm);

  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: dataList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden px-4 pt-4">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-grow min-w-[200px]">
          <SearchBar 
          value={searchTerm} onSearch={setSearchTerm} placeholder={searchPlaceholder} />
        </div>
        <div className="text-gray-700 min-w-[150px]">Total: {totalCount}</div>
        <div className="flex items-center gap-2 flex-shrink-0 min-w-[200px]">
          <button
            onClick={() => fetch(prevUrl)}
            disabled={!prevUrl}
            className="px-4 bg-blue-400 text-white rounded-md disabled:opacity-50 hover:bg-blue-500 active:bg-blue-400"
            style={{ height: "38px", minWidth: "90px" }}
          >
            Anterior
          </button>
          <button
            onClick={() => fetch(nextUrl)}
            disabled={!nextUrl}
            className="px-4 bg-blue-400 text-white rounded-md disabled:opacity-50 hover:bg-blue-500 active:bg-blue-400"
            style={{ height: "38px", minWidth: "90px" }}
          >
            Siguiente
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 border-b pb-2">
        {fields.map((field) => (
          <div key={field} className="text-sm font-semibold text-gray-700 w-1/5">
            {fieldLabels[field] || field}
          </div>
        ))}
      </div>

      <div ref={parentRef} className="flex-1 overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
            width: "100%",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = dataList[virtualRow.index];
            if (!item) return null;
            const content = renderItem(item, fields);

            return (
              <div
                key={item.id ?? virtualRow.key ?? virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  cursor: "pointer",
                }}
              >
                {itemUrlFn ? (
                  <Link href={itemUrlFn(item)} passHref>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
