import { fetchHelpers } from "../helpers/fetchHelpers";
const { getToEnpoint } = fetchHelpers;

// Endpoints
const urlProducto= `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/producto`;
const apiProductoProductoLista = `${urlProducto}/producto-producto-lista`;


async function getProductoProductoListaByID(id) {
    const enpoint = `${apiProductoProductoLista}/${id}/`
    return await getToEnpoint(enpoint);
}

async function getProductoProductoByID(id) {
    const enpoint = `${apiProductoProductoLista}/id_producto_producto/${id}/`
    return await getToEnpoint(enpoint);
}


export const apiProductoProducto = {
    getProductoProductoListaByID,
    getProductoProductoByID
}