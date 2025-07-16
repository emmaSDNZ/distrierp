// components/VirtualScrollList.js
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function VirtualScrollList({
  data = [],
  estimateSize = 56,
  overscan = 5,
  renderItem,
  itemKeyFn = (item, index) => item.id ?? index,
}) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  return (
    <div ref={parentRef} className="flex-1 overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = data[virtualRow.index];
          if (!item) return null;

          return (
            <div
              key={itemKeyFn(item, virtualRow.index)}
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
              {renderItem(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
