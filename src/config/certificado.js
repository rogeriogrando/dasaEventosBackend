import multer from 'multer';
import { resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: () => {
      resolve(__dirname, '..', '..', 'certificados');
    },
    filename: (req, file, cb) => {
      const eventoId = req.params.evento_id;
      cb(null, `certificado${req.userId}-${eventoId}.pdf`);
    },
  }),
};
