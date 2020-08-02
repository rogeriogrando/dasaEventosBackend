import * as Yup from 'yup';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import Usuarios from '../models/Usuarios';
import authConfig from '../../config/auth';
import Mail from '../../lib/Mail';

class ResetPassword {
  async update(req, res) {
    const schema = Yup.object().shape({
      pass: Yup.string().required(),
      confirPass: Yup.string().when('pass', (pass, field) =>
        pass ? field.required().oneOf([Yup.ref('pass')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }

    try {
      const decoded = await promisify(jwt.verify)(
        req.params.token,
        authConfig.secret
      );
      const usuario = await Usuarios.findByPk(decoded.id);
      if (!usuario) {
        return res.status(401).json({ error: 'Acesso negado.' });
      }
      await usuario.update(req.body);
      return res.status(202).send({ message: 'Senha alterada com sucesso' });
    } catch (err) {
      return res.status(401).json({ error: 'Acesso negado.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }
    const { email } = req.body;

    const usuario = await Usuarios.findOne({ where: { email } });
    const { id, nome, papel } = usuario;
    const token = jwt.sign({ id, papel }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await Mail.sendMail({
      to: `${nome} <${email}>`,
      subject: 'Alteração de senha',
      template: 'resetpassword',
      context: {
        token,
        nome,
      },
    });

    return res.json({ email });
  }
}

export default new ResetPassword();
