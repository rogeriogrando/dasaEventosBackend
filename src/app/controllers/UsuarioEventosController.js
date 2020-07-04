import Sequelize from 'sequelize';
import databaseConfig from '../../config/database';
import Eventos from '../models/Eventos';

import UsuarioEventos from '../models/UsuarioEventos';

class UsuarioEventoController {
  async store(req, res) {
    const eventoExist = await Eventos.findByPk(req.body.evento_id);

    if (!eventoExist) {
      return res.status(400).json({ error: 'Evento não encontrado.' });
    }

    const { id, evento_id, usuario_id } = await UsuarioEventos.create({
      usuario_id: req.userId,
      evento_id: req.body.evento_id,
    });

    return res.json({
      id,
      evento_id,
      usuario_id,
    });
  }

  async delete(req, res) {
    const usuarioEvento = await UsuarioEventos.findOne({
      where: {
        evento_id: req.params.id,
        usuario_id: req.userId,
      },
    });

    if (!usuarioEvento) {
      return res.status(400).json({ error: 'Cadastro não encontrado.' });
    }

    await usuarioEvento.destroy();

    return res.json({ usuarioEvento });
  }

  async index(req, res) {
    const sequelize = new Sequelize(databaseConfig);
    const eventos = await sequelize.query(
      `SELECT e.id, e.local_id,e.curso_id, c.nome,e.palestrante, e.titulo, e.descricao,
              e.data as data_orig,
              to_char(e.data, 'DD/MM/YYYY') as data,
              to_char(e.horaini, 'HH24'||chr(58)||'MI') as horaini,
              to_char(e.horafim, 'HH24'||chr(58)||'MI') as horafim,
              l.nome, l.capacidade, count(ue.evento_id)::integer as inscritos,
             (l.capacidade - count(ue.evento_id))::integer as  restante, e.ativo
      FROM eventos e
      JOIN locais l ON e.local_id = l.id
      LEFT JOIN cursos c ON e.curso_id = c.id
      JOIN usuario_eventos ue ON ue.evento_id = e.id
      WHERE data >= now()::date AND ativo AND coalesce(ue.usuario_id,0) = :usuario
      GROUP BY e.id, e.palestrante, e.titulo, e.descricao, e.data, e.horaini, e.horafim,
               l.nome, l.capacidade, c.nome, ue.evento_id`,
      {
        replacements: { usuario: req.userId },
        model: Eventos,
        mapToModel: true,
      }
    );

    return res.json(eventos);
  }
}

export default new UsuarioEventoController();
