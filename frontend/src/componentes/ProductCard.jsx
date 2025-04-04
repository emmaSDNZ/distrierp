"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useContext } from 'react'
import { ProductContext } from "@/context/ProductContext"; 

function ProductCard({producto}) {
    const router = useRouter();
    const { updateProduct, deleteProduct } = useContext(ProductContext);
    const [edit, setEdit] = useState(false);
    const [nombre, setProductoNombre] = useState(producto.nombre); 
    const [descripcion, setDescripcion] = useState(producto.descripcion);

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
          deleteProduct(id);
          router.refresh();
        }
      };

    const handleProductDone = (id) => {
    updateProduct(id, { ...producto, done: !producto.done });
    router.refresh();
    };

    const handleUpdate = (id) => {
    updateProduct(id, { nombre: nombre, descripcion: descripcion });
    router.refresh();
    setEdit(false);
    };


return (
    <li key={producto.id} className="py-4">
    <div className="flex justify-between">
        <div className="flex-1">
            {
                !edit ? (
                    
                    <p className="font-semibold">{producto.nombre}
                    {producto.done && <span className="text-green-500"> -✅ Hecho</span>}
                    </p>

                ): (
                    <input 
                    className='shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline outline-none'
                    onChange={(e) => setProductoNombre(e.target.value)}
                    type="text" value={nombre} />
                )
                
            }
            {
                !edit ? (
                    <p className="text-gray-600">{producto.descripcion}</p>
                ):(
                    <input 
                    className='shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline outline-none'
                    onChange={(e) => setDescripcion(e.target.value)}
                    type="text" value={descripcion} />
                )
            }
        </div>
    </div>
    <div>

            {
                edit && (
                    <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleUpdate(producto.id)}
                    >Guardar</button>
                )
            }
            <button
            className={producto.done ? "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" : "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"}
                onClick={() => handleProductDone(producto.id)}
            >{producto.done? "Tarea Hecha" : "Desmarcar"}</button>
        <button
        className= "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleDelete(producto.id)}
        >Eliminar</button>
        {
            !edit && (
                <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setEdit(!edit)}
                >Editar</button>
            )
        }
    </div>
    </li>
)
}

export default ProductCard