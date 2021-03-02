import pdf from 'html-pdf';
import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { resolve } from 'path';
import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import handlebars from 'handlebars';
import Eventos from '../models/Eventos';
import Usuarios from '../models/Usuarios';
import Modelo from '../models/Modelos';
import Assinaturas from '../models/Assinaturas';

class CertificadoController {
  async show(req, res) {
    const evento = await Eventos.findByPk(req.params.evento_id);
    const { nome } = await Usuarios.findByPk(req.userId);
    const modelo = await Modelo.findByPk(evento.modelo_id);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
    }
    if (!nome) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
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

    // eslint-disable-next-line no-unused-vars
    let newDizeres = evento.dizeres;
    newDizeres = evento.dizeres.replace(/#participante#/, nome);
    newDizeres = newDizeres.replace(/#palestrante#/, evento.palestrante);
    newDizeres = newDizeres.replace(/#evento#/, evento.titulo);
    newDizeres = newDizeres.replace(/#data#/, formattedDate);
    newDizeres = newDizeres.replace(/#horas#/, hm);

    const emissao = `Tatuí, ${formattedDate}`;

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
      .readFileSync(resolve(viewPath, 'certificado.hbs'))
      .toString('utf8');

    const template = handlebars.compile(source, { strict: true });
    const result = template({
      url: modelo.url,
      dizeres: newDizeres,
      emissao,
      assDireita: assDireita.url,
      assEsquerda: assEsquerda.url,
      assCentro: assCentro.url,
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
