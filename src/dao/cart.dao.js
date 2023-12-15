import CartModel from "../models/cart.model.js";

export default class CartDao {

    static async getAll() {
        return await CartModel.find();
    }

    static async create(data = {}) {
        return await CartModel.create(data)
    }

    static async getById(cid) {
        return await CartModel.findById(cid);
    }


    static async updateCart(cartId, products) {
        return await CartModel.findOneAndUpdate({ _id: cartId }, { $set: { products } })
    }

    static async deleteById(cid) {
        return await CartModel.deleteOne({ _id: cid })
    }

}