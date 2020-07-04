import Sequelize from 'sequelize';
import Usuarios from '../app/models/Usuarios';
import Instituicoes from '../app/models/Instituicoes';
import Locais from '../app/models/Locais';
import Eventos from '../app/models/Eventos';
import Modelos from '../app/models/Modelos';
import ValidaCertificados from '../app/models/ValidaCertificados';
import Cursos from '../app/models/Cursos';
import UsuarioEventos from '../app/models/UsuarioEventos';
import Certificados from '../app/models/Certificados';
import Assinaturas from '../app/models/Assinaturas';
import databaseConfig from '../config/database';

const models = [
  Usuarios,
  Instituicoes,
  Locais,
  Eventos,
  Modelos,
  Cursos,
  UsuarioEventos,
  ValidaCertificados,
  Certificados,
  Assinaturas,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
