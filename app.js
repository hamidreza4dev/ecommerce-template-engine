import path from 'path';

import { rootPath } from './src/utils/rootPath.js';

import express from 'express';
import dotenv from 'dotenv';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import csurf from 'csurf';

import passport from 'passport';
import './src/configs/passport.js';

import router from './src/routes/routes.js';
import { connectDB } from './src/configs/database.js';

// application
const app = express();
dotenv.config({ path: './src/configs/config.env' });
const PORT = process.env.PORT || 8000;
const csrfProtection = csurf();

// statics
app.use(express.static(path.join(rootPath, 'client', 'public')));

// template engine
app.use(expressEjsLayouts);
app.set('views', 'views');
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');

// middleware's
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);
app.use(csrfProtection);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuth = req.isAuthenticated();
  res.locals.path = req.originalUrl;
  next();
});

// routes
app.use(router);

// errors
app.use((error, req, res, next) => {
  console.log(error);
  res.redirect('/500');
});

// server
connectDB().then(() => {
  console.log('CONNECTED TO MONGODB');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
  });
});

// exports
export { PORT };
