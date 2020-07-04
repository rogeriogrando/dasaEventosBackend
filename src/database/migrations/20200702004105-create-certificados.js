module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('certificados', {
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
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    return queryInterface.dropTable('certificados');
  },
};
