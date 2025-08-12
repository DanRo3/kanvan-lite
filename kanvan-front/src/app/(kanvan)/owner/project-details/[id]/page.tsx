"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import RiskCard, { Risk } from "@/components/project-component/RisksCard";
import QualityCard from "@/components/project-component/QualityCard";
import TasksProjectComponent from "@/components/project-component/TasksProjectComponent";
import ProjectAvatars from "@/components/project-component/ProjectAvatars";
import EditDetailTaskModal from "@/components/modals/EditDetailsTask";
import AddDevModal from "@/components/modals/AddDevModal";
import AddRiskModal from "@/components/modals/AddRiskModal";
import AddTaskModal from "@/components/modals/AddTaskModal";

import { getProjectById } from "@/api/projects/service/project.service";
import CreateProjectOutputDto from "@/api/projects/interface/output/create-project.output.dto";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

interface User {
  id: string;
  email: string;
}

interface Task {
  id: string;
  name: string;
  status: "red" | "yellow" | "green";
  developers: Developer[];
  href: string;
  points: number;
  developmentHours: number;
}

export default function Page() {
  const params = useParams();
  const { id } = params;

  // Estados base, se llenarán tras cargar la info desde backend
  const [projectData, setProjectData] = useState<CreateProjectOutputDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados derivados para UI editable
  const [projectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pointsDone, setPointsDone] = useState(0);
  const [pointsTotal, setPointsTotal] = useState(0);
  const [description, setDescription] = useState("");
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);

  // Estados modales, tareas y status
  const [status, setStatus] = useState<"green" | "yellow" | "red">("green");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddRiskModalOpen, setIsAddRiskModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddDevModalOpen, setIsAddDevModalOpen] = useState(false);

  const alcancesDesdeBD = ["Alcance 1", "Alcance 2", "Alcance 3"];
  const estadosDesdeBD: { value: "green" | "yellow" | "red"; label: string }[] =
    [
      { value: "green", label: "Green" },
      { value: "yellow", label: "Yellow" },
      { value: "red", label: "Red" },
    ];

  // Cargar proyecto desde API al montar el componente
  useEffect(() => {
    if (!id) {
      setError("No se especificó el ID del proyecto");
      setLoading(false);
      return;
    }

    const projectId = Array.isArray(id) ? id[0] : id;
    console.log(`EL ID DEL PROYECTO ES ${projectId}`);

    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(projectId);
        setProjectData(data);

        // Inicializar estados editables con datos recibidos
        setProjectName(data.name);
        setDueDate(
          data.deadline
            ? new Date(data.deadline).toISOString().slice(0, 10)
            : ""
        ); // yyyy-MM-dd
        setPointsDone(data.pointsUsed ?? 0);
        setPointsTotal(data.pointsBudget ?? 0);
        setDescription(data.description ?? "");
        setDevelopers(
          data.developers.map((dev) => ({
            id: dev.id,
            email: dev.email,
            photoUrl: null,
          }))
        );
        setRisks(
          data.risks.map((r) => ({
            descripcion: r.name ?? "",
            impacto:
              r.scope === 2 /* CRITICAL*/
                ? "alto"
                : r.scope === 1 /* NORMAL */
                ? "medio"
                : "bajo",
          }))
        );

        // Mapear estado del proyecto a color Status básico (puedes ajustar)
        setStatus(
          data.status === "COMPLETED"
            ? "green"
            : data.status === "IN_PROGRESS"
            ? "yellow"
            : "red"
        );

        // Mapear tareas (adapta si el esquema no coincide)
        setTasks(
          data.tasks.map((t) => ({
            id: t.id,
            name: t.title,
            status:
              t.status === 2 /* COMPLETED */
                ? "green"
                : t.status === 1 /* IN_PROGRESS */
                ? "yellow"
                : "red",
            developers: developers.slice(0, 1), // o mapea los devs reales si tienes info
            href: "#",
            points: t.points,
            developmentHours: 0, // asigna según datos si tienes
          }))
        );

        setLoading(false);
      } catch (e) {
        console.error("Error cargando proyecto:", e);
        setError("Error al cargar el proyecto");
        setLoading(false);
      }
    };

    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // id como dependencia

  // Funciones modales y handlers similares a los tuyos

  const openAddRiskModal = () => setIsAddRiskModalOpen(true);
  const closeAddRiskModal = () => setIsAddRiskModalOpen(false);

  const handleAddRisk = (descripcion: string, alcance: string) => {
    let impacto: "bajo" | "medio" | "alto" = "bajo";
    if (alcance.toLowerCase().includes("alto")) impacto = "alto";
    else if (alcance.toLowerCase().includes("medio")) impacto = "medio";

    setRisks((prev) => [
      ...prev,
      {
        descripcion,
        impacto,
      },
    ]);
    closeAddRiskModal();
  };

  const openAddTaskModal = () => setIsAddTaskModalOpen(true);
  const closeAddTaskModal = () => setIsAddTaskModalOpen(false);

  const openAddDevModal = () => setIsAddDevModalOpen(true);
  const closeAddDevModal = () => setIsAddDevModalOpen(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const saveTaskChanges = () => {
    alert("Guardar cambios para tarea: " + (selectedTask?.name ?? ""));
    closeModal();
  };

  const addDeveloperToSelectedTask = () => {
    if (!selectedTask) return;
    const newDev: Developer = {
      id: (selectedTask.developers.length + 100).toString(),
      email: `nuevo${selectedTask.developers.length + 100}@example.com`,
      photoUrl: null,
    };
    setSelectedTask({
      ...selectedTask,
      developers: [...selectedTask.developers, newDev],
    });
  };

  const removeDeveloperFromSelectedTask = () => {
    if (!selectedTask) return;
    setSelectedTask({
      ...selectedTask,
      developers: selectedTask.developers.slice(
        0,
        Math.max(selectedTask.developers.length - 1, 0)
      ),
    });
  };

  const handleAddUserToProject = (user: User) => {
    if (developers.find((d) => d.id === user.id)) {
      alert("El desarrollador ya está agregado al proyecto.");
      return;
    }
    setDevelopers((prev) => [
      ...prev,
      { id: user.id, email: user.email, photoUrl: null },
    ]);
  };

  const calcDaysRemaining = () => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };
  const [daysRemaining, setDaysRemaining] = useState(calcDaysRemaining());
  useEffect(() => {
    const interval = setInterval(() => {
      setDaysRemaining(calcDaysRemaining());
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [dueDate]);

  const statusColors: Record<typeof status, string> = {
    green: "#4ade80",
    yellow: "#facc15",
    red: "#f87171",
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as "green" | "yellow" | "red");
  };

  if (loading) return <p className="p-6 text-center">Cargando proyecto...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!projectData)
    return <p className="p-6 text-center">No se encontró el proyecto.</p>;

  return (
    <>
      <main
        className={`p-10 min-h-screen relative font-sans bg-[#121212] text-[#e0e0e0] ${
          selectedTask || isAddDevModalOpen
            ? "filter blur-sm brightness-90 pointer-events-none select-none"
            : ""
        }`}
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          title={`Estado: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
          className="absolute top-5 right-5 min-w-[100px] h-12 px-3 rounded-lg shadow-md flex items-center justify-center font-bold text-sm text-[#121212]"
          style={{
            backgroundColor: statusColors[status],
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <select
            aria-label="Cambiar estado del proyecto"
            value={status}
            onChange={handleStatusChange}
            className="bg-transparent border-none outline-none cursor-pointer font-bold text-sm text-[#121212]"
            style={{ backgroundColor: "transparent" }}
          >
            {estadosDesdeBD.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          aria-label="Nombre del proyecto editable"
          className="text-4xl font-extrabold mb-3 w-full bg-transparent border-none outline-none cursor-text text-green-400 font-sans"
        />

        <div className="flex flex-wrap gap-12 mb-3 text-gray-400 font-semibold text-lg items-start">
          <div className="flex flex-col gap-1.5 w-44">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Fecha de entrega editable"
              className="text-lg text-[#e0e0e0] bg-transparent border border-green-400 rounded-lg px-2 py-1 cursor-text outline-none w-44 font-semibold"
            />
            <span>Quedan {daysRemaining} días para finalizar</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <span>Puntos obtenidos</span>
              <input
                type="number"
                min={0}
                max={pointsTotal}
                value={pointsDone}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val)) val = 0;
                  if (val > pointsTotal) val = pointsTotal;
                  if (val < 0) val = 0;
                  setPointsDone(val);
                }}
                aria-label="Puntos obtenidos editables"
                className="w-14 text-lg font-bold text-right border border-green-400 rounded-lg bg-transparent text-[#e0e0e0] px-1.5 py-0.5 cursor-text outline-none"
              />
            </div>
            <div className="font-bold text-lg text-gray-400 select-none pb-6">
              /
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>Puntos totales</span>
              <input
                type="number"
                min={pointsDone}
                value={pointsTotal}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val)) val = 0;
                  if (val < pointsDone) val = pointsDone;
                  setPointsTotal(val);
                }}
                aria-label="Puntos totales editables"
                className="w-14 text-lg font-bold text-right border border-green-400 rounded-lg bg-transparent text-[#e0e0e0] px-1.5 py-0.5 cursor-text outline-none"
              />
            </div>
          </div>

          <div className="mt-1.5 text-cyan-300 font-semibold text-sm text-center w-[372px] ml-12">
            Faltan {pointsTotal - pointsDone} puntos para completar el proyecto
          </div>
        </div>

        <div className="mt-6 mb-2 font-semibold text-lg text-gray-400">
          Desarrolladores
        </div>
        <ProjectAvatars
          developers={developers}
          showButtons={true}
          onAdd={openAddDevModal}
          onRemove={() => alert("Borrado")}
        />

        <div className="mt-6 mb-2 font-semibold text-lg text-gray-400">
          Descripción del Proyecto
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          aria-label="Descripción editable del proyecto"
          className="mt-2 w-full bg-white/5 border border-green-400 rounded-xl text-[#e0e0e0] text-base p-3 font-sans resize-y min-h-[150px] outline-none"
        />

        <div className="flex justify-start mt-6 mb-3">
          <button
            type="button"
            aria-label="Crear nueva tarea"
            onClick={openAddTaskModal}
            className="px-6 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-[#e0e0e0] font-semibold cursor-pointer shadow-[0_8px_32px_rgba(31,38,135,0.37)] transition duration-300 ease-in-out hover:bg-white/20 hover:shadow-[0_10px_40px_rgba(31,38,135,0.6)] select-none whitespace-nowrap"
          >
            + Nueva Tarea
          </button>
        </div>

        <TasksProjectComponent tasks={tasks} onTaskClick={handleTaskClick} />

        <RiskCard
          risks={risks}
          showAddButton={true}
          onAddRisk={openAddRiskModal}
        />

        <QualityCard editable={true} />

        <div className="flex gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={() => alert("Guardar cambios (implementar lógica)")}
            className="px-6 py-2 rounded-md border border-white/30 bg-white/10 text-[#e0e0e0] font-semibold cursor-pointer transition-colors duration-300 ease-in-out hover:bg-white/20"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => alert("Salir de la edición (implementar lógica)")}
            className="px-6 py-2 rounded-md border border-white/30 bg-white/10 text-[#e0e0e0] font-semibold cursor-pointer transition-colors duration-300 ease-in-out hover:bg-white/20"
          >
            Salir
          </button>
        </div>
      </main>

      {selectedTask && (
        <EditDetailTaskModal
          taskName={selectedTask.name}
          status={selectedTask.status}
          developers={selectedTask.developers}
          points={selectedTask.points}
          developmentHours={selectedTask.developmentHours}
          onAddDeveloper={addDeveloperToSelectedTask}
          onRemoveDeveloper={removeDeveloperFromSelectedTask}
          onSave={saveTaskChanges}
          onClose={closeModal}
        />
      )}

      {isAddRiskModalOpen && (
        <AddRiskModal
          scopes={alcancesDesdeBD}
          onSave={handleAddRisk}
          onClose={closeAddRiskModal}
        />
      )}

      {isAddTaskModalOpen && (
        <AddTaskModal
          developers={developers}
          onCreate={(newTask) => {
            setTasks((prev) => [
              ...prev,
              {
                ...newTask,
                id: `t${prev.length + 1}`,
                status: "green", // o estado inicial por defecto
                href: "#",
              },
            ]);
            closeAddTaskModal();
          }}
          onClose={closeAddTaskModal}
        />
      )}

      {isAddDevModalOpen && (
        <AddDevModal
          users={allUsers}
          onAddUser={handleAddUserToProject}
          onClose={closeAddDevModal}
        />
      )}
    </>
  );
}
