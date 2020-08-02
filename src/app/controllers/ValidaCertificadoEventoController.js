import pdf from 'html-pdf';
import { parseISO, format } from 'date-fns';
import { resolve } from 'path';
import fs from 'fs';
import { pt } from 'date-fns/locale';
// eslint-disable-next-line import/no-extraneous-dependencies
import handlebars from 'handlebars';
import Evento from '../models/Eventos';
import Modelo from '../models/Modelos';
import Usuarios from '../models/Usuarios';
import Assinaturas from '../models/Assinaturas';

class ValidaCertificadoEventoController {
  async show(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }
    const evento = await Evento.findByPk(req.params.id);
    const { nome } = await Usuarios.findByPk(req.userId);

    if (!evento) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
    }

    const modelo = await Modelo.findByPk(evento.modelo_id);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
    }

    if (!evento) {
      return res.status(400).json({ error: 'Evento não encontrado.' });
    }

    if (
      evento.assinatura_left_id === null &&
      evento.assinatura_center_id === null &&
      evento.assinatura_right_id === null
    ) {
      return res.status(400).json({ error: 'Assinatura é obrigatória.' });
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

export default new ValidaCertificadoEventoController();
