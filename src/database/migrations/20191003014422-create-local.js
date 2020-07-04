module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('locais', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      capacidade: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('locais');
  },
};
