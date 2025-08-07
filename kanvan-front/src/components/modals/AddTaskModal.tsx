"use client";
import React, { useState } from "react";
import ProjectAvatars, {
  Developer,
} from "@/components/project-component/ProjectAvatars";
import AddDevModal from "@/components/modals/AddDevModal";

interface User {
  id: string;
  email: string;
}

interface AddTaskModalProps {
  developers: Developer[]; // usuarios disponibles para asignar (todos los usuarios que podrían agregarse)
  onCreate: (task: {
    name: string;
    points: number;
    developmentHours: number;
    developers: Developer[];
  }) => void;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  developers: allDevelopers,
  onCreate,
  onClose,
}) => {
  const [taskName, setTaskName] = useState("");
  const [points, setPoints] = useState(0);
  const [developmentHours, setDevelopmentHours] = useState(0);

  // Estado local para desarrolladores asignados a esta nueva tarea
  const [selectedDevelopers, setSelectedDevelopers] = useState<Developer[]>([]);

  // Estado para controlar modal agregar devs
  const [isAddDevModalOpen, setIsAddDevModalOpen] = useState(false);

  // Abrir modal AddDevModal
  const openAddDevModal = () => setIsAddDevModalOpen(true);

  // Cerrar modal AddDevModal
  const closeAddDevModal = () => setIsAddDevModalOpen(false);

  // Al agregar usuario desde AddDevModal, actualizar selectedDevelopers si no está duplicado
  const handleAddUserToSelected = (user: User) => {
    if (selectedDevelopers.find((d) => d.id === user.id)) {
      alert("El desarrollador ya está agregado a la tarea.");
      return;
    }
    setSelectedDevelopers((prev) => [
      ...prev,
      { id: user.id, email: user.email },
    ]);
    closeAddDevModal();
  };

  // Handler para remover último developer asignado
  const handleRemoveDeveloper = () => {
    if (selectedDevelopers.length === 0) return;
    setSelectedDevelopers(selectedDevelopers.slice(0, -1));
  };

  const handleCreate = () => {
    if (!taskName.trim()) {
      alert("Por favor, ingresa el nombre de la tarea.");
      return;
    }
    if (points <= 0) {
      alert("Los puntos deben ser mayor que cero.");
      return;
    }
    if (developmentHours <= 0) {
      alert("Las horas de desarrollo deben ser mayor que cero.");
      return;
    }
    onCreate({
      name: taskName.trim(),
      points,
      developmentHours,
      developers: selectedDevelopers,
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-task-title"
          className="bg-[#121212]/90 backdrop-blur-md rounded-xl shadow-lg max-w-md w-full text-[#e0e0e0] p-6 font-sans"
        >
          <h2 id="add-task-title" className="text-2xl font-bold mb-6">
            Agregar Tarea
          </h2>

          {/* Campo Tarea */}
          <label htmlFor="task-name" className="block font-semibold mb-1">
            Tarea
          </label>
          <input
            id="task-name"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Nombre de la tarea"
            className="mb-5 w-full rounded-md border border-green-400 bg-[#222] px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-green-500"
          />

          {/* Puntos con spinner */}
          <label htmlFor="points" className="block font-semibold mb-1">
            Puntos
          </label>
          <input
            id="points"
            type="number"
            min={0}
            step={1}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="mb-5 w-full rounded-md border border-green-400 bg-[#222] px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-green-500"
          />

          {/* Horas de desarrollo con spinner */}
          <label htmlFor="dev-hours" className="block font-semibold mb-1">
            Horas de desarrollo
          </label>
          <input
            id="dev-hours"
            type="number"
            min={0}
            step={1}
            value={developmentHours}
            onChange={(e) => setDevelopmentHours(Number(e.target.value))}
            className="mb-5 w-full rounded-md border border-green-400 bg-[#222] px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-green-500"
          />

          {/* Desarrolladores con ProjectAvatars */}
          <div className="mb-6 font-semibold text-lg text-gray-400">
            Desarrolladores
          </div>

          <ProjectAvatars
            developers={selectedDevelopers}
            onAdd={openAddDevModal} // Aquí abrimos el modal al hacer clic en +
            onRemove={handleRemoveDeveloper}
            showButtons={true}
          />

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCreate}
              className="px-5 py-2 rounded-md border border-green-400 bg-green-400/30 font-semibold cursor-pointer text-green-400 hover:bg-green-400/60 transition"
            >
              Crear Tarea
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-white/30 bg-white/10 font-semibold cursor-pointer text-[#e0e0e0] hover:bg-white/20 transition"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Modal para agregar desarrolladores */}
      {isAddDevModalOpen && (
        <AddDevModal
          users={allDevelopers}
          onAddUser={handleAddUserToSelected}
          onClose={closeAddDevModal}
        />
      )}
    </>
  );
};

export default AddTaskModal;
