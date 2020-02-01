import Sequelize, { Model } from 'sequelize';

class Instituicoes extends Model {
  static init(sequelize) {
    super.init(
      {
        cnpj: Sequelize.STRING(18),
        razaosocial: Sequelize.STRING(255),
        fantasia: Sequelize.STRING(255),
        telefone: Sequelize.STRING(14),
        email: Sequelize.STRING(255),
        cep: Sequelize.STRING(8),
        cidade: Sequelize.STRING(255),
        bairro: Sequelize.STRING(255),
        logradouro: Sequelize.STRING(255),
        numero: Sequelize.STRING(10),
        complemento: Sequelize.STRING(255),
        uf: Sequelize.STRING(2),
        url_web: Sequelize.STRING(255),
        url_twiter: Sequelize.STRING(255),
        url_facebook: Sequelize.STRING(255),
        url_img: Sequelize.STRING(255),
        ativo: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Instituicoes;
