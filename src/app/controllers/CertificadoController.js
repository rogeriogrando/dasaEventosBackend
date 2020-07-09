import Sequelize from 'sequelize';
import pdf from 'html-pdf';
import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import Certificados from '../models/Certificados';
import Eventos from '../models/Eventos';
import Usuarios from '../models/Usuarios';
import Modelo from '../models/Modelos';
import Assinaturas from '../models/Assinaturas';
import databaseConfig from '../../config/database';

class CertificadoController {
  async store(req, res) {
    const oldCertificado = await Certificados.findOne({
      where: {
        usuario_id: req.userId,
        evento_id: req.params.evento_id,
      },
    });
    if (oldCertificado) {
      await oldCertificado.destroy();
    }

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

    const name = `certificado${req.userId}-${req.params.evento_id}.pdf`;
    const path = `certificado${req.userId}-${req.params.evento_id}.pdf`;
    const { ativo, padrao, descricao } = req.body;
    const certificado = await Certificados.create({
      name,
      padrao,
      usuario_id: req.userId,
      evento_id: req.params.evento_id,
      ativo,
      descricao,
      path,
    });

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
    } else if (horasTotal === 1) {
      horas = `${horasTotal} hora`;
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
      `./tmp/certificados/certificado${req.userId}-${req.params.evento_id}.pdf`,
      // eslint-disable-next-line consistent-return
      err => {
        if (err) {
          return res.status(400).json({ error: 'Modelo não encontrado.' });
        }
      }
    );

    return res.json(certificado);
  }

  async index(req, res) {
    const sequelize = new Sequelize(databaseConfig);
    const eventos = await sequelize.query(
      `SELECT e.id, e.palestrante, e.titulo,
              e.data as data_orig,
              to_char(e.data, 'DD/MM/YYYY') as data
      FROM eventos e
      JOIN usuario_eventos ue ON ue.evento_id = e.id
      WHERE  ue.usuario_id = :usuario AND ue.presenca = true
      ORDER BY e.data`,
      {
        replacements: { usuario: req.userId },
        model: Eventos,
        mapToModel: true,
      }
    );

    return res.json(eventos);
  }

  async show(req, res) {
    const modelo = await Certificados.findByPk(req.params.id);

    return res.json(modelo);
  }
}

export default new CertificadoController();
