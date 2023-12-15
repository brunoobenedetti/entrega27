import { Server } from 'socket.io';
import mongoose from 'mongoose';

import config from '../config.js';

const URL_DB = config.db.mongodbURL;


export const initDb = async () => {
    try {
        // console.log("URL_DB", URL_DB)
        await mongoose.connect(URL_DB);
        console.log('Database conected 🚀');
    } catch (error) {
        console.log('Ah ocurrido un error al intentar conectarnos a la DB', error.message);
    }
}
