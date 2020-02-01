import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Usuarios extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING(255),
        email: Sequelize.STRING(255),
        pass: Sequelize.STRING(255),
        telefone: Sequelize.STRING(11),
        dados_adicionais: Sequelize.STRING,
        papel: Sequelize.STRING(20),
        url_web: Sequelize.STRING(255),
        url_twiter: Sequelize.STRING(255),
        url_facebook: Sequelize.STRING(255),
        url_lattes: Sequelize.STRING(255),
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async usuario => {
      if (usuario.pass) {
        usuario.pass = await bcrypt.hash(usuario.pass, 8);
      }
    });
    return this;
  }

  checkPassword(pass) {
    return bcrypt.compare(pass, this.pass);
  }
}

export default Usuarios;
