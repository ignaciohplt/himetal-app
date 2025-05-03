// app/api/send-whatsapp/route.js

// 1) Fuerza Node.js en lugar de Edge
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET() {
  // No tocamos Twilio aquí, devolvemos el error
  return NextResponse.json({ error: 'Only POST allowed' }, { status: 405 });
}

export async function POST(request) {
  let client;
  try {
    // Importamos Twilio en tiempo de ejecución
    const twilio = require('twilio');
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (e) {
    console.error('Twilio init error:', e);
    return NextResponse.json(
      { error: 'Twilio init failed' },
      { status: 500 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { to, body } = payload;
  try {
    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to:   `whatsapp:${to}`,
      body,
    });
    return NextResponse.json({ sid: msg.sid });
  } catch (err) {
    console.error('Twilio send error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
