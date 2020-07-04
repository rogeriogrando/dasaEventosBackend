module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usuario_eventos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      evento_id: {
        type: Sequelize.INTEGER,
        references: { model: 'eventos', key: 'id' },
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: { model: 'usuarios', key: 'id' },
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('usuario_eventos');
  },
};
