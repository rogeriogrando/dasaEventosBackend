import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/upload';

import UsuarioController from './app/controllers/UsuarioController';
import SessionController from './app/controllers/SessionController';
import authMiddlewarer from './app/middlewares/auth';
import InstituicaoController from './app/controllers/InstituicaoController';
import SalasController from './app/controllers/SalasController';
import PermissaoController from './app/controllers/PermissaoController';
import EventosController from './app/controllers/EventosController';
import PdfController from './app/controllers/PdfController';
import ModeloController from './app/controllers/ModeloController';

const routes = new Router();
const upload = multer(multerConfig);
routes.post('/usuarios', UsuarioController.store);
routes.post('/sessions', SessionController.store);
routes.get('/pdf', PdfController.index);

routes.use(authMiddlewarer);
routes.put('/usuarios', UsuarioController.update);

routes.put('/instituicoes', InstituicaoController.update);
routes.post('/instituicoes', InstituicaoController.store);

routes.post('/salas', SalasController.store);
routes.put('/salas', SalasController.update);

routes.put('/permissao', PermissaoController.update);

routes.post('/eventos', EventosController.store);
routes.get('/eventos', EventosController.index);

routes.post('/modelos', upload.single('file'), ModeloController.store);

export default routes;
