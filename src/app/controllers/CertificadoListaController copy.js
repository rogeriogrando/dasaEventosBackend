import { resolve } from 'path';
import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Promise } from 'bluebird';
import fs from 'fs';
import ListaParticipantes from '../models/ListaParticipantes';
import Eventos from '../models/Eventos';
import Modelo from '../models/Modelos';
import Assinaturas from '../models/Assinaturas';

const pdf = require('html-pdf');

const archiver = require('archiver');

class CertificadoListaController {
  async store(req, res) {
    const evento = await Eventos.findByPk(req.body.evento_id);
    const modelo = await Modelo.findByPk(evento.modelo_id);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
    }
    if (!evento) {
      return res.status(400).json({ error: 'Evento não encontrado.' });
    }

    let assEsquerda = await Assinaturas.findByPk(evento.assinatura_left_id);
    if (!assEsquerda) {
      assEsquerda = '';
    }

    let assCentro = await Assinaturas.findByPk(evento.assinatura_center_id);
    if (!assCentro) {
      assCentro = '';
    }

    let assDireita = await Assinaturas.findByPk(evento.assinatura_right_id);
    if (!assDireita) {
      assDireita = '';
    }

    const formattedDate = format(
      parseISO(evento.data),
      "dd 'de' MMMM 'de' yyyy'",
      {
        locale: pt,
      }
    );

    const hIni = evento.horaini.split(':');
    const hFim = evento.horafim.split(':');
    const horasTotal = parseInt(hFim[0], 10) - parseInt(hIni[0], 10);
    const minutoTotal = parseInt(hFim[1], 10) - parseInt(hIni[1], 10);

    let horas = '';
    if (horasTotal === 1) {
      horas = `${horasTotal} hora`;
    } else if (horasTotal > 1) {
      horas = `${horasTotal} horas`;
    } else {
      horas = '';
    }

    let minutos = '';
    if (minutoTotal > 0) {
      minutos = `${minutoTotal} minutos`;
    } else {
      minutos = '';
    }
    let hm = '';
    if (horas !== '' && minutos !== '') {
      hm = `${horas} e ${minutos}`;
    } else {
      hm = `${horas} ${minutos}`;
    }

    const participantes = await ListaParticipantes.findAll({
      where: {
        evento_id: req.body.evento_id,
      },
    });

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.pipe(
      fs.createWriteStream(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          'tmp',
          'certificados',
          `certificado${req.userId}-${req.body.evento_id}.zip`
        )
      )
    );

    // eslint-disable-next-line array-callback-return
    participantes.map(participante => {
      // eslint-disable-next-line no-unused-vars
      let newDizeres = evento.dizeres;
      newDizeres = evento.dizeres.replace(/#participante#/, participante.nome);
      newDizeres = newDizeres.replace(/#palestrante#/, evento.palestrante);
      newDizeres = newDizeres.replace(/#evento#/, evento.titulo);
      newDizeres = newDizeres.replace(/#data#/, formattedDate);
      newDizeres = newDizeres.replace(/#horas#/, hm);

      const emissao = `Tatuí, ${formattedDate}`;

      const conteudo = `
      <!DOCTYPE html>
        <body style="magin: 0; padding: 0;">
          <div style="display: inline-block; position: relative;">
            <img src=${modelo.url} margin: 0px; padding: 0px; width=100%>
            <div style="position: absolute; top: 210px; left: 100px; right: 100px; text-align: justify;">
              <h5>${newDizeres}</h5>
              <div style="text-align: center;">
                <h5>
                  </br>
                  <p>${emissao}</p>
                </h5>
              </div>
              <div>
                <h5>
                  </br>
                  </br>
                  <div style="text-align: center">
                    <img  src=${assEsquerda.url} style="float:left"  >
                    <img src=${assCentro.url}>
                    <img src=${assDireita.url} style="float:right" >
                  </div>
                </h5>
              </div>
            </div>
          </div>
        </body>
      </html>
      `;
      // eslint-disable-next-line no-new

      pdf.create(conteudo, { format: 'A4', orientation: 'landscape' }).toFile(
        `./tmp/certificados/certificado${req.userId}-${req.body.evento_id}-${participante.id}.pdf`,
        // eslint-disable-next-line consistent-return
        err => {
          if (err) {
            return res.status(400).json({ error: 'Modelo não encontrado.' });
          }
        }
      );
    });

    const promise1 = new Promise(resolved => {
      setTimeout(() => {
        resolved('Esperando');
      }, 5000);
    });

    promise1.then(() => {
      // eslint-disable-next-line array-callback-return
      participantes.map(participante => {
        archive.file(
          resolve(
            __dirname,
            '..',
            '..',
            '..',
            'tmp',
            'certificados',
            `certificado${req.userId}-${req.body.evento_id}-${participante.id}.pdf`
          ),
          {
            name: `certificado${req.userId}-${req.body.evento_id}-${participante.id}.pdf`,
          }
        );
      });
      archive.finalize();
    });

    return res.json('fim');
  }
}

export default new CertificadoListaController();
