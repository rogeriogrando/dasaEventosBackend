import * as Yup from 'yup';
import Usuario from '../models/Usuarios';

class UsuarioController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      pass: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }

    const usuarioExist = await Usuario.findOne({
      where: { email: req.body.email },
    });

    if (usuarioExist) {
      return res.status(400).json({ error: 'Usuário já cadastrado.' });
    }
    const {
      nome,
      email,
      telefone,
      dados_adicionais,
      url_web,
      url_twiter,
      url_facebook,
      url_lattes,
    } = await Usuario.create(req.body);
    return res.json({
      nome,
      email,
      telefone,
      dados_adicionais,
      url_web,
      url_twiter,
      url_facebook,
      url_lattes,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      oldPass: Yup.string().min(6),
      pass: Yup.string()
        .min(6)
        .when('oldPass', (oldPass, field) =>
          oldPass ? field.required() : field
        ),
      confirPass: Yup.string().when('pass', (pass, field) =>
        pass ? field.required().oneOf([Yup.ref('pass')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }
    const { email, oldPass } = req.body;

    const usuario = await Usuario.findByPk(req.userId);

    if (email !== usuario.email) {
      const userExists = await Usuario.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Usuário já cadastrado.' });
      }
    }
    if (oldPass && !(await usuario.checkPassword(oldPass))) {
      return res.status(400).json({ error: 'A senha antiga não confere.' });
    }

    const {
      nome,
      telefone,
      dados_adicionais,
      avatar,
      url_web,
      url_twiter,
      url_facebook,
      url_lattes,
      papel,
    } = await usuario.update(req.body);
    return res.json({
      nome,
      email,
      telefone,
      dados_adicionais,
      avatar,
      url_web,
      url_twiter,
      url_facebook,
      url_lattes,
      papel,
    });
  }
}

export default new UsuarioController();
