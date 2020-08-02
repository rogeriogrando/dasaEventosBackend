import pdf from 'html-pdf';
import { resolve } from 'path';
import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import handlebars from 'handlebars';
import Modelo from '../models/Modelos';
import Assinaturas from '../models/Assinaturas';

class ValidaCertificadoController {
  async show(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const emissao = 'Tatuí, 15 de fevereiro de 1950';
    const dizeres =
      'A Falculdade de Ensino Superior Santa Bárbara certifica que Afonso de Albuquerque participou do treinamento Explorando novas terras, ministrado por Pedro Álvares Cabral  com a carga horária de 02(duas) horas, realizado no dia 15 de fevereiro de 1950.';

    const modelo = await Modelo.findByPk(req.params.id);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
    }

    const assinatura = await Assinaturas.findOne();

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
      dizeres,
      emissao,
      assEsquerda: '',
      assCentro: assinatura,
      assDireita: '',
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

export default new ValidaCertificadoController();
