import * as Yup from 'yup';
import Salas from '../models/Salas';

class SalasController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string()
        .required()
        .max(255),
      numero: Yup.string()
        .required()
        .max(255),
      bloco: Yup.string()
        .required()
        .max(255),
      capacidade: Yup.number().required(),
      lousa: Yup.boolean(),
      projetor: Yup.boolean(),
      auditorio: Yup.boolean(),
      sistema_som: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const salaExist = await Salas.findOne({
      where: {
        nome: req.body.nome,
        numero: req.body.numero,
        bloco: req.body.bloco,
      },
    });

    if (salaExist) {
      return res.status(400).json({ error: 'Sala já cadastrada.' });
    }
    const {
      nome,
      numero,
      bloco,
      capacidade,
      lousa,
      projetor,
      auditorio,
      sistema_som,
    } = await Salas.create(req.body);
    return res.json({
      nome,
      numero,
      bloco,
      capacidade,
      lousa,
      projetor,
      auditorio,
      sistema_som,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().max(255),
      numero: Yup.string().max(255),
      bloco: Yup.string().max(255),
      capacidade: Yup.number(),
      lousa: Yup.boolean(),
      projetor: Yup.boolean(),
      auditorio: Yup.boolean(),
      sistema_som: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos com informações incorretas.' });
    }

    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    console.log(req.body.nome);

    const salaExist = await Salas.findOne({
      where: {
        nome: req.body.nome ? req.body.nome : '',
        numero: req.body.numero ? req.body.numero : '',
        bloco: req.body.bloco ? req.body.bloco : '',
      },
    });

    if (salaExist) {
      return res.status(400).json({ error: 'Sala já cadastrada.' });
    }

    await Salas.update(req.body, {
      where: {
        nome: req.query.nome,
        numero: req.query.numero,
        bloco: req.query.bloco,
      },
    });
    const sala = await Salas.findOne(req.body, {
      where: {
        nome: req.query.nome,
        numero: req.query.numero,
        bloco: req.query.bloco,
      },
    });

    return res.json({ sala });
  }
}

export default new SalasController();
