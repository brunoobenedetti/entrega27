import CartDao from "../dao/cart.dao.js";
import CartService from "../services/carts.services.js";
export default class CartController {


    static async getAllCarts() {

        const result = await CartDao.getAll()
        return result
    }

    static async getCartById(cid) {
        try {
            const cart = await CartDao.getById(cid);

            if (!cart) {
                throw new Exception('No existe el carrito', 404)
            }
            return cart;
        } catch (error) {
            console.error(error.message)
            throw new Error(error.message)
        }
    }

    static async deleteCartById(cid) {
        try {
            await CartDao.deleteById(cid)

        } catch (error) {
            console.error(error.message)
            throw new Error(error.message)
        }
    }

    static async addProductToCart(cartId, productId, quantity) {
        try {
            const cartUpdated = await CartService.addProductToCart(cartId, productId, quantity)
            return cartUpdated
        } catch (error) {
            console.error(error.message)
            throw new Error(error.message)
        }
    }
    static async removeProductFromCart(cid, pid) {
        try {
            const cartUpdated = await CartService.removeProductFromCart(cid, pid)
            return cartUpdated
        } catch (error) {
            console.error(error.message)
            throw new Error(error.message)
        }
    }

    static async removeProductFromCart(cid, pid) {
        try {
            const cartUpdated = await CartService.removeProductFromCart(cid, pid)
            return cartUpdated
        } catch (error) {
            throw new Exception("Error al eliminar el producto del carrito", 500)
        }
    }

    static async removeAllProductsFromCart(cid) {
        try {
            const cart = await CartService.removeProductFromCart(cid);
            return cart;
        } catch (error) {
            throw new Exception('Error al eliminar los productos del carrito', 500)
        }
    }

}