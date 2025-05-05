// src/pages/PreciosSidersa.jsx
import React from "react";
import { Laminadofrio as dataFrio, Laminadocaliente as dataCaliente } from "../data/sidersaData.js";

export default function PreciosSidersa() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Precios Sidersa</h2>

      {/* Tabla Laminado Frío */}
      <div className="mb-8 overflow-x-auto bg-white border border-gray-300 rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Espesor (mm)</th>
              {Object.keys(dataFrio[0].precios).map((w) => (
                <th key={w} className="border px-4 py-2 text-center">{w} mm</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataFrio.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2">{item.espesor}</td>
                {Object.values(item.precios).map((p, j) => (
                  <td key={j} className="border px-4 py-2 text-right">{p ?? "-"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla Laminado Caliente */}
      <div className="overflow-x-auto bg-white border border-gray-300 rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Espesor (mm)</th>
              {Object.keys(dataCaliente[0].precios).map((w) => (
                <th key={w} className="border px-4 py-2 text-center">{w} mm</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataCaliente.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2">{item.espesor}</td>
                {Object.values(item.precios).map((p, j) => (
                  <td key={j} className="border px-4 py-2 text-right">{p ?? "-"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
);
}
