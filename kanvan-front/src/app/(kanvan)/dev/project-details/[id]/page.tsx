"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Risk from "@/api/risks/interface/input/risk.input.dto";
import RiskCard from "@/components/project-component/RisksCard";
import QualityCard from "@/components/project-component/QualityCard";
import ProjectTasksPage from "@/components/project-component/TasksProjectComponent";
import ProjectAvatars from "@/components/project-component/ProjectAvatars";

import { getProjectById } from "@/api/projects/service/project.service";
import CreateProjectOutputDto from "@/api/projects/interface/output/create-project.output.dto";

import { RiskScope } from "@/api/risks/enums/risk-scope.enum";

import {
  getTasksByProjectId,
  updateTaskStatus,
} from "@/api/tasks/services/task.service";

import { ProjectStatus } from "@/api/projects/interface/input/update-project.input.dto";
import {
  getAllDevelopers,
  getDevelopersByProjectId,
} from "@/api/user/service/user.service";

import UpdateTaskInputDto from "@/api/tasks/interface/input/update-task.input.dto";
import UpdateTaskOutputDto from "@/api/tasks/interface/output/update-task.output.dto";
import { updateTask } from "@/api/tasks/services/task.service";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DEPLOYED";
  developers: Developer[];
  href: string;
  points: number;
  developmentHours: number;
}

import { useDebounce } from "@/hooks/useDebounce.hook";
import { TaskStatus } from "@/api/tasks/interface/output/create-task.output.dto";
import TopMenu from "@/components/layout/TopMenu";
import EditDetailsTaskDeveloper from "@/components/modals/EditDetailsTaskDeveloper";

const projectStatusOptions: {
  value: ProjectStatus;
  label: string;
  color: "green" | "yellow" | "red";
}[] = [
  { value: "PLANNED", label: "Planificado", color: "red" },
  { value: "IN_PROGRESS", label: "En progreso", color: "yellow" },
  { value: "COMPLETED", label: "Completado", color: "green" },
];

// Helper para mapear status numérico o string a Task["status"]
const mapTaskStatus = (status: number | string): Task["status"] => {
  if (typeof status === "string") {
    const s = status.toUpperCase();
    if (
      s === "PENDING" ||
      s === "IN_PROGRESS" ||
      s === "COMPLETED" ||
      s === "DEPLOYED"
    )
      return s as Task["status"];
  }
  const map: Record<number, Task["status"]> = {
    0: "PENDING",
    1: "IN_PROGRESS",
    2: "COMPLETED",
    3: "DEPLOYED",
  };
  return map[Number(status)] || "PENDING";
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const { id } = params;

  const projectId = Array.isArray(id) ? id[0] : id;

  const [projectData, setProjectData] = useState<CreateProjectOutputDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pointsDone, setPointsDone] = useState(0);
  const [pointsTotal, setPointsTotal] = useState(0);
  const [description, setDescription] = useState("");
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);

  const [status, setStatus] = useState<"green" | "yellow" | "red">("green");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isAddDevModalOpen, setIsAddDevModalOpen] = useState(false);

  const [criticalBugs, setCriticalBugs] = useState(0);
  const [normalBugs, setNormalBugs] = useState(0);
  const [lowBugs, setLowBugs] = useState(0);
  const [testsCoberage, setTestsCoberage] = useState(0);

  const debouncedCriticalBugs = useDebounce(criticalBugs, 450);
  const debouncedNormalBugs = useDebounce(normalBugs, 450);
  const debouncedLowBugs = useDebounce(lowBugs, 450);
  const debouncedTestsCoberage = useDebounce(testsCoberage, 450);

  const debouncedProjectName = useDebounce(projectName, 450);
  const debouncedDescription = useDebounce(description, 450);
  const debouncedDueDate = useDebounce(dueDate, 450);
  const debouncedPointsDone = useDebounce(pointsDone, 450);
  const debouncedPointsTotal = useDebounce(pointsTotal, 450);
  const [projectStatusLocal, setProjectStatusLocal] = useState<ProjectStatus>(
    projectData?.status || "PLANNED"
  );

  const debouncedProjectStatus = useDebounce(projectStatusLocal, 450);

  const scopesList: RiskScope[] = ["LOW", "NORMAL", "CRITICAL"];
  const [allDevelopers, setAllDevelopers] = useState<Developer[]>([]);

  const [allAvailableUsers, setAllAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    // Actualiza el valor inicial al cargar o cuando cambia la fecha de vencimiento
    setDaysRemaining(calcDaysRemaining());

    // Configura un intervalo para actualizar el valor cada hora
    const interval = setInterval(() => {
      setDaysRemaining(calcDaysRemaining());
    }, 1000 * 60 * 60);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [dueDate]);

  const handleDrop = async (taskId: string, newStatus: Status) => {
    console.log(`Tarea ${taskId} movida a ${newStatus}`);
    // Encuentra la tarea en el estado actual
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    // Pre-optimista: actualiza el estado local de inmediato
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      // Prepara el DTO para la API
      const updateDto: UpdateTaskInputDto = {
        title: taskToUpdate.name,
        points: taskToUpdate.points,
        developmentHours: taskToUpdate.developmentHours,
        status: newStatus,
        developerIds: taskToUpdate.developers.map((d) => d.id),
      };

      // Llama a la API para actualizar en el backend
      await updateTaskStatus(taskId, updateDto);
      console.log(`Tarea ${taskId} actualizada en el backend.`);
    } catch (error) {
      console.error(`Error al actualizar la tarea ${taskId}:`, error);
      // Revertir el estado si la API falla
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: taskToUpdate.status } : t
        )
      );
      // Reemplazar alert con un modal o mensaje de UI
      console.log(
        "No se pudo actualizar el estado de la tarea. Intenta nuevamente."
      );
    }
  };

  useEffect(() => {
    const loadAvailableUsers = async () => {
      if (!projectId || !selectedTask) {
        setAllAvailableUsers([]);
        return;
      }
      try {
        const usersInProject = await getDevelopersByProjectId(projectId);
        const assignedUserIds = selectedTask.developers.map((d) => d.id);
        const available = usersInProject.filter(
          (user) => !assignedUserIds.includes(user.id)
        );
        setAllAvailableUsers(available);
      } catch (error) {
        console.error("Error cargando desarrolladores para proyecto:", error);
        setAllAvailableUsers([]);
      }
    };
    loadAvailableUsers();
  }, [projectId, selectedTask]);

  // Carga inicial y actualización del estado de la UI
  useEffect(() => {
    if (!projectId) {
      setError("No se especificó el ID del proyecto");
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectById(projectId);
        setProjectData(data);
        setProjectName(data.name);
        setDueDate(
          data.deadline
            ? new Date(data.deadline).toISOString().slice(0, 10)
            : ""
        );
        setPointsDone(data.pointsUsed ?? 0);
        setPointsTotal(data.pointsBudget ?? 0);
        setDescription(data.description ?? "");

        // Sincroniza el estado local con el dato recibido del backend
        setProjectStatusLocal(data.status);

        setDevelopers(
          data.developers.map((d) => ({
            id: d.id,
            email: d.email,
            photoUrl: null,
          }))
        );
        setRisks(
          data.risks.map((r) => ({
            id: r.id,
            name: r.name ?? "",
            scope: typeof r.scope === "string" ? r.scope.toUpperCase() : "LOW",
          }))
        );

        setCriticalBugs(data.criticalBugs ?? 0);
        setNormalBugs(data.normalBugs ?? 0);
        setLowBugs(data.lowBugs ?? 0);
        setTestsCoberage(data.testsCoberage ?? 0);

        const statusMapping = projectStatusOptions.find(
          (s) => s.value === data.status
        );
        setStatus(statusMapping?.color ?? "red");

        await reloadTasks();
        await loadAllDevelopers();
        setLoading(false);
      } catch (e) {
        setError("Error al cargar el proyecto");
        setLoading(false);
        console.error("Error cargando proyecto:", e);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const statusMapping = projectStatusOptions.find(
      (s) => s.value === projectStatusLocal
    );
    setStatus(statusMapping?.color ?? "red");
  }, [projectStatusLocal]);

  const reloadTasks = async () => {
    if (!projectId) return;
    try {
      const loaded = await getTasksByProjectId(projectId);
      const mappedTasks: Task[] = loaded.map((t) => ({
        id: t.id,
        name: t.title,
        status: mapTaskStatus(t.status),
        developers:
          t.developers?.map((d) => ({
            id: d.id,
            email: d.email,
            photoUrl: null,
          })) ?? [],
        href: "#",
        points: t.points,
        developmentHours: t.developmentHours ?? 0,
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error("Error recargando tareas:", error);
    }
  };

  const loadAllDevelopers = async () => {
    try {
      const devs = await getAllDevelopers();
      console.log("Todos los desarrolladores:", devs);
      setAllDevelopers(devs);
    } catch (error) {
      console.error("Error cargando desarrolladores:", error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const closeModal = () => setSelectedTask(null);

  const handleSaveTaskFromModal = async (updatedData: {
    taskName: string;
    points: number;
    developmentHours: number;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DEPLOYED";
    developerIds: string[];
  }) => {
    if (!selectedTask) return;
    try {
      const updateTaskDto: UpdateTaskInputDto = {
        title: updatedData.taskName,
        points: updatedData.points,
        developmentHours: updatedData.developmentHours,
        status: updatedData.status,
        developerIds: updatedData.developerIds,
      };
      const updatedTask: UpdateTaskOutputDto = await updateTaskStatus(
        selectedTask.id,
        updateTaskDto
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id
            ? {
                ...task,
                name: updatedTask.title,
                points: updatedTask.points,
                developmentHours: updatedTask.developmentHours ?? 0,
                status: updatedTask.status,
                developers: updatedTask.developers.map((d) => ({
                  id: d.id,
                  email: d.email,
                  photoUrl: null,
                })),
              }
            : task
        )
      );
      setSelectedTask(null);
    } catch (error) {
      console.error("Error actualizando tarea:", error);
      alert("No se pudo guardar la tarea. Intente nuevamente.");
    }
  };

  const saveTaskChanges = () => {
    alert("Guardar cambios para tarea: " + (selectedTask?.name ?? ""));
    closeModal();
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

  if (loading) return <p className="p-6 text-center">Cargando proyecto...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!projectData)
    return <p className="p-6 text-center">No se encontró el proyecto.</p>;

  // Función auxiliar para obtener el label del estado
  const getStatusLabel = () => {
    const currentStatus = projectStatusOptions.find(
      (s) => s.value === projectData.status
    );
    return currentStatus ? currentStatus.label : "Desconocido";
  };

  return (
    <div className="bg-gray-800 text-gray-200 min-h-screen">
      <TopMenu role="developer" />
      <div className="container mx-auto px-6 py-20">
        <DndProvider backend={HTML5Backend}>
          <main
            className={`p-10 min-h-screen relative font-sans bg-[#121212] text-[#e0e0e0] ${
              selectedTask
                ? "filter blur-sm brightness-90 pointer-events-none select-none"
                : ""
            }`}
            style={{
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            {/* Estado del proyecto (ya no editable) */}
            <div
              title={`Estado: ${getStatusLabel()}`}
              className="absolute top-5 right-5 min-w-[100px] h-12 px-3 rounded-lg shadow-md flex items-center justify-center font-bold text-sm text-[#121212]"
              style={{
                backgroundColor: statusColors[status],
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              }}
            >
              <span>{getStatusLabel()}</span>
            </div>

            {/* Nombre del proyecto (ya no editable) */}
            <h1 className="text-4xl font-extrabold mb-3 w-full bg-transparent border-none outline-none text-green-400 font-sans">
              {projectData.name}
            </h1>

            {/* Fecha, puntos y descripción (ya no editables) */}
            <div className="flex flex-wrap gap-12 mb-3 text-gray-400 font-semibold text-lg items-start">
              <div className="flex flex-col gap-1.5 w-44">
                <span className="text-lg text-[#e0e0e0] font-semibold">
                  {dueDate}
                </span>
                <span>Quedan {daysRemaining} días para finalizar</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span>Puntos obtenidos</span>
                  <span className="w-14 text-lg font-bold text-right text-[#e0e0e0]">
                    {projectData.pointsUsed ?? 0}
                  </span>
                </div>
                <div className="font-bold text-lg text-gray-400 select-none pb-6">
                  /
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span>Puntos totales</span>
                  <span className="w-14 text-lg font-bold text-right text-[#e0e0e0]">
                    {projectData.pointsBudget ?? 0}
                  </span>
                </div>
              </div>

              <div className="mt-1.5 text-cyan-300 font-semibold text-sm text-center w-[372px] ml-12">
                Faltan {pointsTotal - pointsDone} puntos para completar el
                proyecto
              </div>
            </div>

            {/* Desarrolladores */}
            <div className="mt-6 mb-2 font-semibold text-lg text-gray-400">
              Desarrolladores
            </div>
            <ProjectAvatars
              developers={developers}
              showButtons={false}
              onAdd={() => {}}
              onRemove={() => {}}
            />

            {/* Descripción del Proyecto (ya no editable) */}
            <div className="mt-6 mb-2 font-semibold text-lg text-gray-400">
              Descripción del Proyecto
            </div>
            <p className="mt-2 w-full bg-white/5 border border-green-400 rounded-xl text-[#e0e0e0] text-base p-3 font-sans resize-y min-h-[150px]">
              {projectData.description ?? ""}
            </p>

            <ProjectTasksPage
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onDelete={() => {}}
              onDrop={handleDrop}
              showDeleteButton={false}
            />

            {/* Riesgos */}
            <RiskCard
              risks={risks}
              showAddButton={false}
              onAddRisk={() => {}}
              onDeleteRisk={() => {}}
            />

            {/* Calidad */}
            <QualityCard
              editable={false}
              criticalBugs={criticalBugs}
              normalBugs={normalBugs}
              lowBugs={lowBugs}
              testsCoberage={testsCoberage}
              onMetricChange={() => {}}
            />

            {/* Botones Guardar y Salir */}
            <div className="flex gap-3 mt-6 justify-end">
              <button
                type="button"
                onClick={() =>
                  alert("Salir de la edición (implementar lógica)")
                }
                className="px-6 py-2 rounded-md border border-white/30 bg-white/10 text-[#e0e0e0] font-semibold cursor-pointer transition-colors duration-300 ease-in-out hover:bg-white/20"
              >
                Salir
              </button>
            </div>
          </main>

          {/* Modal editar tarea */}
          {selectedTask && (
            <EditDetailsTaskDeveloper
              taskName={selectedTask.name}
              status={selectedTask.status}
              developers={selectedTask.developers}
              points={selectedTask.points}
              developmentHours={selectedTask.developmentHours}
              allAvailableUsers={allAvailableUsers}
              onSave={handleSaveTaskFromModal}
              onClose={closeModal}
            />
          )}
        </DndProvider>
      </div>
    </div>
  );
}
