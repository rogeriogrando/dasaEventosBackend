import pdf from 'html-pdf';
import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import ValidaCertificados from '../models/ValidaCertificados';
import Evento from '../models/Eventos';
import Modelo from '../models/Modelos';
import Usuarios from '../models/Usuarios';
import Assinaturas from '../models/Assinaturas';

class ValidaCertificadoController {
  async store(req, res) {
    if (req.userPapel !== 'coordenador' && req.userPapel !== 'admin') {
      return res.status(401).json({ error: 'Usuário não possui permissão.' });
    }

    const diseres1 =
      'A Falculdade de Ensino Superior Santa Bárbara certifica que ';
    const participante = 'Afonso de Albuquerque';
    const diseres2 = ' participou do treinamento ';
    const evento = 'Explorando novas terras';
    const diseres3 = ', ministrado por ';
    const palestrante = 'Pedro Álvares Cabral';
    const cargaHoraria =
      ' com a carga horária de 02(duas) horas, realizado no dia 15 de fevereiro de 1950.';
    const entrega = 'Tatuí, 15 de fevereiro de 1950';

    const modelo = await Modelo.findByPk(req.params.id);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não encontrado.' });
    }

    const assinatura = await Assinaturas.findOne();

    const conteudo = `
    <!DOCTYPE html>
      <body>
        <div style="display: inline-block; position: relative">
          <img src=${modelo.url} margin: 0px; padding: 0px; width=100%>
          <div style="position: absolute; top: 210px; left: 100px; right: 100px; text-align: justify;">
            <h5>${diseres1}${participante}${diseres2}${evento}${diseres3}${palestrante}${cargaHoraria}</h5>
            <div style="text-align: center;">
              <h5>
                </br>
                <p>${entrega}</p>
              </h5>
            </div>
            <div style="text-align: center;">
              <h5>
                </br>
                </br>
                <img src=${assinatura.url} >
              </h5>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

    pdf
      .create(conteudo, {
        format: 'A4',
        orientation: 'landscape',
        border: 0,
      })
      .toFile(
        `./tmp/validacertificados/certificado${req.userId}.pdf`,
        // eslint-disable-next-line consistent-return
        err => {
          if (err) {
            return res.status(400).json({ error: 'Modelo não encontrado.' });
          }
        }
      );

    const oldCertificado = await ValidaCertificados.findOne({
      where: { path: `certificado${req.userId}.pdf` },
    });

    if (oldCertificado) {
      await oldCertificado.destroy();
    }

    const name = 'teste';
    const path = `certificado${req.userId}.pdf`;
    const certificado = await ValidaCertificados.create({
      name,
      path,
    });
    return res.json(certificado);
  }

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
    if (horasTotal > 1) {
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

    const conteudo = `
    <!DOCTYPE html>
      <body style="magin: 0; padding: 0;">
        <div style="display: inline-block; position: relative;">
          <img src=${modelo.url} width="1122"; height="770"; margin: 0px; padding: 0px>
          <div style="position: absolute; top: 300px; left: 100px; right: 100px; text-align: justify;">
            <h3>${newDizeres}</h3>
            <div style="text-align: center;">
              <h3>
                </br>
                <p>${emissao}</p>
              </h3>
            </div>
            <div>
              </br>
              </br>
              </br>
            <div style="text-align: center">
              <img  src=${assEsquerda.url} style="float:left"  >
              <img src=${assCentro.url}>
              <img src=${assDireita.url} style="float:right" >
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

    pdf.create(conteudo, { format: 'A4', orientation: 'landscape' }).toFile(
      `./tmp/validacertificados/certificado${req.userId}.pdf`,
      // eslint-disable-next-line consistent-return
      err => {
        if (err) {
          return res.status(400).json({ error: 'Modelo não encontrado.' });
        }
      }
    );

    const oldCertificado = await ValidaCertificados.findOne({
      where: { path: `certificado${req.userId}.pdf` },
    });

    if (oldCertificado) {
      await oldCertificado.destroy();
    }

    const name = 'teste';
    const path = `certificado${req.userId}.pdf`;
    const certificado = await ValidaCertificados.create({
      name,
      path,
    });
    return res.json(certificado);
  }
}

export default new ValidaCertificadoController();
