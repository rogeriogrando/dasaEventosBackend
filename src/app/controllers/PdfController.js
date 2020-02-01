import PDFKit from 'pdfkit';
import fs from 'fs';

class PdfController {
  async index() {
    const pdf = new PDFKit({
      size: 'legal',
      layout: 'landscape',
    });

    pdf.image('src/pdfModelos/modelo3.png', 15, 15, {
      fit: [800, 600],
    });
    pdf.text(
      'A faculdade de Ensino Superior Santa Bárbara - FAESB, certifica que',
      100,
      300,
      {
        align: 'center',
      }
    );

    pdf.pipe(fs.createWriteStream('src/pdfFile/output.pdf'));
    pdf.end();
  }
}
export default new PdfController();
