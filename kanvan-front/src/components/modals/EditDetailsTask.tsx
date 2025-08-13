"use client";
import React, { useState, useEffect } from "react";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

type Status = "DEPLOYED" | "COMPLETED" | "PENDING" | "IN_PROGRESS";

interface EditDetailTaskModalProps {
  taskName: string;
  status: Status;
  developers: Developer[];
  points: number;
  developmentHours: number;
  onAddDeveloper: () => void;
  onRemoveDeveloper: () => void;
  onSave: (updated: {
    taskName: string;
    points: number;
    developmentHours: number;
    status: Status;
    developerIds: string[];
  }) => void;
  onClose: () => void;
  editable?: boolean; // Opcional para controlar edición general
}

const statusColors: Record<Status, string> = {
  DEPLOYED: "bg-green-400 text-gray-900",
  COMPLETED: "bg-yellow-400 text-gray-900",
  IN_PROGRESS: "bg-orange-700 text-gray-900",
  PENDING: "bg-red-400 text-gray-900",
};

const EditDetailTaskModal: React.FC<EditDetailTaskModalProps> = ({
  taskName: initialTaskName,
  status: initialStatus,
  developers,
  points: initialPoints,
  developmentHours: initialDevelopmentHours,
  onAddDeveloper,
  onRemoveDeveloper,
  onSave,
  onClose,
  editable = true,
}) => {
  const [taskName, setTaskName] = useState(initialTaskName);
  const [points, setPoints] = useState(initialPoints);
  const [developmentHours, setDevelopmentHours] = useState(
    initialDevelopmentHours
  );
  const [editableStatus, setEditableStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    setTaskName(initialTaskName);
  }, [initialTaskName]);
  useEffect(() => {
    setPoints(initialPoints);
  }, [initialPoints]);
  useEffect(() => {
    setDevelopmentHours(initialDevelopmentHours);
  }, [initialDevelopmentHours]);
  useEffect(() => {
    setEditableStatus(initialStatus);
  }, [initialStatus]);

  const handleSave = () => {
    const developerIds = developers.map((dev) => dev.id);

    onSave({
      taskName,
      points,
      developmentHours,
      status: editableStatus,
      developerIds, // Aquí envías los IDs actuales de developers para ser guardados
    });
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
          {/* Contenedor superior con estado y nombre separados */}
          <div className="flex justify-between items-start">
            {/* Estado editable con select */}
            {editable ? (
              <select
                aria-label="Estado de la tarea"
                value={editableStatus}
                onChange={(e) => setEditableStatus(e.target.value as Status)}
                className={`
                  rounded-lg px-4 py-1 font-semibold shadow-md select-none w-max self-start
                  outline-none cursor-pointer
                  ${statusColors[editableStatus]}
                `}
                disabled={!editable}
              >
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="red">Red</option>
              </select>
            ) : (
              <div
                className={`
                ${statusColors[initialStatus]}
                inline-block rounded-lg px-4 py-1 font-semibold shadow-md select-none w-max self-start
              `}
                aria-label={`Estado: ${
                  initialStatus.charAt(0).toUpperCase() + initialStatus.slice(1)
                }`}
              >
                {initialStatus.charAt(0).toUpperCase() + initialStatus.slice(1)}
              </div>
            )}
          </div>

          {/* Nombre editable, debajo del estado con margen separador */}
          <input
            id="modal-title"
            type="text"
            value={taskName}
            onChange={editable ? (e) => setTaskName(e.target.value) : undefined}
            readOnly={!editable}
            className={`
              text-3xl font-extrabold mt-4 mb-6 bg-transparent border-b border-gray-600
              focus:outline-none ${editable ? "focus:border-green-400" : ""}
              text-[#e0e0e0]
              select-text w-full
              ${!editable ? "cursor-not-allowed" : ""}
            `}
            aria-label="Nombre editable de la tarea"
          />

          {/* --- Desarrolladores primero --- */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-2 select-none">
              Desarrolladores
            </h3>

            <div className="flex items-center gap-2 overflow-x-auto">
              {editable && (
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
              )}

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

              {editable && (
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
              )}
            </div>
          </section>

          {/* Puntos y Horas de desarrollo editables y centrados */}
          <section className="flex flex-grow items-center justify-center gap-12 select-none">
            <div className="flex flex-col items-center w-24">
              <label
                htmlFor="points-input"
                className="text-sm text-gray-400 mb-1"
              >
                Puntos
              </label>
              <input
                id="points-input"
                type="number"
                min={0}
                value={points}
                onChange={
                  editable
                    ? (e) => {
                        const val = parseInt(e.target.value);
                        setPoints(isNaN(val) ? 0 : val);
                      }
                    : undefined
                }
                readOnly={!editable}
                className={`
                  text-lg font-semibold text-center bg-transparent border border-gray-600 
                  rounded-md text-[#e0e0e0] px-2 py-1 w-full
                  focus:outline-none focus:border-green-400
                  ${editable ? "" : "cursor-not-allowed"}
                `}
                aria-label="Puntos editables"
              />
            </div>

            <div className="flex flex-col items-center w-40">
              <label
                htmlFor="hours-input"
                className="text-sm text-gray-400 mb-1"
              >
                Horas de desarrollo
              </label>
              <input
                id="hours-input"
                type="number"
                min={0}
                value={developmentHours}
                onChange={
                  editable
                    ? (e) => {
                        const val = parseInt(e.target.value);
                        setDevelopmentHours(isNaN(val) ? 0 : val);
                      }
                    : undefined
                }
                readOnly={!editable}
                className={`
                  text-lg font-semibold text-center bg-transparent border border-gray-600 
                  rounded-md text-[#e0e0e0] px-2 py-1 w-full
                  focus:outline-none focus:border-green-400
                  ${editable ? "" : "cursor-not-allowed"}
                `}
                aria-label="Horas de desarrollo editables"
              />
            </div>
          </section>

          {/* Botones guardar y salir */}
          <div className="mt-6 flex justify-end gap-4">
            {editable && (
              <button
                onClick={handleSave}
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
            )}

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

export default EditDetailTaskModal;
