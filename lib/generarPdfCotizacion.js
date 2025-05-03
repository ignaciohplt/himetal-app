// lib/generarPdfCotizacion.js
import PDFDocument from 'pdfkit';

/**
 * Genera una cotización en formato factura estilo profesional.
 * @param {Object} params
 * @param {string} params.numero       - Número de cotización
 * @param {Date}   params.fecha        - Fecha de la cotización
 * @param {Array}  params.items        - Lista de ítems con {descripcion, cantidad, espesorMm, subTotalUsd, totalArs}
 * @param {Object} params.resumen      - Totales {subTotalUsd, ivaPct, totalArs}
 * @param {Object} params.empresa      - Datos de la empresa {nombre, direccion, telefono, email, logoPath}
 * @param {string} params.condiciones  - Condiciones de venta
 * @returns {Promise<Buffer>}
 */
export default function generarPdfCotizacion({
  numero = '',
  fecha = new Date(),
  items = [],
  resumen = { subTotalUsd: 0, ivaPct: 21, totalArs: 0 },
  empresa = { nombre: '', direccion: '', telefono: '', email: '', logoPath: null },
  condiciones = ''
}) {
  return new Promise(resolve => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    const { width, margins } = doc.page;
    let y = margins.top;

    // Header
    doc.font('Helvetica-Bold').fontSize(18).text(`COTIZACIÓN N° ${numero}`, margins.left, y);
    doc.font('Helvetica').fontSize(10).text(`Fecha: ${fecha.toLocaleDateString()}`, width - margins.right - 150, y);
    y += 30;

    // Empresa
    doc.font('Helvetica-Bold').fontSize(12).text(empresa.nombre, margins.left, y);
    doc.font('Helvetica').fontSize(9)
      .text(empresa.direccion, margins.left, y + 12)
      .text(`Tel: ${empresa.telefono} | Email: ${empresa.email}`, margins.left, y + 24);
    y += 50;

    // Tabla de ítems
    const cols = [margins.left, margins.left + 80, margins.left + 200, margins.left + 300, margins.left + 380];
    doc.font('Helvetica-Bold').fontSize(11);
    doc.text('Cant.', cols[0], y);
    doc.text('Descripción', cols[1], y);
    doc.text('Espesor (mm)', cols[2], y, { width: 80, align: 'right' });
    doc.text('Sub USD', cols[3], y, { width: 60, align: 'right' });
    doc.text('Sub ARS', cols[4], y, { width: 80, align: 'right' });
    y += 20;
    doc.strokeColor('#555').lineWidth(0.5)
      .moveTo(cols[0], y - 5).lineTo(width - margins.right, y - 5).stroke();

    // Filas
    doc.font('Helvetica').fontSize(10);
    items.forEach(item => {
      doc.text(item.cantidad.toString(), cols[0], y);
      doc.text(item.descripcion, cols[1], y, { width: cols[2] - cols[1] });
      doc.text(item.espesorMm.toString(), cols[2], y, { width: 80, align: 'right' });
      doc.text(`$${item.subTotalUsd.toFixed(2)}`, cols[3], y, { width: 60, align: 'right' });
      doc.text(`$${(item.totalArs !== undefined ? item.totalArs : item.subTotalArs).toFixed(2)}`, cols[4], y, { width: 80, align: 'right' });
      y += 20;
      if (y > doc.page.height - margins.bottom - 100) {
        doc.addPage();
        y = margins.top;
      }
    });
    y += 10;

    // Resumen general
    doc.font('Helvetica-Bold').fontSize(11);
    doc.text(`Subtotal USD: $${resumen.subTotalUsd.toFixed(2)}`, margins.left, y);
    y += 15;
    const ivaUsd = resumen.subTotalUsd * resumen.ivaPct / 100;
    doc.text(`IVA (${resumen.ivaPct}%): $${ivaUsd.toFixed(2)}`, margins.left, y);
    y += 15;
    const mitadIva = ivaUsd / 2;
    doc.text(`Media IVA: $${mitadIva.toFixed(2)}`, margins.left, y);
    y += 15;
    doc.fontSize(12).text(`TOTAL ARS: $${resumen.totalArs.toFixed(2)}`, margins.left, y);
    y += 30;

    // Condiciones
    doc.font('Helvetica').fontSize(9).text('Condiciones:', margins.left, y);
    doc.text(condiciones, margins.left, y + 12, { width: width - margins.left - margins.right });

    doc.end();
  });
}

