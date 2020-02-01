module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('instituicoes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      cnpj: {
        type: Sequelize.STRING(18),
        allowNull: false,
      },
      razaosocial: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      fantasia: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      telefone: {
        type: Sequelize.STRING(14),
        allowNull: false,
      },
      cep: {
        type: Sequelize.STRING(8),
        allowNull: false,
      },
      cidade: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bairro: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      logradouro: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      numero: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      complemento: {
        type: Sequelize.STRING(255),
      },
      uf: {
        type: Sequelize.STRING(2),
        allowNull: false,
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
      url_img: {
        type: Sequelize.STRING(255),
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    return queryInterface.dropTable('instituicoes');
  },
};
