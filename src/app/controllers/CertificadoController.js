import Sequelize from 'sequelize';
import Certificados from '../models/Certificados';
import Eventos from '../models/Eventos';
import databaseConfig from '../../config/database';

class CertificadoController {
  async index(req, res) {
    const sequelize = new Sequelize(databaseConfig);
    const eventos = await sequelize.query(
      `SELECT e.id, e.palestrante, e.titulo,
              e.data as data_orig,
              to_char(e.data, 'DD/MM/YYYY') as data
      FROM eventos e
      JOIN usuario_eventos ue ON ue.evento_id = e.id
      WHERE  ue.usuario_id = :usuario AND ue.presenca = true
      ORDER BY e.data`,
      {
        replacements: { usuario: req.userId },
        model: Eventos,
        mapToModel: true,
      }
    );

    return res.json(eventos);
  }

  async show(req, res) {
    const modelo = await Certificados.findByPk(req.params.id);

    return res.json(modelo);
  }
}

export default new CertificadoController();
