"use client";
import React, { useState, useEffect } from "react";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

// Actualizado para coincidir con el componente del owner
type Status = "DEPLOYED" | "COMPLETED" | "PENDING" | "IN_PROGRESS";

interface EditDetailTaskModalProps {
  taskName: string;
  status: Status;
  developers: Developer[];
  points: number;
  developmentHours: number;
  onAddDeveloper: () => void;
  onRemoveDeveloper: () => void;
  onSave: (updated: { status: Status }) => void; // Solo estado en save
  onClose: () => void;
}

// Actualizado para coincidir con el componente del owner
const statusColors: Record<Status, string> = {
  DEPLOYED: "bg-green-400 text-gray-900",
  COMPLETED: "bg-yellow-400 text-gray-900",
  IN_PROGRESS: "bg-orange-700 text-gray-900",
  PENDING: "bg-red-400 text-gray-900",
};

const EditDetailsTaskDeveloper: React.FC<EditDetailTaskModalProps> = ({
  taskName,
  status: initialStatus,
  developers,
  points,
  developmentHours,
  onSave,
  onClose,
}) => {
  const [editableStatus, setEditableStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    setEditableStatus(initialStatus);
  }, [initialStatus]);

  const handleSave = () => {
    onSave({ status: editableStatus });
  };

  return (
    <>
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
        <div
          className="
            relative
            bg-[#121212]/90 backdrop-blur-md
            rounded-xl shadow-lg
            max-w-md w-full
            text-[#e0e0e0] font-sans
            p-6
            flex flex-col
            min-h-[300px]
            pb-8
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Contenedor superior con estado editable */}
          <div className="flex justify-between items-start">
            <select
              aria-label="Estado de la tarea"
              value={editableStatus}
              onChange={(e) => setEditableStatus(e.target.value as Status)}
              className={`
                rounded-lg px-4 py-1 font-semibold shadow-md select-none w-max self-start
                outline-none cursor-pointer
                ${statusColors[editableStatus]}
              `}
            >
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="COMPLETED">Completado</option>
              <option value="DEPLOYED">Desplegado</option>
            </select>
          </div>

          {/* Nombre no editable */}
          <input
            id="modal-title"
            type="text"
            value={taskName}
            readOnly
            className="
              text-3xl font-extrabold mt-4 mb-6 bg-transparent border-b border-gray-600
              text-[#a0a0a0]
              select-text w-full
              cursor-not-allowed
            "
            aria-label="Nombre no editable de la tarea"
          />

          {/* Desarrolladores no editable */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-500 mb-2 select-none">
              Desarrolladores
            </h3>

            <div className="flex items-center gap-2 overflow-x-auto">
              {developers.map((dev, idx) => (
                <div
                  key={dev.id}
                  title={dev.email}
                  className="
                    w-9 h-9 rounded-full border-2 border-[#121212] shadow-sm
                    flex justify-center items-center flex-shrink-0
                    font-bold text-base text-[#222]
                  "
                  style={{
                    marginLeft: idx === 0 ? 0 : -10,
                    backgroundColor: dev.photoUrl
                      ? "transparent"
                      : getRandomColor(dev.email),
                    cursor: "default",
                    userSelect: "none",
                  }}
                >
                  {dev.photoUrl ? (
                    <img
                      src={dev.photoUrl}
                      alt={dev.email}
                      className="w-full h-full object-cover block rounded-full"
                    />
                  ) : (
                    <span>{dev.email[0].toUpperCase()}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Puntos no editable */}
          <section className="flex flex-grow items-center justify-center gap-12 select-none">
            <div className="flex flex-col items-center w-24">
              <label
                htmlFor="points-input"
                className="text-sm text-gray-500 mb-1"
              >
                Puntos
              </label>
              <input
                id="points-input"
                type="number"
                min={0}
                value={points}
                readOnly
                className="
                  text-lg font-semibold text-center bg-transparent border border-gray-600 
                  rounded-md text-gray-500 px-2 py-1 w-full
                  cursor-not-allowed
                "
                aria-label="Puntos no editables"
              />
            </div>

            <div className="flex flex-col items-center w-40">
              <label
                htmlFor="hours-input"
                className="text-sm text-gray-500 mb-1"
              >
                Horas de desarrollo
              </label>
              <input
                id="hours-input"
                type="number"
                min={0}
                value={developmentHours}
                readOnly
                className="
                  text-lg font-semibold text-center bg-transparent border border-gray-600 
                  rounded-md text-gray-500 px-2 py-1 w-full
                  cursor-not-allowed
                "
                aria-label="Horas de desarrollo no editables"
              />
            </div>
          </section>

          {/* Botones */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="
                px-6 py-2 rounded-md border border-green-400 bg-green-400/20
                text-green-400 font-semibold cursor-pointer
                transition-colors duration-300 ease-in-out
                hover:bg-green-400/40
              "
            >
              Guardar
            </button>
            <button
              onClick={onClose}
              type="button"
              className="
                px-6 py-2 rounded-md border border-white/30 bg-white/10
                text-[#e0e0e0] font-semibold cursor-pointer
                transition-colors duration-300 ease-in-out
                hover:bg-white/20
              "
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

function getRandomColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 60%, 70%)`;
}

export default EditDetailsTaskDeveloper;
