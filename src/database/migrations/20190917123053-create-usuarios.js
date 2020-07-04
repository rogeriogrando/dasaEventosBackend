module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usuarios', {
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
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      pass_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      telefone: {
        type: Sequelize.STRING(11),
        allowNull: true,
      },
      dados_adicionais: {
        type: Sequelize.STRING,
      },
      url_web: {
        type: Sequelize.STRING(255),
      },
      url_twiter: {
        type: Sequelize.STRING(255),
      },
      url_facebook: {
        type: Sequelize.STRING(255),
      },
      url_lattes: {
        type: Sequelize.STRING(255),
      },
      papel: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'usuario',
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
    return queryInterface.dropTable('usuarios');
  },
};
