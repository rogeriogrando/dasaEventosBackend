import Modelo from '../models/Modelos';

class ModeloController {
  async store(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const { originalname: name, filename: path } = req.file;
    const { ativo, padrao, descricao } = req.body;
    const modelo = await Modelo.create({
      name,
      padrao,
      ativo,
      descricao,
      path,
    });
    return res.json(modelo);
  }

  async update(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const { ativo, padrao, descricao } = req.body;

    const modelo = await Modelo.findByPk(req.params.id);

    if (req.file) {
      const { originalname: name, filename: path } = req.file;
      await modelo.update({
        name,
        padrao,
        ativo,
        descricao,
        path,
      });
    } else {
      await modelo.update({
        padrao,
        ativo,
        descricao,
      });
    }

    const new_modelo = await Modelo.findByPk(req.params.id);
    return res.json(new_modelo);
  }

  async index(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const modelos = await Modelo.findAll({
      where: {
        ativo: true,
      },
      order: ['descricao'],
    });

    return res.json(modelos);
  }

  async show(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const modelo = await Modelo.findByPk(req.params.id);

    return res.json(modelo);
  }

  async delete(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const modelo = await Modelo.findByPk(req.params.id);

    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
    }

    await modelo.update({ ativo: false });

    const modeloNew = await Modelo.findByPk(req.params.id);

    return res.json({ modeloNew });
  }
}

export default new ModeloController();
