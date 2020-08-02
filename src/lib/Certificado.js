import { resolve } from 'path';
import exphbs from 'express-handlebars';

class Certificado {
  constructor() {
    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'certificados');
    this.transporter.use('compile', {
      viewEngine: exphbs.create({
        layoutsDir: resolve(viewPath, 'layouts'),
        defaultLayout: 'default',
        extname: '.hbs',
      }),
      viewPath,
      extName: '.hbs',
    });
  }
}

export default new Certificado();
