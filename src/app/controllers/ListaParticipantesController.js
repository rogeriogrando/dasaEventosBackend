import { resolve } from 'path';
import ListaParticipantes from '../models/ListaParticipantes';

const fs = require('fs');
const csv = require('fast-csv');

class ListaParticipantesController {
  async store(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const oldLista = await ListaParticipantes.findOne({
      where: {
        evento_id: req.body.evento_id,
      },
    });
    if (oldLista) {
      await ListaParticipantes.destroy({
        where: {
          evento_id: req.body.evento_id,
        },
      });
    }

    const { filename: name } = req.file;

    await new Promise(run => {
      fs.createReadStream(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          'tmp',
          'listaparticipantes',
          `${name}`
        )
      )
        .pipe(csv.parse({ headers: true }))
        .on('data', row => {
          ListaParticipantes.create({
            nome: row.nome,
            evento_id: req.body.evento_id,
          });
        })
        .on('end', () => {
          setTimeout(() => {
            run();
          }, 50);
        });
    });

    const lista = await ListaParticipantes.findAll({
      where: {
        evento_id: req.body.evento_id,
      },
    });
    return res.json(lista);
  }

  async update(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const participante = await ListaParticipantes.findByPk(req.params.id);

    if (!participante) {
      return res.status(400).json({ error: 'Participante não encontrado.' });
    }

    await participante.update(req.body);

    const participanteNew = await ListaParticipantes.findAll({
      where: { evento_id: participante.evento_id },
    });

    return res.json({ participanteNew });
  }

  async index(req, res) {
    const lista = await ListaParticipantes.findAll({
      where: {
        evento_id: req.params.evento_id,
      },
    });
    return res.json(lista);
  }
}

export default new ListaParticipantesController();
