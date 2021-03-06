import Sequelize, { Model } from 'sequelize';

class Modelos extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        padrao: Sequelize.BOOLEAN,
        ativo: Sequelize.BOOLEAN,
        descricao: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/modelos/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Modelos;
