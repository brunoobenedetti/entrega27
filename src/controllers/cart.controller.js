import CartsService from "../services/carts.services.js";
import { Exception } from "../helpers/utils.js";
export default class CartController {

    static async get(filter = {}) {
        const carts = await CartsService.findAll(filter)
        return carts;
    }

    static async create(newCart = {}) {
        const cart = await CartsService.create(newCart)
        return cart;
    }

    static async getById(cid) {
        return await CartsService.findById(cid)
    }


    static async deleteById(cid) {
        await CartController.getById(cid)
        console.log("Eliminando el carrito");
        await CartsService.deleteById(cid);
        console.log("Carrito eliminado correctamente");
    }

    static async addProductToCart(cartId, productId, quantity) {
        try {
            // console.log('entra al controlador');
            const cart = await CartController.getById(cartId)
            // console.log("quantity", quantity)
            // const cart = await CartModel.findById(cartId);
            // console.log("cart.products: ", cart.products[0].productId._id, productId)
            // return;
            if (!cart) {
                throw new Exception('No se encontro el carrito', 404)
            }

            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );
            // console.log(existingProductIndex);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += Number(quantity)
            } else {
                cart.products.push({ productId, quantity })
            }
            const updatedCart = await CartsService.updateById(cartId, cart.products)
            return updatedCart;
        } catch (error) {
            console.error("Error", error.message);
            throw new Exception("Error al agregar producto al carrito", 500)

        }
    }

    static async removeProductFromCart(cid, productId) {
        try {
            const cart = await CartController.getById(cid);
            if (!cart) {
                throw new Exception('No se encontro el carrito', 404)
            }
            // console.log(productId);
            // console.log(cart);
            // console.log("cart.products", cart.products)

            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );



            if (existingProductIndex !== -1) {
                console.log("existingProduct", existingProductIndex);
                cart.products.splice(existingProductIndex, 1)
            } else {
                throw new Exception('No se encontro el producto en el carrito', 404)
            }


            const updatedCart = await CartsService.updateById(cid, cart.products)

            return updatedCart;
        } catch (error) {
            throw new Exception("Error al eliminar el producto del carrito", 500)
        }
    }

    static async removeAllProductsFromCart(cid) {
        try {
            const cart = await CartController.getById(cid);

            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }

            cart.products = [];

            const updatedCart = await CartsService.updateById(cid, cart.products)

            return updatedCart;
        } catch (error) {
            throw new Exception('Error al eliminar los productos del carrito', 500)
        }
    }

    static async updateProductQuantityFromCart(cid, pid, quantity) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }

            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId) === String(pid)
            );
            // console.log(existingProductIndex);
            if (existingProductIndex !== -1) {
                // console.log("existingProductIndex", existingProductIndex);
                cart.products[existingProductIndex].quantity = Number(quantity)
            }

            const updatedCart = await cart.save();

            return updatedCart;
        } catch (error) {
            throw new Exception('Error al actualizar el producto del carrito', 500)

        }
    }

    static async updateProductsFromCart(cid, products) {
        try {
            const cart = await CartsService.findById(cid);

            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }
            // primero que nada vacio el carrito...
            await CartController.removeAllProductsFromCart(cid);

            products.forEach(prod => {
                this.addProductToCart(cid, prod.productId, prod.quantity)
            })

            const updatedCart = await cart.save();

            return updatedCart;


        } catch (error) {
            throw new Exception('Error al actualizar los productos del carrito', 500)
        }
    }

}