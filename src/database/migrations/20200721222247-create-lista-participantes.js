module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('lista_participantes', {
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
      nome: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('lista_participantes');
  },
};
