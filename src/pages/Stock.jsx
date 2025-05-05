// src/pages/stock.jsx
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

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
  const [items, setItems] = useState(defaultStock);

  // 1) Leer de Firestore al montar
  useEffect(() => {
    (async () => {
      const ref = doc(db, "himetal", "stock");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setItems(snap.data().items);
      }
    })();
  }, []);

  // 2) Guardar en Firestore
  const handleSave = async () => {
    const ref = doc(db, "himetal", "stock");
    await setDoc(ref, { items });
    alert("✔ Stock guardado en la nube");
  };

  // 3) Actualizar estado al modificar input
  const updateStock = (idx, value) => {
    const updated = items.map((it, i) =>
      i === idx ? { ...it, stock: Number(value) } : it
    );
    setItems(updated);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Stock Diario – Chapas</h2>

      <button
        onClick={handleSave}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        💾 Guardar Stock en la nube
      </button>

      <div className="overflow-x-auto bg-white border border-gray-300 rounded">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Descripción</th>
              <th className="border px-4 py-2 text-center">Stock (unidades)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2">{it.descripcion}</td>
                <td className="border px-4 py-2 text-center">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-20 text-right"
                    value={it.stock}
                    min="0"
                    onChange={e => updateStock(i, e.target.value)}
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
