import React, { useState, useEffect } from "react";

const defaultStock = [
  { descripcion: 'CHAPA N22 LOZA" - 1300 X 2050 LAC', stock: 1 },
  { descripcion: 'CHAPA N22" - 1220 X 2440 LAF', stock: 1 },
  { descripcion: 'CHAPA N20 LOZA" - 1300 X 2050 LAC', stock: 1 },
  { descripcion: 'CHAPA N20" - 1220 X 2440 LAF', stock: 1 },
  { descripcion: 'CHAPA N18" - 1220 X 2440 LAF', stock: 1 },
  { descripcion: 'CHAPA N18" - 1500 X 3000 LAF', stock: 1 },
  { descripcion: 'CHAPA N16" - 1220 X 2440 LAF', stock: 1 },
  { descripcion: 'CHAPA N16" - 1500 X 3000 LAF', stock: 1 },
  { descripcion: 'CHAPA N14" - 1245 X 2440 LAC', stock: 1 },
  { descripcion: 'CHAPA N14" - 1245 X 2440 LAF', stock: 1 },
  { descripcion: 'CHAPA N14" - 1500 X 3000 LAF', stock: 1 },
  { descripcion: 'CHAPA N12" - 1245 X 2440 LAC', stock: 1 },
  { descripcion: 'CHAPA N12" - 1245 X 3000 LAC', stock: 1 },
  { descripcion: 'CHAPA 1/8" - 1000 X 2000 LAC', stock: 1 },
  { descripcion: 'CHAPA 1/8" - 1500 X 3000 LAC', stock: 1 },
  { descripcion: 'CHAPA 3/16" - 1500 X 3000 LAC', stock: 1 },
  { descripcion: 'CHAPA 1/4" - 1500 X 3000 LAC', stock: 1 },
  { descripcion: 'CHAPA 5/16" - 1500 X 3000 LAC', stock: 1 },
  { descripcion: 'CHAPA 3/8" - 1500 X 3000 LAC', stock: 1 },
  { descripcion: 'CHAPA 1/2" - 1500 X 3000 LAC', stock: 1 },
  { descripcion: 'CHAPA 3/4" - 1500 X 3000 LAC', stock: 1 }
];

export default function Stock() {
  const [stockchapas, setStockchapas] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("stockInicial");
    if (saved) {
      setStockchapas(JSON.parse(saved));
    } else {
      setStockchapas(defaultStock);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("stockInicial", JSON.stringify(stockchapas));
    alert("Stock guardado 👍");
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Stock Diario</h2>
      <button
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        💾 Guardar Cambios
      </button>
      <div className="overflow-x-auto bg-white border border-gray-300">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Descripción</th>
              <th className="border px-4 py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {stockchapas.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.descripcion}</td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    className="w-20 border rounded px-1 py-0.5"
                    value={item.stock}
                    min="0"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setStockchapas((prev) =>
                        prev.map((c, i) =>
                          i === index ? { ...c, stock: val } : c
                        )
                      );
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}