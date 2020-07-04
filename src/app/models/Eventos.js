import Sequelize, { Model } from 'sequelize';

class Eventos extends Model {
  static init(sequelize) {
    super.init(
      {
        palestrante: Sequelize.STRING,
        titulo: Sequelize.STRING,
        dizeres: Sequelize.STRING,
        descricao: Sequelize.STRING(255),
        local_id: Sequelize.INTEGER,
        curso_id: Sequelize.INTEGER,
        modelo_id: Sequelize.INTEGER,
        data: Sequelize.DATE,
        horaini: Sequelize.TIME,
        horafim: Sequelize.TIME,
        publico: Sequelize.BOOLEAN,
        ativo: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Locais, { foreignKey: 'local_id', as: 'local' });
    this.belongsTo(models.Cursos, { foreignKey: 'curso_id', as: 'curso' });
    this.belongsTo(models.Modelos, { foreignKey: 'modelo_id', as: 'modelo' });
    this.belongsTo(models.Assinaturas, {
      foreignKey: 'assinatura_left_id',
      as: 'left',
    });
    this.belongsTo(models.Assinaturas, {
      foreignKey: 'assinatura_center_id',
      as: 'center',
    });
    this.belongsTo(models.Assinaturas, {
      foreignKey: 'assinatura_right_id',
      as: 'right',
    });
  }
}

export default Eventos;
