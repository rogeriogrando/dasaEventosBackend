import Sequelize from 'sequelize';
import databaseConfig from '../../config/database';
import UsuarioEventos from '../models/UsuarioEventos';
import Usuarios from '../models/Usuarios';
import Eventos from '../models/Eventos';

class UsuarioEventoPresencaController {
  async store(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const cadatro = await UsuarioEventos.findByPk(req.params.id);

    if (!cadatro) {
      return res.status(400).json({ error: 'Cadastro não encontrado.' });
    }

    await cadatro.update({ presenca: true });

    const cadastroNew = await UsuarioEventos.findByPk(req.params.id);

    return res.json({ cadastroNew });
  }

  async delete(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const cadatro = await UsuarioEventos.findByPk(req.params.id);

    if (!cadatro) {
      return res.status(400).json({ error: 'Cadastro não encontrado.' });
    }

    await cadatro.update({ presenca: false });

    const cadastroNew = await UsuarioEventos.findByPk(req.params.id);

    return res.json({ cadastroNew });
  }

  async index(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const usuarioEvento = await UsuarioEventos.findAll({
      include: [
        {
          model: Usuarios,
          as: 'usuario',
          attributes: ['nome', 'email'],
        },
      ],
      where: {
        evento_id: req.params.evento_id,
      },
      order: [[{ model: Usuarios, as: 'usuario' }, 'nome', 'ASC']],
    });

    if (!usuarioEvento) {
      return res.status(400).json({ error: 'Cadastro não encontrado.' });
    }

    return res.json({ usuarioEvento });
  }

  async show(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const sequelize = new Sequelize(databaseConfig);
    const eventos = await sequelize.query(
      `SELECT e.id, e.local_id,e.curso_id, c.nome,e.palestrante, e.titulo, e.descricao,
              e.data as data_orig,
              to_char(e.data, 'DD/MM/YYYY') as data,
              to_char(e.horaini, 'HH24'||chr(58)||'MM') as horaini,
              to_char(e.horafim, 'HH24'||chr(58)||'MM') as horafim,
              l.nome
      FROM eventos e
      JOIN locais l ON e.local_id = l.id
      LEFT JOIN cursos c ON e.curso_id = c.id
      WHERE data between now()::date - interval '7 day' AND now()::date
        AND ativo`,
      {
        model: Eventos,
        mapToModel: true,
      }
    );

    if (!eventos) {
      return res.status(400).json({ error: 'Eventos não encontrado.' });
    }

    return res.json({ eventos });
  }
}

export default new UsuarioEventoPresencaController();
