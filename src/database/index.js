import Sequelize from 'sequelize';
import Usuarios from '../app/models/Usuarios';
import Instituicoes from '../app/models/Instituicoes';
import Salas from '../app/models/Salas';
import Eventos from '../app/models/Eventos';
import Modelos from '../app/models/Modelos';
import databaseConfig from '../config/database';

const models = [Usuarios, Instituicoes, Salas, Eventos, Modelos];

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
