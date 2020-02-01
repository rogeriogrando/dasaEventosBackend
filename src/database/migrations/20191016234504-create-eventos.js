module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('eventos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      sala_id: {
        type: Sequelize.INTEGER,
        references: { model: 'salas', key: 'id' },
        allowNull: false,
      },
      palestrante_id: {
        type: Sequelize.INTEGER,
        references: { model: 'usuarios', key: 'id' },
        allowNull: false,
      },
      horaini: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      horafim: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      publico: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    return queryInterface.dropTable('eventos');
  },
};
