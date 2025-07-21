export function aplicarDescuentoProducto(data, idsSeleccionados, columna, porcentaje) {
  return data.map((fila) => {
    if (idsSeleccionados.includes(fila._id_provisional)) {
      const original = parseFloat(fila[columna]);
      const nuevoValor = original * (1 - porcentaje / 100);
      console.log(`Descuento aplicado a id=${fila._id_provisional}: ${original} -> ${nuevoValor}`);
      return {
        ...fila,
        [columna]: nuevoValor,
      };
    }
    return fila;
  });
}

export function aplicarAumentoPorColumna(data, idsSeleccionados, columna, porcentaje) {
  return data.map((fila) => {
    if (idsSeleccionados.includes(fila._id_provisional)) {
      return {
        ...fila,
        [columna]: parseFloat(fila[columna]) * (1 + porcentaje / 100),
      };
    }
    return fila;
  });
}