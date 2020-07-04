import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import Usuario from '../models/Usuarios';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Acesso negado.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(401).json({ error: 'Acesso negado.' });
    }

    req.userId = decoded.id;
    req.userPapel = usuario.dataValues.papel;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Acesso negado.' });
  }
};
