import { resolve } from 'path';
import { Promise } from 'bluebird';
import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import fs from 'fs';
import Eventos from '../models/Eventos';
import Modelo from '../models/Modelos';
import ListaParticipantes from '../models/ListaParticipantes';
import Assinaturas from '../models/Assinaturas';

// const pdf = require('html-pdf');
const pdf = Promise.promisifyAll(require('html-pdf'));
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
    let horasTotal = parseInt(hFim[0], 10) - parseInt(hIni[0], 10);
    let minutoTotal = parseInt(hFim[1], 10) - parseInt(hIni[1], 10);

    if (minutoTotal < 0) {
      minutoTotal = 60 + minutoTotal;
      horasTotal = horasTotal -1;
    }

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
    return Promise.all(
      participantes.map(async participante => {
        let newDizeres = evento.dizeres;
        newDizeres = evento.dizeres.replace(
          /#participante#/,
          participante.nome
        );
        newDizeres = newDizeres.replace(/#palestrante#/, evento.palestrante);
        newDizeres = newDizeres.replace(/#evento#/, evento.titulo);
        newDizeres = newDizeres.replace(/#data#/, formattedDate);
        newDizeres = newDizeres.replace(/#horas#/, hm);

        const emissao = `Tatuí, ${formattedDate}`;

        const createPDF = (conteudo, options) =>
          new Promise((resolved, reject) => {
            pdf
              .create(conteudo, options)
              .toFile(
                `./tmp/certificados/certificado${req.userId}-${req.body.evento_id}-${participante.id}.pdf`,
                (err, file) => {
                  if (err !== null) {
                    reject(err);
                  } else {
                    resolved(file);
                  }
                }
              );
          });

        const options = {
          format: 'A4',
          orientation: 'landscape',
        };
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
        await createPDF(conteudo, options);

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

        archive.finalize();
        return res.json('fim');
      })
    );
  }

  async show(req, res) {
    const evento = await Eventos.findByPk(req.body.evento_id);
    const modelo = await Modelo.findByPk(evento.modelo_id);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
    }
    if (!evento) {
      return res.status(400).json({ error: 'Evento não encontrado.' });
    }

    const createPDF = (conteudo, options) =>
      new Promise((resolved, reject) => {
        pdf
          .create(conteudo, options)
          .toFile(
            `./tmp/certificados/certificado${req.userId}-${req.body.evento_id}.pdf`,
            (err, file) => {
              if (err !== null) {
                reject(err);
              } else {
                resolved(file);
              }
            }
          );
      });

    const conteudo = `
      <!DOCTYPE html>
        aaaaaaa
      </html>
      `;
    const options = {
      format: 'Letter',
      orientation: 'landscape',
      filename: 'test.pdf',
    };
    await createPDF(conteudo, options);
    return res.json('fim');
  }

  async index(req, res) {
    const evento = await Eventos.findByPk(req.body.evento_id);
    const modelo = await Modelo.findByPk(evento.modelo_id);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
    }
    if (!evento) {
      return res.status(400).json({ error: 'Evento não encontrado.' });
    }

    const createPDF = (conteudo, options) =>
      new Promise((resolved, reject) => {
        pdf.create(conteudo, options).toBuffer((err, buffer) => {
          if (err !== null) {
            reject(err);
          } else {
            resolved(buffer);
            res.set('Content-Type', 'application/pdf');
            res.send(buffer);
          }
        });
      });

    const conteudo = `
      <!DOCTYPE html>
        aaaaaaa
      </html>
      `;
    const options = {
      format: 'Letter',
      orientation: 'landscape',
      filename: 'test.pdf',
    };
    await createPDF(conteudo, options);
    return res.json('fim');
  }
}

export default new CertificadoListaController();
