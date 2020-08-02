import Sequelize, { Model } from 'sequelize';

class ListaParticipantes extends Model {
  static init(sequelize) {
    super.init(
      {
        evento_id: Sequelize.INTEGER,
        nome: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Eventos, { foreignKey: 'evento_id', as: 'evento' });
  }
}

export default ListaParticipantes;
