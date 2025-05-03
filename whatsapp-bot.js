// whatsapp-bot.js
console.log('🔧 Iniciando whatsapp-bot.js...');

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import generarPdfCotizacion from './lib/generarPdfCotizacion.js';
import { Laminadofrio, Laminadocaliente } from './data/sidersaData.js';
import { pesosData } from './data/pesosData.js';

// Inicializa el cliente con sesión persistente (LocalAuth)
const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'himetal-bot' })
});

// Evento QR (solo primera vez)
client.on('qr', qr => {
  console.log('📡 Evento QR recibido');
  qrcode.generate(qr, { small: true });
});

// Evento listo\ nclient.on('ready', () => console.log('✅ Bot WhatsApp listo y conectado'));
client.on('auth_failure', err => console.error('❌ Auth Failure:', err));
client.on('disconnected', () => console.log('⚠️ Cliente desconectado'));

// Iniciar cliente
client.initialize();
console.log('✨ client.initialize() llamado, esperando evento QR...');

// Escucha mensajes
client.on('message_create', async msg => {
  const textRaw = msg.body.trim();
  const text = textRaw.toLowerCase();
  if (!text.startsWith('cotizar')) return;
  console.log('📥 Comando cotizar recibido:', textRaw);

  try {
    // Parseo flexible
    const numeroMatch   = text.match(/numero\s+(\S+)/i);
    const cantidadMatch = text.match(/cantidad\s+(\d+)/i);
    const chapaMatch    = text.match(/chapa\s+(\d+)mm/i);
    const dimMatch      = text.match(/dim\s+(\d+)x(\d+)/i);
    const factorMatch   = text.match(/multiplicador\s+([\d.,]+)/i);
    const sideraMatch   = text.match(/sidersa\s+(frio|caliente)(?:\s+(\d+))?/i);
    const dinerRawMatch = textRaw.match(/dolar\s+([\d.,]+)/i);
    const itemMatch     = textRaw.match(/item\s+(.+?)(?=\s+numero|\s+cantidad|\s+chapa|\s+dim|\s+multiplicador|\s+sidersa|\s+dolar|$)/i);

    // Asignar valores básicos
    const numero       = numeroMatch   ? numeroMatch[1] : '000';
    const cantidad     = cantidadMatch ? parseInt(cantidadMatch[1]) : 1;
    const espesorMm    = chapaMatch    ? parseFloat(chapaMatch[1]) : 0;
    let ancho = 0, largo = 0;
    if (dimMatch) {
      ancho = parseInt(dimMatch[1]) / 1000;
      largo = parseInt(dimMatch[2]) / 1000;
    }
    const factor        = factorMatch   ? parseFloat(factorMatch[1].replace(',', '.')) : 1.5;
    const tipo          = sideraMatch   ? sideraMatch[1] : 'frio';
    const anchoSidera   = sideraMatch && sideraMatch[2] ? sideraMatch[2] : null;
    const descripcion   = itemMatch     ? itemMatch[1] : `Chapa ${espesorMm} mm`;
    const dolarOficial  = dinerRawMatch ? parseFloat(dinerRawMatch[1].replace(',', '.')) : 350;

    // Lookup precio USD/m²
    const fuente        = tipo === 'caliente' ? Laminadocaliente : Laminadofrio;
    const entry         = fuente.find(e => e.espesor === espesorMm);
    let precioUSD       = 0;
    if (entry) {
      if (anchoSidera && entry.precios[anchoSidera] != null) {
        precioUSD = entry.precios[anchoSidera];
      } else {
        precioUSD = Object.values(entry.precios).find(v => v != null) || 0;
      }
    }

    // Lookup peso kg/m² por espesor (se corrige aquí)
    const pesoEntry     = pesosData.find(p => p.espesor === espesorMm);
    const pesoKgM2      = pesoEntry ? pesoEntry.valor : 0;

    // Cálculos con tu fórmula
    const area          = ancho * largo;
    const pesoTotalKg   = pesoKgM2 * area;
    const subUsd        = +(pesoTotalKg * precioUSD * factor).toFixed(2);      // USD antes IVA
    const ivaPct        = 21;
    const ivaUsd        = +(subUsd * ivaPct / 100).toFixed(2);               // USD IVA
    const totalUsd      = +(subUsd + ivaUsd).toFixed(2);                     // USD con IVA
    const totalArs      = +(totalUsd * dolarOficial).toFixed(2);             // ARS final

    // Preparar datos para PDF
    const dataPdf = {
      numero,
      fecha: new Date(),
      items: [{
        descripcion,
        cantidad,
        espesorMm,
        subTotalUsd: subUsd,
        subTotalArs: +(pesoTotalKg * precioUSD * factor * dolarOficial).toFixed(2)
      }],
      resumen: {
        subTotalUsd: subUsd,
        ivaPct,
        totalUsd,
        totalArs
      },
      empresa: {
        nombre:    'HI-METAL S.A.',
        direccion: 'Galvez 217 – Rosario, Santa Fe',
        telefono:  '+54 341 155-896964',
        email:     'himetalrosario@gmail.com',
        logoPath:  null
      },
      condiciones: 'Validez: 24h; Dólar oficial del día; No válido como factura'
    };

    // Generar y enviar PDF
    const pdfBuffer = await generarPdfCotizacion(dataPdf);
    const media     = new MessageMedia(
      'application/pdf',
      pdfBuffer.toString('base64'),
      `cotizacion_${numero}.pdf`
    );
    await client.sendMessage(msg.from, media, { caption: '✅ Aquí tu cotización' });

  } catch (err) {
    console.error('Error al procesar cotización:', err);
  }
});
