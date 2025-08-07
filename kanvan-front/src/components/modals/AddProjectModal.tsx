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

interface AddProjectModalProps {
  developers: Developer[]; // usuarios disponibles para asignar
  onCreate: (project: {
    name: string;
    description: string;
    points: number;
    dueDate: string;
    developers: Developer[];
  }) => void;
  onClose: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  developers: allDevelopers,
  onCreate,
  onClose,
}) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [dueDate, setDueDate] = useState("");

  // Estado local para desarrolladores asignados a este nuevo proyecto
  const [selectedDevelopers, setSelectedDevelopers] = useState<Developer[]>([]);

  // Estado para controlar modal agregar devs
  const [isAddDevModalOpen, setIsAddDevModalOpen] = useState(false);

  // Abrir modal AddDevModal
  const openAddDevModal = () => setIsAddDevModalOpen(true);

  // Cerrar modal AddDevModal
  const closeAddDevModal = () => setIsAddDevModalOpen(false);

  // Agregar usuario seleccionado desde AddDevModal si no está duplicado
  const handleAddUserToSelected = (user: User) => {
    if (selectedDevelopers.find((d) => d.id === user.id)) {
      alert("El desarrollador ya está agregado al proyecto.");
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
    if (!projectName.trim()) {
      alert("Por favor, ingresa el nombre del proyecto.");
      return;
    }
    if (!description.trim()) {
      alert("Por favor, ingresa la descripción del proyecto.");
      return;
    }
    if (points <= 0) {
      alert("Los puntos deben ser mayor que cero.");
      return;
    }
    if (!dueDate) {
      alert("Por favor, selecciona una fecha de entrega.");
      return;
    }
    onCreate({
      name: projectName.trim(),
      description: description.trim(),
      points,
      dueDate,
      developers: selectedDevelopers,
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-project-title"
          className="bg-[#121212]/90 backdrop-blur-md rounded-xl shadow-lg max-w-md w-full text-[#e0e0e0] p-6 font-sans"
        >
          <h2 id="add-project-title" className="text-2xl font-bold mb-6">
            Agregar Proyecto
          </h2>

          {/* Nombre del Proyecto */}
          <label htmlFor="project-name" className="block font-semibold mb-1">
            Nombre del Proyecto
          </label>
          <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Nombre del proyecto"
            className="mb-5 w-full rounded-md border border-green-400 bg-[#222] px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-green-500"
          />

          {/* Descripción */}
          <label
            htmlFor="project-description"
            className="block font-semibold mb-1"
          >
            Descripción
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del proyecto"
            rows={4}
            className="mb-5 w-full rounded-md border border-green-400 bg-[#222] px-3 py-2 text-[#e0e0e0] resize-y focus:outline-none focus:border-green-500"
          />

          {/* Puntos del Proyecto */}
          <label htmlFor="project-points" className="block font-semibold mb-1">
            Puntos del Proyecto
          </label>
          <input
            id="project-points"
            type="number"
            min={0}
            step={1}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="mb-5 w-full rounded-md border border-green-400 bg-[#222] px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-green-500"
          />

          {/* Fecha de Entrega */}
          <label
            htmlFor="project-due-date"
            className="block font-semibold mb-1"
          >
            Fecha de Entrega
          </label>
          <input
            id="project-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mb-5 w-full rounded-md border border-green-400 bg-[#222] px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-green-500"
          />

          {/* Desarrolladores */}
          <div className="mb-6 font-semibold text-lg text-gray-400">
            Desarrolladores
          </div>
          <ProjectAvatars
            developers={selectedDevelopers}
            onAdd={openAddDevModal} // Abrir modal AddDevModal
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
              Crear Proyecto
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

export default AddProjectModal;
