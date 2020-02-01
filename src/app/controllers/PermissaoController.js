import * as Yup from 'yup';
import Usuario from '../models/Usuarios';

class PermissaoController {
  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      papel: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }
    const { email, papel } = req.body;

    if (req.userPapel !== 'admin') {
      return res.status(400).json({ error: 'Usuário não possui permissão.' });
    }

    if (papel !== 'coordenador' && papel !== 'usuario') {
      return res.status(400).json({ error: 'Papel inesistente.' });
    }

    await Usuario.update(req.body, {
      where: { email },
    });

    return res.status(200).json({ success: 'Alteração concluida.' });
  }
}

export default new PermissaoController();
