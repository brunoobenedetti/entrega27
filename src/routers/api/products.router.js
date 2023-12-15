import { Router } from "express";
import ProductManager from "../../dao/ProductManager.js";
// import productModel from "../../models/product.model.js";
// import 'dotenv/config';
import { uploader } from "../../helpers/utils.js";

import config from "../../config.js";

const router = Router();


const buildResponse = (data) => {
    return {
        status: "success",
        payload: data.docs.map(product => product.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.prevPage}` : '',
        nextLink: data.hasNextPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.nextPage}` : '',
    }
}

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query;
        const options = { page, limit, sort: { price: sort || 'desc' } }
        const criteria = {};

        // console.log(limit)
        if (category) {
            console.log("query", category)
            criteria.category = category;
        }
        const result = await ProductManager.get(criteria, options)
        // const result = await productModel.paginate(criteria, options)
        // res.render('products', buildResponse(result))
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// router.get('/', async (req, res) => {
//     const products = await ProductManager.get()
//     res.status(200).json(products);
// })

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await ProductManager.getById(pid);
        res.status(200).json(product);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})


router.post('/', uploader.array('thumbnails', 4), async (req, res) => {
    const { body } = req;
    const { files } = req;
    // console.log('entra a la ruta');
    // console.log('Files:', req.files);

    try {
        const product = await ProductManager.create(body, files);
        res.redirect(`/products`)
        // res.status(201).json(product);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});
// router.post('/', async (req, res) => {
//     const { body } = req;

//     try {
//         const product = await ProductManager.create(body);
//         res.status(201).json(product);
//     } catch (error) {
//         res.status(error.statusCode || 500).json({ message: error.message });
//     }
// })

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { body } = req
    try {
        await ProductManager.updateById(pid, body)
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        await ProductManager.deleteById(pid);
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

export default router;