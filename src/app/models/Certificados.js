import Sequelize, { Model } from 'sequelize';

class Eventos extends Model {
  static init(sequelize) {
    super.init(
      {
        sala_id: Sequelize.STRING(10),
        enviado: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Salas, { foreignKey: 'sala_id', as: 'sala' });
    this.belongsTo(models.Eventos, { foreignKey: 'evento_id', as: 'evento' });
  }
}

export default Eventos;
