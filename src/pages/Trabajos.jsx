import React, { useState, useEffect } from "react";

const machines = ["Pedidos", "Laser 1", "Laser 2", "Laser 3", "Laser 4"];

export default function Trabajos() {
  // Inicializamos con un objeto vacío con llaves para cada máquina
  const [jobs, setJobs] = useState(
    machines.reduce((acc, m) => ({ ...acc, [m]: [] }), {})
  );
  const [newJob, setNewJob] = useState("");
  const [activeMachine, setActiveMachine] = useState(machines[0]);

  // Cargar trabajos guardados del localStorage en cliente
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("trabajos");
    if (saved) {
      try {
        setJobs(JSON.parse(saved));
      } catch {
        console.warn("No se pudo parsear trabajos guardados");
      }
    }
  }, []);

  const handleAdd = () => {
    if (!newJob.trim()) return;
    setJobs(prev => ({
      ...prev,
      [activeMachine]: [...prev[activeMachine], newJob.trim()]
    }));
    setNewJob("");
  };

  const handleDelete = indexToRemove => {
    setJobs(prev => ({
      ...prev,
      [activeMachine]: prev[activeMachine].filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSave = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem("trabajos", JSON.stringify(jobs));
    alert("Trabajos guardados 👍");
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Orden de Trabajos</h2>

      {/* Sub‐tabs de máquinas */}
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

      {/* Guardar trabajos */}
      <button
        onClick={handleSave}
        className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        💾 Guardar Trabajos
      </button>

      {/* Añadir nueva tarea */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder={`Nueva tarea en ${activeMachine}`}
          className="flex-1 border rounded px-2 py-1"
          value={newJob}
          onChange={e => setNewJob(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Añadir
        </button>
      </div>

      {/* Tabla de tareas */}
      <div className="overflow-x-auto bg-white border border-gray-300 rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Tarea pendiente</th>
              <th className="border px-4 py-2 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {jobs[activeMachine]?.length > 0 ? (
              jobs[activeMachine].map((tarea, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-4 py-2">{tarea}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(i)}
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
                  No hay tareas pendientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
