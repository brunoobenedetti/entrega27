import express from 'express';
import expressSession from 'express-session';
import handlebars from 'express-handlebars';
import path from 'path';
import passport from 'passport';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import MongoStore from 'connect-mongo';
import 'dotenv/config';
import cookieParser from 'cookie-parser'
import config from './config.js';

import { init as initPassportConfig } from './config/passport.config.js';

import indexRouter from './routers/api/index.router.js';
import indexJwtRouter from './routers/api/index.jwt.router.js';
import productsApiRouter from './routers/api/products.router.js'
import cartsApiRouter from './routers/api/carts.router.js'
import products from './routers/views/products.router.js';

import chatViewRouter from './routers/views/chat.router.js';
import cartViewRouter from './routers/views/carts.router.js';


import sessionsRouter from './routers/api/sessions.router.js';
import jwtRouter from './routers/api/jwt.router.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = dirname(__dirname);

const utilsDir = path.join(srcDir, 'utils');

const app = express();

const SESSION_SECRET = config.sessionSecret
const URL_DB = config.db.mongodbURL
// console.log(SESSION_SECRET);
app.use(expressSession({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: URL_DB,
    mongoOptions: {},
    ttl: 3600,
  }),
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const publicDir = path.join(utilsDir, '../public');
app.use(express.static(publicDir));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'handlebars');

initPassportConfig(); // inicializacion de passport 

app.use(passport.initialize());
// app.use(passport.session()); // este hay que comentarlo... me parece

// app.get('/', (req, res) => {
//   res.redirect('/products');
// });

// app.use('/', indexJwtRouter)
app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/products', products);
app.use('/chat', chatViewRouter);
app.use('/cart', cartViewRouter);
app.use('/', indexRouter);
app.use('/api', sessionsRouter);
app.use('/auth', jwtRouter)

app.use((error, req, res, next) => {
  const message = `Ha ocurrido un error desconocido 😨: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});

export default app;
