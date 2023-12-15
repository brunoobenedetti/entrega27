import CartDao from "../dao/cart.dao.js";

import { Exception } from "../helpers/utils.js";

export default class CartService {

    static getAll(filter = {}) {
        return CartDao.getAll(filter)
    }

    static async create(payload) {
        console.log("Creando un carrito")
        const cart = await CartDao.create(payload);
        console.log(`Carrito creado correctamente ${cart._id}`)
        return cart;
    }

    static getById(cid) {
        return CartDao.getById(cid)
    }

    static updateById(cid, payload) {
        return CartDao.updateCart(cid, payload)
    }

    static deleteById(cid) {
        return CartDao.deleteById(cid)
    }

    static async addProductToCart(cartId, productId, quantity) {
        try {
            // console.log("quantity", quantity)
            const cart = await CartModel.findById(cartId);
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
            const updatedCart = await CartDao.updateCart(cartId, cart.products)
            return updatedCart;
        } catch (error) {
            console.error("Error", error.message);
            throw new Exception("Error al agregar producto al carrito", 500)

        }
    }

    static async removeProductFromCart(cid, productId) {
        try {
            const cart = await CartDao.getById(cid);
            if (!cart) {
                throw new Exception('No se encontro el carrito', 404)
            }
            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId) === String(productId)
            );

            if (existingProductIndex !== -1) {
                cart.products.splice(existingProductIndex, 1)
            } else {
                throw new Exception('No se encontro el producto en el carrito', 404)
            }

            const updatedCart = await CartDao.updateCart(cid,)

            return updatedCart;
        } catch (error) {
            throw new Exception("Error al eliminar el producto del carrito", 500)
        }
    }

    static async removeAllProductsFromCart(cid) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }

            cart.products = [];
            const updatedCart = await cart.save();

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
}