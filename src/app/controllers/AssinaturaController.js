import Assinaturas from '../models/Assinaturas';

class AssinaturaController {
  async store(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const { originalname: name, filename: path } = req.file;
    const { descricao } = req.body;
    const assinatura = await Assinaturas.create({
      name,
      descricao,
      path,
    });
    return res.json(assinatura);
  }

  async update(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const { descricao } = req.body;

    const assinatura = await Assinaturas.findByPk(req.params.id);

    if (req.file) {
      const { originalname: name, filename: path } = req.file;
      await assinatura.update({
        name,
        descricao,
        path,
      });
    } else {
      await assinatura.update({
        descricao,
      });
    }

    const new_assinatura = await Assinaturas.findByPk(req.params.id);
    return res.json(new_assinatura);
  }

  async index(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const assinaturas = await Assinaturas.findAll({
      order: ['descricao'],
    });

    return res.json(assinaturas);
  }

  async show(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const assinatura = await Assinaturas.findByPk(req.params.id);

    return res.json(assinatura);
  }

  async delete(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const assinatura = await Assinaturas.findByPk(req.params.id);

    if (!assinatura) {
      return res.status(400).json({ error: 'Assinaturas não encontrado.' });
    }

    await assinatura.destroy();

    const assinaturaNew = await Assinaturas.findAll();

    return res.json({ assinaturaNew });
  }
}

export default new AssinaturaController();
