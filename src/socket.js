// socket.js
import { initDb } from './db/mongodb.js'
import { Server } from 'socket.io';
// import mongoose from 'mongoose';
import ProductManager from './dao/ProductManager.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import CartManager from './dao/CartManager.js';
import MessageManager from './dao/MessageManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const absolutePath = path.resolve(__dirname, '../src/data/products.json');

let io;
let messages = []

export const init = async (httpServer) => {

    await initDb();

    io = new Server(httpServer);

    io.on('connection', async (socketClient) => {


        console.log(`Se ha conectado un nuevo cliente 🎉 (${socketClient.id})`);

        const messages = await MessageManager.get();
        // console.log('messages', messages)
        socketClient.emit('listMessages', messages);

        // socketClient.emit('notification', { messages });

        socketClient.broadcast.emit('new-client');

        socketClient.on('new-message', async (data) => {
            const { username, text } = data;
            let newMessage = await MessageManager.create(data)
            // messages.push({ username, text });
            let allMessages = await MessageManager.get();
            // console.log("allMessages", allMessages);
            io.emit('notification', allMessages);
        })

        const products = await ProductManager.get()
        socketClient.emit('listProducts', products)

        const carts = await CartManager.get();
        // console.log("carts", JSON.stringify(carts))
        socketClient.emit('listCarts', carts)

        socketClient.on('addProduct', async (newProduct) => {
            await ProductManager.create(newProduct);
            let products = await ProductManager.get();
            io.emit('listProducts', products)
        })

        socketClient.on('deleteProduct', async (productId) => {
            await ProductManager.deleteById(productId);
            let products = await ProductManager.get();
            io.emit('listProducts', products)
        })

        socketClient.on('updateProduct', async (product) => {
            await ProductManager.updateById(product._id, product)
            let products = await ProductManager.get();
            io.emit('listProducts', products)
        })

        socketClient.on('createCart', async (newCart) => {
            await CartManager.create(newCart);
            let carts = await CartManager.get()
            io.emit('listCarts', carts)
        })

        socketClient.on('addProductToCart', async (product) => {
            // console.log(product)
            try {
                let findedProduct = await ProductManager.getById(product._id)
                // console.log("findedProduct", findedProduct);
                if (findedProduct) {
                    await CartManager.addProductToCart(product.cartId, findedProduct._id, product.quantity)
                    let carts = await CartManager.get()
                    io.emit('listCarts', carts)
                } else {
                    console.log('Product not found')
                }
            }
            catch (error) {
                console.log('error: ', error.message)
            }
            // console.log(findedProduct);
        })

        socketClient.on('deleteCart', async (cartId) => {
            await CartManager.deleteById(cartId);
            let carts = await CartManager.get()
            io.emit('listCarts', carts)
        })
        socketClient.on('disconnect', () => {
            console.log(`Se ha desconectado el cliente con id ${socketClient.id}`)
        })
    })
    console.log('Server socket running 🚀');

}

export const emitFromApi = (event, data) => io.emit(event, data);