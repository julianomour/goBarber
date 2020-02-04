import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import Youch from 'youch';
import path from 'path';
import * as Sentry from '@sentry/node';
import routes from './routes';
import './database'; // Não presisa passar o index.js pois ele vais er reconhecido automaticamente
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.midlewares();
    this.routes();
    this.exceptionHandler();
  }

  midlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV) {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

export default new App().server;
