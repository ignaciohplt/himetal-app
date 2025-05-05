import React from "react";
import { pesosData } from "../data/pesosData.js";

export default function Lista() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Lista de Materiales</h2>
      <div className="overflow-x-auto bg-white border border-gray-300 rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Tipo / Espesor</th>
              <th className="border px-4 py-2 text-left">Unidad</th>
              <th className="border px-4 py-2 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {pesosData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border px-4 py-2">
                  {item.tipo ? item.tipo : `${item.espesor} mm`}
                </td>
                <td className="border px-4 py-2">
                  {item.unidad ? item.unidad : "kg/m²"}
                </td>
                <td className="border px-4 py-2 text-right">
                  {item.valor.toFixed(2)} kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
