module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'salas',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        numero: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        bloco: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        capacidade: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        lousa: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        projetor: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        auditorio: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        sistema_som: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        uniqueKeys: [
          {
            fields: ['nome', 'numero', 'bloco'],
          },
        ],
      }
    );
  },

  down: queryInterface => {
    return queryInterface.dropTable('salas');
  },
};
