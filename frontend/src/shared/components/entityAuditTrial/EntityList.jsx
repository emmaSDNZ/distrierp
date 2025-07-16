import React from "react";
import Link from "next/link";

function getNestedValue(obj, path) {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce((acc, part) => acc?.[part], obj);
}

export default function EntityList({ lista, fields, fieldLabels, itemUrlFn }) {
  return (
    <div className="flex flex-col h-full px-4 pt-4 overflow-hidden">
      {/* Encabezado columnas */}
      <div className="flex flex-row border-b pb-2">
        {fields.map((field) => (
          <div
            key={field}
            className="text-sm font-semibold text-gray-700 w-1/5 min-w-[120px]"
          >
            {fieldLabels[field] || field}
          </div>
        ))}
      </div>

      {/* Lista de items */}
      <div className="flex-1 overflow-auto">
        {lista.map((item) => {
          const url = itemUrlFn ? itemUrlFn(item) : "#";

          return (
            <Link href={url} key={item.id_producto_template} className="block">
              <div
                className="flex flex-row py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                style={{ minHeight: "56px" }}
              >
                {fields.map((field) => (
                  <div
                    key={field}
                    className="text-sm text-gray-600 w-1/5 min-w-[120px]"
                  >
                    {getNestedValue(item, field) ?? "—"}
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
