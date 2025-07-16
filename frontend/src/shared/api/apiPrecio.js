import { fetchHelpers } from "../helpers/fetchHelpers";
const { postDataToEnpoint } = fetchHelpers;

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const apiPrecioBase = `${baseURL}/api_distrimed_productos/precio-base/create/`;
const apiPrecioVenta = `${baseURL}/api_distrimed_productos/precio-venta/create/`;
const apiPrecioCompra = `${baseURL}/api_distrimed_productos/precio-compra/create/`;

async function createPrecioBase(formData) {
    return await postDataToEnpoint(apiPrecioBase, formData);
}
async function createPrecioVenta(formData) {
    return await postDataToEnpoint(apiPrecioVenta, formData);
}
async function createPrecioCompra(formData) {
    return await postDataToEnpoint(apiPrecioCompra, formData);
}

export const apiPrecio = {
    createPrecioBase,
    createPrecioVenta,
    createPrecioCompra
}
