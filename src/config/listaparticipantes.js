import multer from 'multer';
import { resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'listaparticipantes'),
    filename: (req, file, cb) => {
      cb(null, `listaparticipantes${req.userId}.csv`);
    },
  }),
};
