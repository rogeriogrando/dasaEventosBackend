import * as Yup from 'yup';
import { Op } from 'sequelize';
import Eventos from '../models/Eventos';
import Salas from '../models/Salas';
import Usuarios from '../models/Usuarios';

class EventoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      descricao: Yup.string()
        .required()
        .max(255),
      sala_id: Yup.number().required(),
      palestrante_id: Yup.number().required(),
      data: Yup.date('DD-MM-YYYY').required(),
      horaini: Yup.string().required(),
      horafim: Yup.string().required(),
      publico: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }

    const salaExist = await Salas.findByPk(req.body.sala_id);

    if (!salaExist) {
      return res.status(401).json({ error: 'Sala não encontrada.' });
    }

    const palestranteExist = await Usuarios.findByPk(req.body.palestrante_id);

    if (!palestranteExist) {
      return res.status(401).json({ error: 'Palestrante não encontrado.' });
    }

    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const eventoExist = await Eventos.findOne({
      where: {
        sala_id: req.body.sala_id,
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
      descricao,
      data,
      sala_id,
      palestrante_id,
      horaini,
      horafim,
      publico,
    } = await Eventos.create(req.body);
    return res.json({
      id,
      descricao,
      sala_id,
      palestrante_id,
      data,
      horaini,
      horafim,
      publico,
    });
  }

  async index(req, res) {
    const eventos = await Eventos.findAll({
      include: [
        {
          model: Usuarios,
          as: 'palestrante',
          attributes: ['nome'],
        },
        {
          model: Salas,
          as: 'sala',
          attributes: ['nome', 'numero', 'bloco'],
        },
      ],
      where: {
        data: {
          [Op.gte]: new Date(),
        },
      },
    });
    return res.json(eventos);
  }
}

export default new EventoController();
