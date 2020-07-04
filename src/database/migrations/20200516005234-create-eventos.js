module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('eventos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      palestrante: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      local_id: {
        type: Sequelize.INTEGER,
        references: { model: 'locais', key: 'id' },
        allowNull: false,
      },
      curso_id: {
        type: Sequelize.INTEGER,
        references: { model: 'cursos', key: 'id' },
        allowNull: true,
      },
      modelo_id: {
        type: Sequelize.INTEGER,
        references: { model: 'modelos', key: 'id' },
        allowNull: true,
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
      ativo: {
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
