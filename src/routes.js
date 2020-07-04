import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/upload';
import multerConfigCert from './config/certificado';
import multerConfigValCert from './config/validacertificado';
import multerConfigAssinaturas from './config/assinaturas';

import UsuarioController from './app/controllers/UsuarioController';
import SessionController from './app/controllers/SessionController';
import authMiddlewarer from './app/middlewares/auth';
import InstituicaoController from './app/controllers/InstituicaoController';
import LocalController from './app/controllers/LocalController';
import PermissaoController from './app/controllers/PermissaoController';
import EventosController from './app/controllers/EventosController';
import ModeloController from './app/controllers/ModeloController';
import CursoController from './app/controllers/CursoController';
import CoordenadorController from './app/controllers/CoordenadorController';
import UsuarioEventosController from './app/controllers/UsuarioEventosController';
import UsuarioEventosPresencaController from './app/controllers/UsuarioEventosPresencaController';
import ValidaCertificadoController from './app/controllers/ValidaCertificadoController';
import CertificadoController from './app/controllers/CertificadoController';
import AssinaturaController from './app/controllers/AssinaturaController';

const routes = new Router();
const upload = multer(multerConfig);
const validacertificados = multer(multerConfigValCert);
const certificados = multer(multerConfigCert);
const assinaturas = multer(multerConfigAssinaturas);
routes.post('/usuarios', UsuarioController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddlewarer);
routes.put('/usuarios', UsuarioController.update);

routes.post('/usuarioeventos', UsuarioEventosController.store);
routes.delete('/usuarioeventos/:id', UsuarioEventosController.delete);
routes.get('/usuarioeventos', UsuarioEventosController.index);

routes.put('/coordenador/:id', CoordenadorController.update);
routes.get('/coordenador', CoordenadorController.index);
routes.delete('/coordenador/:id', CoordenadorController.delete);
routes.get('/coordenador/:email', CoordenadorController.show);

routes.put('/instituicoes', InstituicaoController.update);
routes.post('/instituicoes', InstituicaoController.store);

routes.post('/locais', LocalController.store);
routes.put('/locais/:id', LocalController.update);
routes.get('/locais', LocalController.index);
routes.get('/locais/:id', LocalController.show);
routes.delete('/locais/:id', LocalController.delete);

routes.put('/permissao', PermissaoController.update);

routes.post('/eventos', EventosController.store);
routes.get('/eventos', EventosController.index);
routes.get('/eventos/:id', EventosController.show);
routes.put('/eventos/:id', EventosController.update);

routes.post('/cursos', CursoController.store);
routes.get('/cursos', CursoController.index);
routes.get('/cursos/:id', CursoController.show);
routes.put('/cursos/:id', CursoController.update);
routes.delete('/cursos/:id', CursoController.delete);

routes.post('/presencas/:id', UsuarioEventosPresencaController.store);
routes.delete('/presencas/:id', UsuarioEventosPresencaController.delete);
routes.get('/presencas/:evento_id', UsuarioEventosPresencaController.index);
routes.get('/presencas/', UsuarioEventosPresencaController.show);

routes.post('/modelos', upload.single('file'), ModeloController.store);
routes.get('/modelos', ModeloController.index);
routes.get('/modelos/:id', ModeloController.show);
routes.delete('/modelos/:id', ModeloController.delete);
routes.put('/modelos/:id', upload.single('file'), ModeloController.update);

routes.post(
  '/validacertificados/:id',
  validacertificados.single('file'),
  ValidaCertificadoController.store
);

routes.get('/validacertificados/:id', ValidaCertificadoController.show);

routes.get('/certificados', CertificadoController.index);
routes.post(
  '/certificados/:evento_id',
  certificados.single('file'),
  CertificadoController.store
);

routes.post(
  '/assinaturas',
  assinaturas.single('file'),
  AssinaturaController.store
);
routes.get('/assinaturas', AssinaturaController.index);
routes.get('/assinaturas/:id', AssinaturaController.show);
routes.delete('/assinaturas/:id', AssinaturaController.delete);
routes.put(
  '/assinaturas/:id',
  assinaturas.single('file'),
  AssinaturaController.update
);

export default routes;
