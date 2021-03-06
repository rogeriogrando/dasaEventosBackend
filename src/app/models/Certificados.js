import Sequelize, { Model } from 'sequelize';

class Certificados extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        evento_id: Sequelize.INTEGER,
        usuario_id: Sequelize.INTEGER,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/certificados/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Eventos, { foreignKey: 'evento_id', as: 'evento' });
    this.belongsTo(models.Usuarios, {
      foreignKey: 'usuario_id',
      as: 'usuario',
    });
  }
}

export default Certificados;
