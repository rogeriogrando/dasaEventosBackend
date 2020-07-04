import Sequelize, { Model } from 'sequelize';

class UsuarioEventos extends Model {
  static init(sequelize) {
    super.init(
      {
        evento_id: Sequelize.INTEGER,
        usuario_id: Sequelize.INTEGER,
        presenca: Sequelize.BOOLEAN,
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

export default UsuarioEventos;
