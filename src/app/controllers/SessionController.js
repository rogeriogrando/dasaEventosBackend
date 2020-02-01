import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import Usuarios from '../models/Usuarios';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      pass: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }
    const { email, pass } = req.body;

    const usuario = await Usuarios.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Email ou Senha incorretos!' });
    }

    if (!(await usuario.checkPassword(pass))) {
      return res.status(401).json({ error: 'Email ou Senha incorretos!' });
    }

    const { id, nome, papel } = usuario;
    return res.json({
      usuario: { id, nome, email, papel },
      token: jwt.sign({ id, papel }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
