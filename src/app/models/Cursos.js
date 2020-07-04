import Sequelize, { Model } from 'sequelize';

class Cursos extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING(255),
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Cursos;
