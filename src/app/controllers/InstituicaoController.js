import * as Yup from 'yup';
import Instituicao from '../models/Instituicoes';

class InstituicaoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.string()
        .required()
        .max(18),
      razaosocial: Yup.string().required(),
      fantasia: Yup.string().required(),
      telefone: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      cep: Yup.string()
        .required()
        .max(8),
      cidade: Yup.string().required(),
      bairro: Yup.string().required(),
      logradouro: Yup.string().required(),
      numero: Yup.string().required(),
      complemento: Yup.string(),
      uf: Yup.string()
        .required()
        .max(2),
      url_web: Yup.string(),
      url_twiter: Yup.string(),
      url_facebook: Yup.string(),
      url_img: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }

    const instituicaoExist = await Instituicao.findOne({
      where: { cnpj: req.body.cnpj },
    });

    if (instituicaoExist) {
      return res.status(400).json({ error: 'Instituição já cadastrada.' });
    }
    const {
      cnpj,
      razaosocial,
      fantasia,
      telefone,
      email,
      cep,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento,
      uf,
      url_web,
      url_twiter,
      url_facebook,
      url_img,
    } = await Instituicao.create(req.body);
    return res.json({
      cnpj,
      razaosocial,
      fantasia,
      telefone,
      email,
      cep,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento,
      uf,
      url_web,
      url_twiter,
      url_facebook,
      url_img,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.string()
        .required()
        .max(18),
      razaosocial: Yup.string().required(),
      fantasia: Yup.string().required(),
      telefone: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      cep: Yup.string()
        .required()
        .max(8),
      cidade: Yup.string().required(),
      bairro: Yup.string().required(),
      logradouro: Yup.string().required(),
      numero: Yup.string().required(),
      complemento: Yup.string(),
      uf: Yup.string()
        .required()
        .max(2),
      url_web: Yup.string(),
      url_twiter: Yup.string(),
      url_facebook: Yup.string(),
      url_img: Yup.string(),
      ativo: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }
    const { cnpj } = req.body;

    const instituicao = await Instituicao.findOne({ where: { cnpj } });

    if (cnpj !== instituicao.cnpj) {
      const userExists = await Instituicao.findOne({ where: { cnpj } });
      if (userExists) {
        return res.status(400).json({ error: 'Instituição já cadastrada.' });
      }
    }
    const {
      razaosocial,
      fantasia,
      telefone,
      email,
      cep,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento,
      uf,
      url_web,
      url_twiter,
      url_facebook,
      url_img,
      ativo,
    } = await instituicao.update(req.body);
    return res.json({
      cnpj,
      razaosocial,
      fantasia,
      telefone,
      email,
      cep,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento,
      uf,
      url_web,
      url_twiter,
      url_facebook,
      url_img,
      ativo,
    });
  }
}

export default new InstituicaoController();
