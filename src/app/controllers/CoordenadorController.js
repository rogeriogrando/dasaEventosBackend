import Usuarios from '../models/Usuarios';

class CoordenadorController {
  async update(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const usuario = await Usuarios.findByPk(req.params.id);

    if (!usuario) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }
    await usuario.update({ papel: 'coordenador' });
    return res.json(usuario);
  }

  async delete(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const usuario = await Usuarios.findByPk(req.params.id);

    if (!usuario) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }
    await usuario.update({ papel: 'usuario' });
    return res.json(usuario);
  }

  async index(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const usuarios = await Usuarios.findAll({
      where: {
        papel: 'coordenador',
      },
    });

    return res.json({ usuarios });
  }

  async show(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const usuario = await Usuarios.findOne({
      where: {
        papel: 'usuario',
        email: req.params.email,
      },
    });

    return res.json({ usuario });
  }
}

export default new CoordenadorController();
