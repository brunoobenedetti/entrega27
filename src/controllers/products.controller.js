import ProductsService from "../services/products.service.js";

export default class ProductsController {
    static async get(query = {}, paginationOptions = {}) {
        const { page = 1, limit = 10, category, sort } = paginationOptions;

        const options = {
            page,
            limit,
            sort
        }

        const criteria = {};

        // console.log(limit)
        if (category) {
            // console.log("query", category)
            criteria.category = category;
        }
        // console.log('sort', sort)
        const products = await ProductsService.findAll(query, options)
        return products
    }

    static async create(data, files) {
        // console.log('entra al controlador');
        const product = await ProductsService.create({ data, files })
        return product
    }

    static async getById(pid) {
        const product = await ProductsService.findById(pid)
        if (!product) {
            throw new Error(`Id de producto no encontrado ${pid}`)
        }
        return product
    }

    static async updateById(pid, data) {
        await ProductsController.getById(pid)
        console.log('Actualizando el producto')
        await ProductsService.updateById(pid, data)
        console.log("Producto actualizado correctamente")
    }

    static async deleteById(pid) {
        await ProductsController.getById(pid)
        console.log("Eliminando producto...");
        await ProductsService.deleteById(pid)
        console.log("Producto eliminado correctamente");
    }
}