import * as Yup from 'yup';
import Local from '../models/Locais';

class LocalController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string()
        .required()
        .max(255),
      descricao: Yup.string(),
      capacidade: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const localExist = await Local.findOne({
      where: {
        nome: req.body.nome,
      },
    });

    if (localExist) {
      return res.status(400).json({ error: 'Local já cadastrada.' });
    }
    const { nome, descricao, capacidade } = await Local.create(req.body);
    return res.json({
      nome,
      descricao,
      capacidade,
    });
  }

  async update(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const local = await Local.findByPk(req.params.id);

    if (!local) {
      return res.status(400).json({ error: 'Local não encontrado.' });
    }

    await local.update(req.body);

    const localNew = await Local.findByPk(req.params.id);

    return res.json({ localNew });
  }

  async index(req, res) {
    const locais = await Local.findAll();
    return res.json(locais);
  }

  async show(req, res) {
    const locais = await Local.findByPk(req.params.id);
    return res.json(locais);
  }

  async delete(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const locais = await Local.findByPk(req.params.id);
    await locais.destroy();
    return res.json(locais);
  }
}

export default new LocalController();
