import * as Yup from 'yup';
import Sequelize, { Op } from 'sequelize';
import Eventos from '../models/Eventos';
import Locais from '../models/Locais';
import databaseConfig from '../../config/database';

class EventoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      descricao: Yup.string()
        .required()
        .max(255),
      dizeres: Yup.string().required(),
      local_id: Yup.number().required(),
      modelo_id: Yup.number(),
      palestrante: Yup.string().required(),
      data: Yup.date('DD-MM-YYYY').required(),
      horaini: Yup.string().required(),
      horafim: Yup.string().required(),
      ativo: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }

    const localExist = await Locais.findByPk(req.body.local_id);

    if (!localExist) {
      return res.status(401).json({ error: 'Local não encontrada.' });
    }

    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const eventoExist = await Eventos.findOne({
      where: {
        local_id: req.body.local_id,
        data: req.body.data,
        [Op.or]: {
          horaini: {
            [Op.between]: [req.body.horaini, req.body.horafim],
          },
          horafim: {
            [Op.between]: [req.body.horaini, req.body.horafim],
          },
        },
      },
    });

    if (eventoExist) {
      return res.status(400).json({ error: 'Já existe um evento agendado.' });
    }
    const {
      id,
      palestrante,
      titulo,
      descricao,
      dizeres,
      data,
      local_id,
      curso_id,
      modelo_id,
      horaini,
      horafim,
      publico,
      ativo,
    } = await Eventos.create(req.body);
    return res.json({
      id,
      palestrante,
      titulo,
      descricao,
      dizeres,
      data,
      local_id,
      curso_id,
      modelo_id,
      horaini,
      horafim,
      publico,
      ativo,
    });
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
             (l.capacidade - count(ue.evento_id))::integer as  restante, e.ativo, e.dizeres,
              m.descricao as modelo_descricao, e.modelo_id
      FROM eventos e
      JOIN locais l ON e.local_id = l.id
      LEFT JOIN cursos c ON e.curso_id = c.id
      LEFT JOIN usuario_eventos ue ON ue.evento_id = e.id
      LEFT JOIN modelos m ON m.id = e.modelo_id
      WHERE e.data >= CAST(now() as date) - interval '1 day' AND e.ativo
        AND  e.id NOT IN ( SELECT evento_id FROM usuario_eventos WHERE usuario_id = :usuario)
      GROUP BY e.id, e.palestrante, e.titulo, e.descricao, e.data, e.horaini, e.horafim,
               l.nome, l.capacidade, c.nome, ue.evento_id, m.descricao, e.modelo_id
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
    const sequelize = new Sequelize(databaseConfig);
    const eventos = await sequelize.query(
      `SELECT e.id, e.local_id,e.curso_id, c.nome,e.palestrante, e.titulo, e.descricao,
      e.data as data_orig,
      to_char(e.data, 'DD/MM/YYYY') as data,
      to_char(e.horaini, 'HH24'||chr(58)||'MI') as horaini,
      to_char(e.horafim, 'HH24'||chr(58)||'MI') as horafim,
      l.nome, l.capacidade, count(ue.evento_id)::integer as inscritos,
     (l.capacidade - count(ue.evento_id))::integer as  restante, e.ativo, e.dizeres,
      m.descricao as modelo_descricao, e.modelo_id
FROM eventos e
JOIN locais l ON e.local_id = l.id
LEFT JOIN cursos c ON e.curso_id = c.id
LEFT JOIN usuario_eventos ue ON ue.evento_id = e.id
LEFT JOIN modelos m ON m.id = e.modelo_id
WHERE data >= now()::date AND e.ativo AND e.curso_id = :curso
  AND  e.id NOT IN ( SELECT evento_id FROM usuario_eventos WHERE usuario_id = :usuario)
GROUP BY e.id, e.palestrante, e.titulo, e.descricao, e.data, e.horaini, e.horafim,
       l.nome, l.capacidade, c.nome, ue.evento_id,  m.descricao, e.modelo_id
       ORDER BY e.data`,
      {
        replacements: { usuario: req.userId, curso: req.params.id },
        model: Eventos,
        mapToModel: true,
      }
    );
    return res.json(eventos);
  }

  async update(req, res) {
    const evento = await Eventos.findByPk(req.params.id);

    if (!evento) {
      return res.status(400).json({ error: 'Evento não encontrado.' });
    }

    await evento.update(req.body);

    const new_evento = await Eventos.findByPk(req.params.id);
    return res.json(new_evento);
  }
}

export default new EventoController();
