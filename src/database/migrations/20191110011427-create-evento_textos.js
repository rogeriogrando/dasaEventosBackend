module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('evento_textos', {
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
      modelo_id: {
        type: Sequelize.INTEGER,
        references: { model: 'modelos', key: 'id' },
        allowNull: false,
      },
      textoTopo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      textoMeioIni: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      textoMeioFim: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      textoRef: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      textoData: {
        type: Sequelize.STRING,
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
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('evento_textos');
  },
};
