import multer from 'multer';
import { resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'validacertificados'),
    filename: (req, file, cb) => {
      cb(null, `certificado${req.userId}.pdf`);
    },
  }),
};
