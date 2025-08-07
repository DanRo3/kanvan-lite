"use client";
import React from "react";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

type Status = "green" | "yellow" | "red";

interface EditDetailTaskModalProps {
  taskName: string;
  status: Status;
  developers: Developer[];
  points: number;
  developmentHours: number;
  onAddDeveloper: () => void;
  onRemoveDeveloper: () => void;
  onSave: () => void;
  onClose: () => void;
}

const statusColors: Record<Status, string> = {
  green: "bg-green-400 text-gray-900",
  yellow: "bg-yellow-400 text-gray-900",
  red: "bg-red-400 text-gray-900",
};

const EditDetailTaskModal: React.FC<EditDetailTaskModalProps> = ({
  taskName,
  status,
  developers,
  points,
  developmentHours,
  onAddDeveloper,
  onRemoveDeveloper,
  onSave,
  onClose,
}) => {
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
          {/* Estado (superior derecha) */}
          <div
            className={`
              ${statusColors[status]}
              absolute top-6 right-6
              inline-block rounded-lg px-4 py-1 font-semibold shadow-md select-none
              w-max
            `}
            aria-label={`Estado: ${
              status.charAt(0).toUpperCase() + status.slice(1)
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>

          {/* Título alineado a izquierda */}
          <h2
            id="modal-title"
            className="text-3xl font-extrabold mb-4 select-none text-left"
          >
            {taskName}
          </h2>

          {/* --- Desarrolladores primero --- */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-2 select-none">
              Desarrolladores
            </h3>

            <div className="flex items-center gap-2 overflow-x-auto">
              {/* Botón eliminar */}
              <button
                type="button"
                onClick={onRemoveDeveloper}
                aria-label="Eliminar desarrolladores"
                className="
                  bg-transparent border border-green-400 text-green-400
                  font-bold text-xl rounded-lg w-9 h-9
                  cursor-pointer flex items-center justify-center
                  select-none transition-colors duration-300 ease-in-out
                  hover:bg-green-300/30
                  flex-shrink-0
                "
              >
                &minus;
              </button>

              {/* Avatares */}
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

              {/* Botón añadir */}
              <button
                type="button"
                onClick={onAddDeveloper}
                aria-label="Agregar desarrolladores"
                className="
                  bg-transparent border border-green-400 text-green-400
                  font-bold text-xl rounded-lg w-9 h-9
                  cursor-pointer flex items-center justify-center
                  select-none transition-colors duration-300 ease-in-out
                  hover:bg-green-300/30
                  flex-shrink-0
                "
              >
                +
              </button>
            </div>
          </section>

          {/* Puntos y Horas de desarrollo centrados vertical y horizontal */}
          <section className="flex flex-grow items-center justify-center gap-12 select-none">
            <div className="flex flex-col items-center">
              <label className="text-sm text-gray-400 mb-1">Puntos</label>
              <div className="text-lg font-semibold">{points}</div>
            </div>

            <div className="flex flex-col items-center">
              <label className="text-sm text-gray-400 mb-1">
                Horas de desarrollo
              </label>
              <div className="text-lg font-semibold">{developmentHours}</div>
            </div>
          </section>

          {/* Botones guardar y salir, debajo */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onSave}
              type="button"
              className="
                px-6 py-2 rounded-md border border-white/30 bg-white/10
                text-[#e0e0e0] font-semibold cursor-pointer
                transition-colors duration-300 ease-in-out
                hover:bg-white/20
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

// Helper to generate pastel background color for avatar initials
function getRandomColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 60%, 70%)`;
}

export default EditDetailTaskModal;
