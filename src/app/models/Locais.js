import Sequelize, { Model } from 'sequelize';

class Locais extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING(255),
        descricao: Sequelize.STRING,
        capacidade: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Locais;
