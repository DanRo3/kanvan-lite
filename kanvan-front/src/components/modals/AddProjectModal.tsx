"use client";
import React, { useState } from "react";
import ProjectAvatars, {
  Developer,
} from "@/components/project-component/ProjectAvatars";
import AddDevModal from "@/components/modals/AddDevModal";
import { createProject } from "@/api/projects/service/project.service";

interface User {
  id: string;
  email: string;
}

interface AddProjectModalProps {
  developers: Developer[]; // usuarios disponibles para asignar
  onCreate: (project: any) => void; // puedes tipar si quieres mejor
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

  const [selectedDevelopers, setSelectedDevelopers] = useState<Developer[]>([]);
  const [isAddDevModalOpen, setIsAddDevModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // para controlar estado de carga

  const openAddDevModal = () => setIsAddDevModalOpen(true);
  const closeAddDevModal = () => setIsAddDevModalOpen(false);

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

  const handleRemoveDeveloper = () => {
    if (selectedDevelopers.length === 0) return;
    setSelectedDevelopers(selectedDevelopers.slice(0, -1));
  };

  const handleCreate = async () => {
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

    setLoading(true);

    try {
      // Prepara el DTO esperado por el backend
      const projectData = {
        name: projectName.trim(),
        description: description.trim(),
        deadline: new Date(dueDate), // porque tu DTO requiere Date
        pointsBudget: points,
        // Si tu backend admite developers en create, agrégalo aquí y a DTO (no aparece ahora)
        // developers: selectedDevelopers,
      };

      const createdProject = await createProject(projectData);

      // Elimina campos innecesarios para onCreate, o pasa el proyecto completo según necesidad
      onCreate(createdProject);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error creando proyecto:", error);
      alert("Error al crear el proyecto. Intenta de nuevo.");
    }
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

          {/* Formulario ... igual que tienes, omitido por brevedad */}

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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCreate}
              className="px-5 py-2 rounded-md border border-green-400 bg-green-400/30 font-semibold cursor-pointer text-green-400 hover:bg-green-400/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Proyecto"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-white/30 bg-white/10 font-semibold cursor-pointer text-[#e0e0e0] hover:bg-white/20 transition"
              disabled={loading}
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
