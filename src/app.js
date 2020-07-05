import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/modelos',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(
      '/validacertificados',
      express.static(path.resolve(__dirname, '..', 'tmp', 'validacertificados'))
    );
    this.server.use(
      '/certificados',
      express.static(path.resolve(__dirname, '..', 'tmp', 'certificados'))
    );
    this.server.use(
      '/assinaturas',
      express.static(path.resolve(__dirname, '..', 'tmp', 'assinaturas'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
