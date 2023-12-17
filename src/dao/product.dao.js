import ProductModel from '../models/product.model.js'

export default class ProductDao {

    static get(criteria = {}, options) {
        return ProductModel.paginate(criteria, options)
    }

    static create(payload) {
        const { title, description, code, price, stock, category } = payload.data;
        const { files } = payload

        const product = ProductModel.create({
            title, description, code, price, stock, category,
            thumbnails: files.map(file => file.filename)
        });

        return product
    }

    static getById(pid) {
        return ProductModel.findById(pid)
    }

    static updateById(pid, data) {
        return ProductModel.updateOne({ _id: pid }, { $set: data })
    }

    static deleteById(pid) {
        return ProductModel.deleteOne({ _id: pid })
    }
}