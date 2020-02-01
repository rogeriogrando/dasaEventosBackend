import Sequelize, { Model } from 'sequelize';

class Salas extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING(255),
        numero: Sequelize.STRING(10),
        bloco: Sequelize.STRING(50),
        capacidade: Sequelize.INTEGER,
        lousa: Sequelize.BOOLEAN,
        projetor: Sequelize.BOOLEAN,
        auditorio: Sequelize.BOOLEAN,
        sistema_som: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Salas;
