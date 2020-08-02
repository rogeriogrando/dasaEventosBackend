import Sequelize from 'sequelize';
import Eventos from '../models/Eventos';
import databaseConfig from '../../config/database';

class EventoController {
  async index(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const sequelize = new Sequelize(databaseConfig);
    const eventos = await sequelize.query(
      `SELECT e.id, e.local_id,e.curso_id, e.titulo, to_char(e.data, 'DD/MM/YYYY') as data
      FROM eventos e
      ORDER BY e.data DESC`,
      {
        replacements: { usuario: req.userId },
        model: Eventos,
        mapToModel: true,
      }
    );

    return res.json(eventos);
  }
}

export default new EventoController();
