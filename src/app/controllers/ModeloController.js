import Modelo from '../models/Modelos';

class ModeloController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const modelo = await Modelo.create({
      name,
      path,
    });
    return res.json(modelo);
  }
}

export default new ModeloController();
