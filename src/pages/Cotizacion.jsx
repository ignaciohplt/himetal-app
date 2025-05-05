// src/pages/Cotizacion.jsx
import React, { useState, useEffect } from "react";
import { pesosData } from "../data/pesosData.js";
import { Laminadofrio as dataFrio, Laminadocaliente as dataCaliente } from "../data/sidersaData.js";

export default function Cotizacion() {
  const [mode, setMode] = useState('laser');
  const [pesoChapa, setPesoChapa] = useState("");
  const [ancho, setAncho] = useState(0);
  const [largo, setLargo] = useState(0);
  const [m2Pieza, setM2Pieza] = useState(0);
  const [dolarOficial, setDolarOficial] = useState(null);
  const [errorDolar, setErrorDolar] = useState(false);
  const [precioChapa, setPrecioChapa] = useState(0);
  const [factor, setFactor] = useState(1.5);
  const [total, setTotal] = useState(null);

  // Calcular m² cuando cambian ancho o largo
  useEffect(() => {
    setM2Pieza((ancho * largo) / 1000000);
  }, [ancho, largo]);

  // Fetch dólar oficial y actualizar cada 24h
  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const proxy = "https://api.allorigins.win/raw?url=" +
          encodeURIComponent("https://www.bna.com.ar/Personas");
        const resp = await fetch(proxy);
        if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const tit = Array.from(doc.querySelectorAll('td.tit'))
          .find(el => el.textContent.includes('Dolar U.S.A'));
        let valorTxt;
        if (tit) {
          const venta = tit.nextElementSibling?.nextElementSibling;
          const compra = tit.nextElementSibling;
          valorTxt = (venta || compra)?.textContent.replace(',', '.').trim();
        }
        if (!valorTxt) throw new Error('No se encontró Dolar U.S.A');
        const valor = parseFloat(valorTxt);
        if (isNaN(valor)) throw new Error(`Valor inválido: ${valorTxt}`);
        setDolarOficial(valor);
        setErrorDolar(false);
      } catch (e) {
        console.error(e);
        setErrorDolar(true);
      }
    };
    fetchDolar();
    const timer = setInterval(fetchDolar, 24 * 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCalcular = () => {
    const pesoNum = Number(pesoChapa);
    if (!pesoNum || (dolarOficial === null && !errorDolar)) return;
    const peso = pesoNum * m2Pieza;
    const materiaPrima = peso * precioChapa * dolarOficial;
    let subtotal;
    if (mode === 'laser') subtotal = materiaPrima * factor;
    else if (mode === 'guillotina') subtotal = materiaPrima + peso * 1100;
    else subtotal = materiaPrima + peso * 2100;
    setTotal({
      subtotal,
      total21: subtotal * 1.21,
      total105: subtotal * 1.105
    });
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Cotización</h2>

      {/* Modo de corte */}
      <div className="flex space-x-2 mb-4">
        {['laser','guillotina','laserPlegado'].map(m => (
          <button
            key={m}
            className={`px-3 py-1 rounded ${mode===m?'bg-blue-600 text-white':'bg-blue-200'}`}
            onClick={()=>setMode(m)}
          >{m==='laser'?'Corte Láser':m==='guillotina'?'Corte Guillotina':'Láser + Plegado'}</button>
        ))}
      </div>

      <div className="space-y-4 p-4 bg-sky-50 rounded">
        {/* Peso de chapa */}
        <div>
          <label className="font-semibold block">Peso de chapa:</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={pesoChapa}
            onChange={e=>setPesoChapa(e.target.value)}
          >
            <option value="" disabled>-- Seleccionar --</option>
            {pesosData.map((item,i)=>(
              <option key={i} value={item.valor}>
                {item.espesor} mm — {item.valor.toFixed(2)} kg
              </option>
            ))}
          </select>
        </div>

        {/* Dimensiones y m² */}
        <div>
          <label className="font-semibold block mb-1">Dimensiones (mm):</label>
          <div className="flex space-x-2">
            <input type="number" placeholder="Ancho" className="border rounded px-2 py-1 w-1/2" value={ancho} onChange={e=>setAncho(Number(e.target.value))} min="0" />
            <input type="number" placeholder="Largo" className="border rounded px-2 py-1 w-1/2" value={largo} onChange={e=>setLargo(Number(e.target.value))} min="0" />
          </div>
          <label className="font-semibold block mt-2">Metros cuadrados:</label>
          <input type="text" className="border rounded px-2 py-1 w-full bg-gray-100" value={m2Pieza.toFixed(4)} readOnly />
        </div>

        {/* Precio Sidersa USD */}
        <div>
          <label className="font-semibold block mb-1">Precio chapa USD:</label>
          <input type="number" className="border rounded px-2 py-1 w-full mb-2" value={precioChapa} onChange={e=>setPrecioChapa(Number(e.target.value))} placeholder="Ingresar manual" />
          <select className="border rounded px-2 py-1 w-full" value={precioChapa} onChange={e=>setPrecioChapa(Number(e.target.value)/1000)}>
            <option value={0}>-- Seleccionar precio Sidersa --</option>
            {dataFrio.map((item,i)=>Object.entries(item.precios).map(([w,p],j)=>p && <option key={`f${i}${j}`} value={p}>{`Frío | ${item.espesor}mm | ${w}mm | USD ${p}`}</option>))}
            {dataCaliente.map((item,i)=>Object.entries(item.precios).map(([w,p],j)=>p && <option key={`c${i}${j}`} value={p}>{`Caliente | ${item.espesor}mm | ${w}mm | USD ${p}`}</option>))}
          </select>
        </div>

        {/* Dólar U.S.A Venta */}
        <div>
          <label className="font-semibold block mb-1">Dólar U.S.A Venta:</label>
          {errorDolar?(
            <input type="number" className="border rounded px-2 py-1 w-full bg-yellow-100" value={dolarOficial||''} onChange={e=>setDolarOficial(Number(e.target.value))} />
          ):(
            <input type="text" className="border rounded px-2 py-1 w-full bg-gray-100" value={dolarOficial?dolarOficial.toFixed(2):'Cargando...'} disabled />
          )}
        </div>

        {/* Multiplicador */}
        {mode==='laser'&&(
          <div>
            <label className="font-semibold block">Multiplicador:</label>
            <select className="border rounded px-2 py-1 w-full" value={factor} onChange={e=>setFactor(Number(e.target.value))}>
              {[1.5,1.7,1.8,1.9,2,2.2,3,10].map(v=><option key={v} value={v}>{v}×</option>)}
            </select>
          </div>
        )}
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" onClick={handleCalcular}>
        🚀 Calcular
      </button>

      {total&&(
        <div className="mt-4 p-4 bg-blue-100 rounded space-y-1">
          <p>Subtotal: <strong>${total.subtotal.toFixed(2)}</strong></p>
          <p>Total IVA 21%: <strong>${total.total21.toFixed(2)}</strong></p>
          <p>Total IVA 10.5%: <strong>${total.total105.toFixed(2)}</strong></p>
        </div>
      )}

    </section>
  );
}
