export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/productos/`);
    if (!res.ok) throw new Error('No se pudo cargar los productos.');

    const products = await res.json();
    
    return { props: { products } };
  } catch (error) {
    return { props: { products: [], error: error.message } };
  }
}

export default function ProductCard({ product, error }) {
  if (error) return <p>Error: {error}</p>;

  // Verificar que el producto no sea null o undefined
  if (!product) return <p>No se encontró el producto.</p>;


  return (
    <div className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
      <div className="text-base text-gray-800">{product.nombre}</div>
      <div className="text-sm text-gray-600">{product.referencia || "N/A"}</div>
      <div className="text-sm text-gray-600">
        {product.precio && product.precio.precio
          ? `$${product.precio.precio}`
          : "N/A"}
      </div>
      <div className="text-sm text-gray-600">
        {product.precio_coste && product.precio_coste.precio_coste
          ? `$${product.precio_coste.precio_coste}`
          : "N/A"}
      </div>
      <div className="text-sm text-gray-600">
        {product.precio_venta && product.precio_venta.precio_venta
          ? `$${product.precio_venta.precio_venta}`
          : "N/A"}
      </div>
    </div>
  );
}
