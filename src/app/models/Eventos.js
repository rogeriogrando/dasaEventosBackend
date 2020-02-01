import Sequelize, { Model } from 'sequelize';

class Eventos extends Model {
  static init(sequelize) {
    super.init(
      {
        descricao: Sequelize.STRING(255),
        palestrante_id: Sequelize.INTEGER,
        sala_id: Sequelize.INTEGER,
        data: Sequelize.DATE,
        horaini: Sequelize.TIME,
        horafim: Sequelize.TIME,
        publico: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Salas, { foreignKey: 'sala_id', as: 'sala' });
    this.belongsTo(models.Usuarios, {
      foreignKey: 'palestrante_id',
      as: 'palestrante',
    });
  }
}

export default Eventos;
