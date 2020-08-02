import pdf from 'html-pdf';
import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { resolve } from 'path';
import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import handlebars from 'handlebars';
import Eventos from '../models/Eventos';
import Modelo from '../models/Modelos';
import Assinaturas from '../models/Assinaturas';
import ListaParticipantes from '../models/ListaParticipantes';

class CertificadoController {
  async show(req, res) {
    const evento = await Eventos.findByPk(req.params.evento_id);
    if (!evento) {
      return res.status(400).json({ error: 'Evento não encontrado.' });
    }
    const modelo = await Modelo.findByPk(evento.modelo_id);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
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

    const listaParticipantes = await ListaParticipantes.findAll({
      where: {
        evento_id: req.params.evento_id,
      },
    });
    const emissao = `Tatuí, ${formattedDate}`;
    // eslint-disable-next-line array-callback-return
    const lista = listaParticipantes.map(participante => {
      // eslint-disable-next-line no-unused-vars
      let newDizeres = evento.dizeres;
      newDizeres = evento.dizeres.replace(/#participante#/, participante.nome);
      newDizeres = newDizeres.replace(/#palestrante#/, evento.palestrante);
      newDizeres = newDizeres.replace(/#evento#/, evento.titulo);
      newDizeres = newDizeres.replace(/#data#/, formattedDate);
      newDizeres = newDizeres.replace(/#horas#/, hm);
      return {
        dizeres: newDizeres,
        url: modelo.url,
        emissao,
        assDireita: assDireita.url,
        assEsquerda: assEsquerda.url,
        assCentro: assCentro.url,
      };
    });

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

    const viewPath = resolve(
      __dirname,
      '..',
      '..',
      'app',
      'views',
      'certificados'
    );

    const source = fs
      .readFileSync(resolve(viewPath, 'listacertificados.hbs'))
      .toString('utf8');

    const template = handlebars.compile(source, { strict: true });

    const result = template({
      lista,
    });

    const options = {
      format: 'A4',
      orientation: 'landscape',
      filename: 'certificado.pdf',
    };

    await createPDF(result, options);
    return res.json('fim');
  }
}

export default new CertificadoController();
