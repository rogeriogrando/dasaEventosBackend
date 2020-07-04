import * as Yup from 'yup';

import Cursos from '../models/Cursos';

class CursoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string()
        .required()
        .max(255),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Nome do curso é obrigatório.' });
    }

    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const cursoExist = await Cursos.findOne({
      where: {
        nome: req.body.nome,
      },
    });

    if (cursoExist) {
      return res.status(400).json({ error: 'Curso já cadastrado.' });
    }
    const nome = await Cursos.create(req.body);
    return res.json({
      nome,
    });
  }

  async index(req, res) {
    const cursos = await Cursos.findAll();
    return res.json(cursos);
  }

  async show(req, res) {
    const curso = await Cursos.findByPk(req.params.id);

    if (!curso) {
      return res.status(400).json({ error: 'Curso não encontrado.' });
    }

    return res.json(curso);
  }

  async update(req, res) {
    const curso = await Cursos.findByPk(req.params.id);

    if (!curso) {
      return res.status(400).json({ error: 'Curso não encontrado.' });
    }

    await curso.update(req.body);

    const { id, nome } = await Cursos.findByPk(req.params.id);
    return res.json({ id, nome });
  }

  async delete(req, res) {
    const curso = await Cursos.findByPk(req.params.id);
    if (!curso) {
      return res.status(400).json({ error: 'Curso não encontrado.' });
    }

    await curso.destroy();

    return res.json(curso);
  }
}

export default new CursoController();
