export default async function handler(req, res) {
    const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/productos/`;
  
    try {
      if (req.method === 'GET') {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('No se pudo cargar los productos.');
        const products = await response.json();
        return res.status(200).json(products);
      }
  
      if (req.method === 'POST') {
        const response = await fetch(BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
        });

        console.log("Respuesta del backend:", response); // ⬅️ ¿Es 201 o hay un error
        if (!response.ok) throw new Error('No se pudo agregar el producto.');
        const newProduct = await response.json();
        return res.status(201).json(newProduct);
      }
  
      if (req.method === 'PUT') {
        const { id, ...updatedData } = req.body;
        const response = await fetch(`${BASE_URL}${id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('No se pudo actualizar el producto.');
        const updatedProduct = await response.json();
        return res.status(200).json(updatedProduct);
      }
  
      if (req.method === 'DELETE') {
        const { id } = req.body;
        const response = await fetch(`${BASE_URL}${id}/`, { method: 'DELETE' });
        if (!response.ok) throw new Error('No se pudo eliminar el producto.');
        return res.status(204).end();
      }
  
      return res.status(405).json({ error: 'Método no permitido' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } 