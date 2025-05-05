// src/pages/trabajos.jsx
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const machines = ["Pedidos", "Laser 1", "Laser 2", "Laser 3", "Laser 4"];

export default function Trabajos() {
  // 1) Estado local para las tareas
  const [jobs, setJobs] = useState(
    machines.reduce((acc, m) => ({ ...acc, [m]: [] }), {})
  );
  const [newJob, setNewJob] = useState("");
  const [activeMachine, setActiveMachine] = useState(machines[0]);

  // 2) Al montar, leer de Firestore
  useEffect(() => {
    (async () => {
      const ref = doc(db, "himetal", "trabajos");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setJobs(snap.data().jobs);
      }
    })();
  }, []);

  // 3) Guardar en Firestore
  const handleSave = async () => {
    const ref = doc(db, "himetal", "trabajos");
    await setDoc(ref, { jobs });
    alert("✔ Trabajos guardados en la nube");
  };

  // 4) Añadir / borrar tareas localmente
  const addJob = () => {
    if (!newJob.trim()) return;
    setJobs(prev => ({
      ...prev,
      [activeMachine]: [...prev[activeMachine], newJob.trim()]
    }));
    setNewJob("");
  };
  const deleteJob = idx => {
    setJobs(prev => ({
      ...prev,
      [activeMachine]: prev[activeMachine].filter((_, i) => i !== idx)
    }));
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Orden de Trabajos</h2>

      {/* Tabs de máquinas */}
      <div className="flex space-x-2 mb-4">
        {machines.map(m => (
          <button
            key={m}
            onClick={() => setActiveMachine(m)}
            className={`px-4 py-2 rounded ${
              activeMachine === m ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Botón guardar */}
      <button
        onClick={handleSave}
        className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        💾 Guardar en la nube
      </button>

      {/* Formulario nueva tarea */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder={`Nueva tarea en ${activeMachine}`}
          className="flex-1 border rounded px-2 py-1"
          value={newJob}
          onChange={e => setNewJob(e.target.value)}
        />
        <button
          onClick={addJob}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Añadir
        </button>
      </div>

      {/* Tabla de tareas */}
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Tarea</th>
            <th className="border px-4 py-2 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {jobs[activeMachine]?.length > 0 ? (
            jobs[activeMachine].map((t, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2">{t}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => deleteJob(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={2}
                className="border px-4 py-2 text-center text-gray-500"
              >
                No hay tareas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
