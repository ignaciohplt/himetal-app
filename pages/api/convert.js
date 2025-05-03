import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al recibir archivo.' });
    }

    const filePath = files.file.filepath;
    const fileName = files.file.originalFilename;

    const fakeDxfPath = path.join(process.cwd(), 'public', fileName.replace(/\.jpg$/, '.dxf'));
    fs.copyFileSync(filePath, fakeDxfPath); // Simula la conversión

    res.status(200).json({ message: 'Archivo convertido. Enviado por WhatsApp.' });
  });
}