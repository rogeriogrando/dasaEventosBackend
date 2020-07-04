import Sequelize, { Model } from 'sequelize';

class ValidaCertificados extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/validacertificados/${this.path}`;
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

export default ValidaCertificados;
