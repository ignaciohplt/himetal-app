import React, { useState, useEffect } from "react";
import portada from "./assets/portada.jpg"; // Asegúrate de colocar la imagen en src/assets/portada.jpg
import generarPdfCotizacion from '../lib/generarPdfCotizacion.js';


const pesosData = [
  { tipo: "Chapa calibre 22 (0.7 mm)", unidad: "kg/m²", valor: 5.6 },
  { tipo: "Chapa calibre 20 (0.9 mm)", unidad: "kg/m²", valor: 6.9 },
  { tipo: "Chapa calibre 18 (1.25 mm)", unidad: "kg/m²", valor: 10.0 },
  { tipo: "Chapa calibre 16 (1.6 mm)", unidad: "kg/m²", valor: 12.56 },
  { tipo: "Chapa calibre 14 (2.0 mm)", unidad: "kg/m²", valor: 15.7 },
  { tipo: "Chapa calibre 12 (2.5 mm)", unidad: "kg/m²", valor: 19.63 },
  { tipo: "Chapa calibre 1/8 (3.20 mm)", unidad: "kg/m²", valor: 25.1 },
  { tipo: "Chapa calibre 3/16 (4.75 mm)", unidad: "kg/m²", valor: 41.0 },
  { tipo: "Chapa calibre 1/4 (6.35 mm)", unidad: "kg/m²", valor: 54.8 },
  { tipo: "Chapa calibre 5/16 (7.9 mm)", unidad: "kg/m²", valor: 62.8 },
  { tipo: "Chapa calibre 3/8 (9.5 mm)", unidad: "kg/m²", valor: 75.4 },
  { tipo: "Chapa calibre 1/2 (12.7 mm)", unidad: "kg/m²", valor: 100.5 },
  { tipo: "Chapa calibre 5/8 (15.8 mm)", unidad: "kg/m²", valor: 125.6 },
  { tipo: "Chapa calibre 3/4 (19.05 mm)", unidad: "kg/m²", valor: 150.7 }
];

export default function App() {
  const [tab, setTab] = useState("cot");
  const [mode, setMode] = useState('laser');
  const [pesoChapa, setPesoChapa] = useState(0);
  const [m2Pieza, setM2Pieza] = useState(0);
  const [dolarOficial, setDolarOficial] = useState(null);
  const [precioChapa, setPrecioChapa] = useState(0);
  const [factor, setFactor] = useState(1.5);
  const [iva, setIva] = useState(21);
  const [total, setTotal] = useState(null);
  const [ancho, setAncho] = useState(0);
  const [stockchapas, setstockchapas] = useState([]);
  const [Laminadofrio, setLaminadofrio] = useState([]);
  const [Laminadocaliente, setLaminadocaliente] = useState([]);
  const [largo, setLargo] = useState(0);
  const [errorDolar, setErrorDolar] = useState(false);

  // Estados para precios Sidersa (placeholder)

  const [errorSidersa, setErrorSidersa] = useState(false);

  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const proxyUrl =
          "https://api.allorigins.win/raw?url=" +
          encodeURIComponent("https://www.bna.com.ar/Personas");
        const resp = await fetch(proxyUrl);
        if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
        const html = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const titCells = Array.from(doc.querySelectorAll('td.tit'));
        let valorTxt = null;
        for (const tit of titCells) {
          if (tit.textContent.trim().includes('Dolar U.S.A')) {
            const compraCell = tit.nextElementSibling;
            const ventaCell = compraCell ? compraCell.nextElementSibling : null;
            if (ventaCell) {
              valorTxt = ventaCell.textContent.trim().replace(',', '.');
            } else if (compraCell) {
              valorTxt = compraCell.textContent.trim().replace(',', '.');
            }
            break;
          }
        }

        if (!valorTxt) {
          throw new Error('No se encontró Dolar U.S.A');
        }

        const valor = parseFloat(valorTxt);
        if (isNaN(valor)) throw new Error(`Valor inválido: ${valorTxt}`);

        setDolarOficial(valor);
        setErrorDolar(false);
      } catch (err) {
        console.error('Error al obtener dólar oficial:', err);
        setErrorDolar(true);
      }
    };

    fetchDolar();
    const timer = setInterval(fetchDolar, 24 * 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

   useEffect(() => {
  const m2 = (ancho * largo) / 1000000;
  setM2Pieza(m2);
}, [ancho, largo]);


 useEffect(() => {
  const datosLaminadofrio = [
  { espesor: 0.30, precios: { "1000": 1561, "1220": null, "1500": null } },
  { espesor: 0.35, precios: { "1000": 1522, "1220": null, "1500": null } },
  { espesor: 0.40, precios: { "1000": 1496, "1220": 1457, "1500": null } },
  { espesor: 0.45, precios: { "1000": null, "1220": 1431, "1500": null } },
  { espesor: 0.50, precios: { "1000": null, "1220": 1418, "1500": null } },
  { espesor: 0.55, precios: { "1000": 1444, "1220": 1405, "1500": null } },
  { espesor: 0.65, precios: { "1000": null, "1220": 1379, "1500": 1366 } },
  { espesor: 0.70, precios: { "1000": 1405, "1220": 1366, "1500": 1353 } },
  { espesor: 0.80, precios: { "1000": 1392, "1220": 1353, "1500": 1340 } },
  { espesor: 0.90, precios: { "1000": 1366, "1220": 1327, "1500": 1314 } },
  { espesor: 1.10, precios: { "1000": null, "1220": 1327, "1500": null } },
  { espesor: 1.25, precios: { "1000": 1353, "1220": 1314, "1500": "1301 (*)" } },
  { espesor: 1.40, precios: { "1000": null, "1220": 1314, "1500": 1301 } },
  { espesor: 1.60, precios: { "1000": 1353, "1220": 1314, "1500": 1301 } },
  { espesor: 1.80, precios: { "1000": null, "1220": null, "1500": 1314 } },
  { espesor: 2.00, precios: { "1000": 1366, "1220": 1327, "1500": 1314 } },
  { espesor: 2.50, precios: { "1000": null, "1220": 1327, "1500": 1314 } },
  { espesor: 3.00, precios: { "1000": null, "1220": null, "1500": 1314 } }
    // ... agrega el resto de los datos aquí
  ];
  setLaminadofrio(datosLaminadofrio);
}, []);

useEffect(() => {
  const datosLaminadocaliente = [
    { espesor: 1.80, precios: { "896": null, "1025": 1179, "1070": null, "1180": null, "1200": null, "1245": null, "1500": null } },
    { espesor: 2.00, precios: { "896": null, "1025": 1157, "1070": null, "1180": null, "1200": null, "1245": 1124, "1500": null } },
    { espesor: 2.50, precios: { "896": null, "1025": 1135, "1070": null, "1180": null, "1200": null, "1245": 1103, "1500": null } },
    { espesor: 2.85, precios: { "896": null, "1025": null, "1070": null, "1180": null, "1200": null, "1245": 1103, "1500": null } },
    { espesor: 3.20, precios: { "896": null, "1025": 1124, "1070": null, "1180": null, "1200": null, "1245": 1092, "1500": 1081 } },
    { espesor: 4.00, precios: { "896": null, "1025": null, "1070": null, "1180": null, "1200": null, "1245": 1081, "1500": 1070 } },
    { espesor: 4.75, precios: { "896": null, "1025": 1114, "1070": null, "1180": null, "1200": null, "1245": 1081, "1500": 1070 } },
    { espesor: 6.35, precios: { "896": null, "1025": 1124, "1070": null, "1180": null, "1200": null, "1245": 1092, "1500": "1081 (*)" } },
    { espesor: 8.00, precios: { "896": null, "1025": null, "1070": null, "1180": null, "1200": null, "1245": null, "1500": 1081 } },
    { espesor: 9.50, precios: { "896": null, "1025": null, "1070": null, "1180": null, "1200": null, "1245": null, "1500": 10922222222 } },
    { espesor: 12.50, precios: { "896": null, "1025": null, "1070": null, "1180": null, "1200": null, "1245": null, "1500": 1092 } }
  ];

  setLaminadocaliente(datosLaminadocaliente);
}, []);

useEffect(() => {
  const stockchapas = [
    { descripcion: 'CHAPA N22 LOZA" - 1300 X 2050 LAC', stock: 1 },
    { descripcion: 'CHAPA N22" - 1220 X 2440 LAF', stock: 1 },
    { descripcion: 'CHAPA N20 LOZA"- 1300 X 2050 LAC', stock: 1 },
    { descripcion: 'CHAPA N20"- 1220 X 2440 LAF', stock: 1 },
    { descripcion: 'CHAPA N18" - 1220 X 2440 LAF', stock: 1 },
    { descripcion: 'CHAPA N18" - 1500 X 3000 LAF', stock: 1 },
    { descripcion: 'CHAPA N16" - 1220 X 2440 LAF', stock: 1 },
    { descripcion: 'CHAPA N16" - 1500 X 3000 LAF', stock: 1 },
    { descripcion: 'CHAPA N14" - 1245 X 2440 LAC', stock: 1 },
    { descripcion: 'CHAPA N14" - 1245 X 2440 LAF', stock: 1 },
    { descripcion: 'CHAPA N14"- 1500 X 3000 LAF', stock: 1 },
    { descripcion: 'CHAPA N12"- 1245 X 2440 LAC', stock: 1 },
    { descripcion: 'CHAPA N12" - 1245 X 3000 LAC', stock: 1 },
    { descripcion: 'CHAPA 1/8" - 1000 X 2000 LAC', stock: 1 },
    { descripcion: 'CHAPA 1/8" - 1500 X 3000 LAC', stock: 1 },
    { descripcion: 'CHAPA 3-16" - 1500 X 3000 LAC', stock: 1 },
    { descripcion: 'CHAPA 1/4" - 1500 X 3000 LAC', stock: 1 },
    { descripcion: 'CHAPA 5/16" - 1500 X 3000 LAC', stock: 1 },
    { descripcion: 'CHAPA 3/8" - 1500 X 3000 LAC', stock: 1 },
    { descripcion: 'CHAPA 1/2"- 1500 X 3000 LAC', stock: 1 },
    { descripcion: 'CHAPA 3/4"- 1500 X 3000 LAC', stock: 1 },
    { descripcion: 'CHAPA 123" - --------------', stock: 1 },
    { descripcion: 'CHAPA ---" - --------------', stock: 1 },
    { descripcion: 'CHAPA ---" - --------------', stock: 1 },
    { descripcion: 'CHAPA ---" - --------------', stock: 1 },
    { descripcion: 'CHAPA ---" - --------------', stock: 1 },
    { descripcion: 'CHAPA ---" - --------------', stock: 1 },
  ];

  setstockchapas(stockchapas);
}, []);


  const handleCalcular = () => {
    if (dolarOficial === null && !errorDolar) return;
    let subtotal = 0;

    const peso = pesoChapa * m2Pieza;
    const materiaPrima = peso * precioChapa * dolarOficial;

    if (mode === 'laser') {
      subtotal = materiaPrima * factor;
    } else if (mode === 'guillotina') {
      const mano = peso * 1100;
      subtotal = mano + materiaPrima;
    } else if (mode === 'laserPlegado') {
      const mano = peso * 2100;
      subtotal = mano + materiaPrima;
    }

    setTotal({
      subtotal,
      total21: subtotal * 1.21,
      total105: subtotal * 1.105
    });
  };

  return (
     <div
      className="min-h-screen p-6 text-blue-900"
      style={{
        backgroundImage: `url(${portada})`,
        backgroundSize:     '50% auto',
        backgroundPosition: 'center',
        backgroundRepeat:   'no-repeat',
      }}
    > 
      <h1 className="text-3xl font-bold mb-4">Panel Principal - HiMetal PRO</h1>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === 'cot'    ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
          onClick={() => setTab('cot')}
        >
          Cotización
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'lista'  ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
          onClick={() => setTab('lista')}
        >
          Lista de Materiales
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'sidersa'? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
          onClick={() => setTab('sidersa')}
        >
          Precios Sidersa</button>
<button
  className={`px-4 py-2 rounded ${tab === 'stock' ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
  onClick={() => setTab('stock')}
>
  Stock Diario
</button>


      </div>

      {tab === 'cot' && (
        <div>
          <div className="flex space-x-2 mb-4">
            <button
              className={`px-3 py-1 rounded ${mode === 'laser' ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
              onClick={() => setMode('laser')}
            >Corte Láser</button>
            <button
              className={`px-3 py-1 rounded ${mode === 'guillotina' ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
              onClick={() => setMode('guillotina')}
            >Corte Guillotina</button>
            <button
              className={`px-3 py-1 rounded ${mode === 'laserPlegado' ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
              onClick={() => setMode('laserPlegado')}
            >Láser + Plegado</button>
          </div>

          <div className="space-y-4 p-4 bg-sky-50 rounded">
            <div>
              <label className="font-semibold block">Peso de chapa:</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={pesoChapa}
                onChange={e => setPesoChapa(Number(e.target.value))}
              >
                <option value={0}>-- Seleccionar --</option>
                {pesosData.map((item, i) => (
                  <option key={i} value={item.valor}>{item.tipo}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
  <label className="font-semibold block">📐 Dimensiones de la pieza (m):</label>
  <div className="flex space-x-2">
    <input
      type="number"
      placeholder="Ancho"
      className="border rounded px-2 py-1 w-1/2"
      value={ancho}
      onChange={e => setAncho(Number(e.target.value))}
      min="0"
    />
    <input
      type="number"
      placeholder="Largo"
      className="border rounded px-2 py-1 w-1/2"
      value={largo}
      onChange={e => setLargo(Number(e.target.value))}
      min="0"
    />
  </div>
  <div>
    <label className="font-semibold block mt-2">Metros cuadrados de la pieza:</label>
    <input
      type="number"
      className="border rounded px-2 py-1 w-full bg-gray-100"
      value={m2Pieza.toFixed(4)}
      readOnly
    />
  </div>
</div>


<div>
  <label className="font-semibold block mb-1">Precio chapa (Sidersa) USD:</label>

  {/* Input manual */}
  <input
    type="number"
    className="border rounded px-2 py-1 w-full mb-2"
    value={precioChapa}
    onChange={e => setPrecioChapa(Number(e.target.value))}
    placeholder="Ingresar precio manualmente"
  />

  {/* Selector desde lista Sidersa */}
  <select
    className="border rounded px-2 py-1 w-full"
    value={precioChapa}
    onChange={e => setPrecioChapa(Number(e.target.value) / 1000)}
  >
    <option value={0}>-- Seleccionar precio desde Sidersa --</option>

    {/* Laminado Frío */}
    {Laminadofrio.map((item, i) =>
      Object.entries(item.precios).map(([ancho, precio], idx) =>
        precio ? (
          <option key={`frio-${i}-${idx}`} value={precio}>
            Frío | Espesor: {item.espesor}mm | Ancho: {ancho}mm | USD {precio}
          </option>
        ) : null
      )
    )}

    {/* Laminado Caliente */}
    {Laminadocaliente.map((item, i) =>
      Object.entries(item.precios).map(([ancho, precio], idx) =>
        precio ? (
          <option key={`caliente-${i}-${idx}`} value={precio}>
            Caliente | Espesor: {item.espesor}mm | Ancho: {ancho}mm | USD {precio}
          </option>
        ) : null
      )
    )}
  </select>
</div>


            <div>
              <label className="font-semibold block">Dólar U.S.A Venta (ARS):</label>
              {errorDolar ? (
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full bg-yellow-100"
                  placeholder="Ingresa manual"
                  value={dolarOficial || ''}
                  onChange={e => setDolarOficial(Number(e.target.value))}
                />
              ) : (
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full bg-gray-100"
                  value={dolarOficial !== null ? dolarOficial.toFixed(2) : 'Cargando...'}
                  disabled
                />
              )}
            </div>

            {mode === 'laser' && (
              <div>
                <label className="font-semibold block">Multiplicador:</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={factor}
                  onChange={e => setFactor(Number(e.target.value))}
                >
                  {[1.5,1.7,1.8,1.9,2,2.2,3,10].map(val => (
                    <option key={val} value={val}>{val}×</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            onClick={handleCalcular}
            disabled={dolarOficial === null && !errorDolar}
          >🚀 Calcular</button>

          {total && (
            <div className="mt-4 p-4 bg-blue-100 rounded space-y-1">
              <p>Subtotal: <strong>${total.subtotal.toFixed(2)}</strong></p>
              <p>Total con IVA 21%: <strong>${total.total21.toFixed(2)}</strong></p>
              <p>Total con IVA 10.5%: <strong>${total.total105.toFixed(2)}</strong></p>
            </div>
          )}
        </div>
      )}

      {tab === 'lista' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Lista de Materiales</h2>
          <ul className="list-disc pl-5">
            {pesosData.map((item,i)=>(<li key={i} className="mb-1">{item.tipo} — {item.valor} {item.unidad}</li>))}
          </ul>
        </div>
      )}

 {tab === 'sidersa' && (
      <div>
        <h2 className="text-xl font-semibold mb-2">Precios Sidersa</h2>

        {/* Laminado frio */}
        <div className="mb-4">
          <h3 className="font-semibold">Chapas Laminadofrio</h3>
          {errorSidersa ? (
            <p className="text-red-600">Error al cargar precios Sidersa</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Espesor</th>
                  <th className="border px-4 py-2">1000 mm</th>
                  <th className="border px-4 py-2">1220 mm</th>
                  <th className="border px-4 py-2">1500 mm</th>
                </tr>
              </thead>
              <tbody>
                {Laminadofrio.map((item, i) => (
                  <tr key={i}>
                    <td className="border px-4 py-2">{item.espesor}</td>
                    <td className="border px-4 py-2">{item.precios["1000"] || "-"}</td>
                    <td className="border px-4 py-2">{item.precios["1220"] || "-"}</td>
                    <td className="border px-4 py-2">{item.precios["1500"] || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Laminado caliente */}
        <div className="mb-4">
          <h3 className="font-semibold">Chapas Laminadocaliente</h3>
          <table className="w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border px-4 py-2">Espesor</th>
                {["896", "1025", "1070", "1180", "1200", "1245", "1500"].map(ancho => (
                  <th key={ancho} className="border px-4 py-2">{ancho} mm</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Laminadocaliente.map((item, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{item.espesor}</td>
                  {["896", "1025", "1070", "1180", "1200", "1245", "1500"].map(ancho => (
                    <td key={ancho} className="border px-4 py-2">
                      {item.precios[ancho] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       </div>
 )}

 {tab === 'stock' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Stock Diario - Chapas</h2>
    <table className="w-full table-auto border-collapse border border-gray-400">
      <thead>
        <tr>
          <th className="border px-4 py-2">Descripción</th>
          <th className="border px-4 py-2">Stock (unidades)</th>
        </tr>
      </thead>
      <tbody>
        {stockchapas.map((item, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{item.descripcion}</td>
            <td className="border px-4 py-2">
              <input
                type="number"
                className="border rounded px-2 py-1 w-24"
                value={item.stock}
                min="0"
                onChange={e => {
                  const newStock = stockchapas.map((chapa, idx) => 
  idx === index ? { ...chapa, stock: Number(e.target.value) } : chapa
);
setstockchapas(newStock);

                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}   

</div>  
);
}


  