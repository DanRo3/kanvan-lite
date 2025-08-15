"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Risk from "@/api/risks/interface/input/risk.input.dto";
import RiskCard from "@/components/project-component/RisksCard";
import QualityCard from "@/components/project-component/QualityCard";
import ProjectTasksPage from "@/components/project-component/TasksProjectComponent";
import ProjectAvatars from "@/components/project-component/ProjectAvatars";
import EditDetailTaskModal from "@/components/modals/EditDetailsTask";
import AddDevModal from "@/components/modals/AddDevModal";
import AddRiskModal from "@/components/modals/AddRiskModal";
import AddTaskModal from "@/components/modals/AddTaskModal";

import {
  getProjectById,
  updateProject,
} from "@/api/projects/service/project.service";
import CreateProjectOutputDto from "@/api/projects/interface/output/create-project.output.dto";

import { createRisk, deleteRisk } from "@/api/risks/services/risk.service";
import CreateRiskInputDto from "@/api/risks/interface/input/create-risk.input.dto";
import { RiskScope } from "@/api/risks/enums/risk-scope.enum";

import {
  createTask,
  getTasksByProjectId,
  deleteTask,
} from "@/api/tasks/services/task.service";

import { ProjectStatus } from "@/api/projects/interface/input/update-project.input.dto";
import {
  getAllDevelopers,
  getDevelopersByProjectId,
} from "@/api/user/service/user.service";

import UpdateTaskInputDto from "@/api/tasks/interface/input/update-task.input.dto";
import UpdateTaskOutputDto from "@/api/tasks/interface/output/update-task.output.dto";
import { updateTask } from "@/api/tasks/services/task.service";

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

import DeleteDevModal from "@/components/modals/DeleteDevModal";
import { useDebounce } from "@/hooks/useDebounce.hook";

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

export default function Page() {
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
  const [isAddRiskModalOpen, setIsAddRiskModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddDevModalOpen, setIsAddDevModalOpen] = useState(false);

  const debouncedProjectName = useDebounce(projectName, 450);
  const debouncedDescription = useDebounce(description, 450);
  const debouncedDueDate = useDebounce(dueDate, 450);
  const debouncedPointsDone = useDebounce(pointsDone, 450);
  const debouncedPointsTotal = useDebounce(pointsTotal, 450);
  const [projectStatusLocal, setProjectStatusLocal] = useState<ProjectStatus>(
    projectData?.status || "PLANNED"
  );

  const debouncedProjectStatus = useDebounce(projectStatusLocal, 450);

  const [isDeleteDevModalOpenForProject, setIsDeleteDevModalOpenForProject] =
    useState(false);
  const [isDeleteDevModalOpenForTask, setIsDeleteDevModalOpenForTask] =
    useState(false);

  const scopesList: RiskScope[] = ["LOW", "NORMAL", "CRITICAL"];
  const [allDevelopers, setAllDevelopers] = useState<Developer[]>([]);

  const [allAvailableUsers, setAllAvailableUsers] = useState<User[]>([]);

  const handleProjectStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value as ProjectStatus;
    setProjectStatusLocal(value); // actualiza el estado local que debounceamos
    const statusMapping = projectStatusOptions.find((s) => s.value === value);
    setStatus(statusMapping?.color ?? "red");
  };

  useEffect(() => {
    if (!projectId || !projectData) return;

    const safePointsTotal = Number.isFinite(debouncedPointsTotal)
      ? debouncedPointsTotal
      : 0;
    const safePointsDone = Number.isFinite(debouncedPointsDone)
      ? debouncedPointsDone
      : 0;
    const safeCriticalBugs = Number.isFinite(projectData.criticalBugs)
      ? projectData.criticalBugs
      : 0;
    const safeNormalBugs = Number.isFinite(projectData.normalBugs)
      ? projectData.normalBugs
      : 0;
    const safeLowBugs = Number.isFinite(projectData.lowBugs)
      ? projectData.lowBugs
      : 0;
    const safeTestsCoverage = Number.isFinite(projectData.testsCoberage)
      ? projectData.testsCoberage
      : 0;
    const safeDeadline =
      debouncedDueDate && !isNaN(Date.parse(debouncedDueDate))
        ? new Date(debouncedDueDate).toISOString()
        : undefined;

    const updateDto = {
      name: debouncedProjectName.trim() || projectData.name,
      description: debouncedDescription || "",
      status: debouncedProjectStatus,
      deadline: safeDeadline,
      pointsBudget: safePointsTotal,
      pointsUsed: safePointsDone,
      criticalBugs: safeCriticalBugs,
      normalBugs: safeNormalBugs,
      lowBugs: safeLowBugs,
      testsCoberage: safeTestsCoverage,
      developersIds: developers.map((d) => d.id),
    };

    console.log(updateDto);

    // Detecta si hay cambios para evitar actualizaciones innecesarias
    const hasChanges =
      debouncedProjectName.trim() !== (projectData.name || "").trim() ||
      debouncedDescription !== (projectData.description || "") ||
      debouncedProjectStatus !== projectData.status ||
      safeDeadline !== (projectData.deadline ?? undefined) ||
      safePointsTotal !== (projectData.pointsBudget ?? safePointsTotal) ||
      safePointsDone !== (projectData.pointsUsed ?? safePointsDone);

    if (!hasChanges) return;

    const saveChanges = async () => {
      try {
        const updated = await updateProject(projectId, updateDto);
        console.log(updated);
        setProjectData(updated);
      } catch (err) {
        console.error("Error actualizando proyecto automáticamente:", err);
      }
    };
    saveChanges();
  }, [
    debouncedProjectName,
    debouncedDescription,
    debouncedProjectStatus,
    debouncedDueDate,
    debouncedPointsDone,
    debouncedPointsTotal,
    projectId,
    projectData,
    developers,
  ]);

  useEffect(() => {
    setDaysRemaining(calcDaysRemaining());
  }, [dueDate]);

  const closeDeleteDevModalForProject = () =>
    setIsDeleteDevModalOpenForProject(false);

  const openDeleteDevModalForTask = () => setIsDeleteDevModalOpenForTask(true);
  const closeDeleteDevModalForTask = () =>
    setIsDeleteDevModalOpenForTask(false);

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

  const handleCreateTask = async (newTaskData: {
    name: string;
    points: number;
    developmentHours: number;
    developers: Developer[];
  }) => {
    if (!projectData) {
      alert("Proyecto no cargado.");
      return;
    }
    try {
      const createTaskDto = {
        title: newTaskData.name,
        points: newTaskData.points,
        developmentHours: newTaskData.developmentHours,
        projectId: projectData.id,
      };

      await createTask(createTaskDto);

      await reloadTasks();
      closeAddTaskModal();
    } catch (error) {
      console.error("Error creando tarea:", error);
      alert("Error al crear la tarea. Intenta nuevamente.");
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      if (selectedTask?.id === id) setSelectedTask(null);
    } catch (error) {
      console.error("Error eliminando tarea:", error);
      alert("No se pudo eliminar la tarea. Intente nuevamente.");
    }
  };

  const availableDevelopersToAdd = allDevelopers.filter(
    (dev) => !developers.some((pd) => pd.id === dev.id)
  );

  const handleAddUserToProject = async (user: Developer) => {
    if (!projectId || !projectData) {
      alert("Proyecto no válido");
      return;
    }

    try {
      const updatedDevelopersIds = [...developers.map((d) => d.id), user.id];

      const updateProjectDto = {
        name: projectName,
        description: description,
        status: projectData.status,
        deadline: dueDate || null,
        pointsBudget: pointsTotal,
        developersIds: updatedDevelopersIds,
      };

      const updatedProject = await updateProject(projectId, updateProjectDto);

      setDevelopers(
        updatedProject.developers.map((d: any) => ({
          id: d.id,
          email: d.email,
          photoUrl: null,
        }))
      );
      setProjectData(updatedProject);

      closeAddDevModal();
    } catch (error) {
      console.error("Error agregando desarrollador:", error);
      alert("No se pudo agregar el desarrollador. Intenta nuevamente.");
    }
  };

  const [isDeleteDevModalOpen, setIsDeleteDevModalOpen] = useState(false);
  const openDeleteDevModal = () => setIsDeleteDevModalOpen(true);
  const closeDeleteDevModal = () => setIsDeleteDevModalOpen(false);

  const handleRemoveUserFromProject = async (user: Developer) => {
    if (!projectId || !projectData) {
      alert("Proyecto no válido");
      return;
    }
    try {
      const filteredDevelopersIds = developers
        .filter((d) => d.id !== user.id)
        .map((d) => d.id);

      const updateProjectDto = {
        name: projectName,
        description: projectData.description,
        status: projectData.status,
        deadline: dueDate || null,
        pointsBudget: pointsTotal,
        developersIds: filteredDevelopersIds,
      };

      console.log("Request PATCH updateProject", projectId, updateProjectDto);

      const updatedProject = await updateProject(projectId, updateProjectDto);

      console.log("Respuesta updateProject", updatedProject);

      setDevelopers(
        updatedProject.developers.map((d: any) => ({
          id: d.id,
          email: d.email,
          photoUrl: null,
        }))
      );
      setProjectData(updatedProject);
      console.log("Respuesta updateProject setteado", updatedProject);
    } catch (error) {
      console.error("Error eliminando desarrollador:", error);
      alert("No se pudo eliminar el desarrollador. Intenta nuevamente.");
    }
  };

  const openAddRiskModal = () => setIsAddRiskModalOpen(true);
  const closeAddRiskModal = () => setIsAddRiskModalOpen(false);

  const handleAddRisk = async (riskDescription: string, scope: string) => {
    try {
      let scopeEnum: RiskScope;
      switch (scope.toUpperCase()) {
        case "CRITICAL":
        case "ALTO":
          scopeEnum = RiskScope.CRITICAL;
          break;
        case "NORMAL":
        case "MEDIO":
          scopeEnum = RiskScope.NORMAL;
          break;
        default:
          scopeEnum = RiskScope.LOW;
      }

      const riskData: CreateRiskInputDto = {
        projectId: projectData?.id || "",
        name: riskDescription,
        scope: scopeEnum,
      };

      const createdRisk = await createRisk(riskData);

      setRisks((prev) => [
        ...prev,
        {
          name: createdRisk.name,
          scope: createdRisk.scope,
          id: createdRisk.id,
        },
      ]);

      closeAddRiskModal();
    } catch (error) {
      console.error("Error creando riesgo:", error);
      alert("Error al crear el riesgo, inténtalo nuevamente.");
    }
  };

  const handleDeleteRisk = async (riskId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este riesgo?")) return;
    try {
      await deleteRisk(riskId);
      setRisks((prev) => prev.filter((r) => (r as any).id !== riskId));
    } catch (error) {
      console.error("Error eliminando riesgo:", error);
      alert("Error al eliminar el riesgo, inténtalo nuevamente.");
    }
  };

  const handleRemoveDeveloperFromTask = async (user: Developer) => {
    if (!selectedTask) return;

    try {
      const updatedDeveloperIds = selectedTask.developers
        .filter((d) => d.id !== user.id)
        .map((d) => d.id);

      const updateDto: UpdateTaskInputDto = {
        title: selectedTask.name,
        points: selectedTask.points,
        developmentHours: selectedTask.developmentHours,
        status: selectedTask.status,
        developerIds: updatedDeveloperIds,
      };

      const updatedTask = await updateTask(selectedTask.id, updateDto);

      setSelectedTask({
        ...selectedTask,
        developers: updatedTask.developers.map((d) => ({
          id: d.id,
          email: d.email,
          photoUrl: d.photoUrl ?? null,
        })),
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id
            ? {
                ...task,
                developers: updatedTask.developers.map((d) => ({
                  id: d.id,
                  email: d.email,
                  photoUrl: d.photoUrl ?? null,
                })),
                name: updatedTask.title,
                points: updatedTask.points,
                developmentHours: updatedTask.developmentHours ?? 0,
                status: updatedTask.status,
              }
            : task
        )
      );
    } catch (error) {
      console.error("Error eliminando desarrollador de tarea:", error);
      alert("No se pudo eliminar el desarrollador. Intenta nuevamente.");
    }
  };

  const openAddTaskModal = () => setIsAddTaskModalOpen(true);
  const closeAddTaskModal = () => setIsAddTaskModalOpen(false);
  const openAddDevModal = () => setIsAddDevModalOpen(true);
  const closeAddDevModal = () => setIsAddDevModalOpen(false);
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
      const updatedTask: UpdateTaskOutputDto = await updateTask(
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
  const handleAddUserToProjectLocal = (user: User) => {
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

  if (loading) return <p className="p-6 text-center">Cargando proyecto...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!projectData)
    return <p className="p-6 text-center">No se encontró el proyecto.</p>;

  return (
    <>
      <main
        className={`p-10 min-h-screen relative font-sans bg-[#121212] text-[#e0e0e0] ${
          selectedTask || isAddDevModalOpen || isDeleteDevModalOpen
            ? "filter blur-sm brightness-90 pointer-events-none select-none"
            : ""
        }`}
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Estado y selección de proyecto */}
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
            value={projectStatusLocal}
            onChange={handleProjectStatusChange}
            className="bg-transparent border-none outline-none cursor-pointer font-bold text-sm text-[#121212]"
            style={{ backgroundColor: "transparent" }}
          >
            {projectStatusOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre editable */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          aria-label="Nombre del proyecto editable"
          className="text-4xl font-extrabold mb-3 w-full bg-transparent border-none outline-none cursor-text text-green-400 font-sans"
        />

        {/* Fecha, puntos y descripción */}
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
              {" "}
              /{" "}
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

        {/* Desarrolladores */}
        <div className="mt-6 mb-2 font-semibold text-lg text-gray-400">
          Desarrolladores
        </div>
        <ProjectAvatars
          developers={developers}
          showButtons={true}
          onAdd={openAddDevModal}
          onRemove={openDeleteDevModal}
        />

        {/* Descripción del Proyecto */}
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

        {/* Botón nueva tarea */}
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

        {/* Componente tareas con función delete */}
        <ProjectTasksPage
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onDelete={handleDelete}
        />

        {/* Riesgos */}
        <RiskCard
          risks={risks}
          showAddButton={true}
          onAddRisk={openAddRiskModal}
          onDeleteRisk={handleDeleteRisk}
        />

        {/* Calidad */}
        <QualityCard editable={true} />

        {/* Botones Guardar y Salir */}
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

      {/* Modal editar tarea */}
      {selectedTask && (
        <EditDetailTaskModal
          taskName={selectedTask.name}
          status={selectedTask.status}
          developers={selectedTask.developers}
          points={selectedTask.points}
          developmentHours={selectedTask.developmentHours}
          allAvailableUsers={allAvailableUsers}
          onAddDeveloper={() => {}}
          onRemoveDeveloper={openDeleteDevModalForTask}
          onSave={handleSaveTaskFromModal}
          onClose={closeModal}
        />
      )}

      {/* Modal para eliminar dev de la tarea */}
      {isDeleteDevModalOpenForTask && selectedTask && (
        <DeleteDevModal
          developers={selectedTask.developers}
          onRemoveUser={handleRemoveDeveloperFromTask}
          onClose={closeDeleteDevModalForTask}
        />
      )}

      {/* Modal para eliminar dev del proyecto */}
      {isDeleteDevModalOpenForProject && (
        <DeleteDevModal
          developers={developers}
          onRemoveUser={handleRemoveUserFromProject}
          onClose={closeDeleteDevModalForProject}
        />
      )}

      {/* Modal añadir riesgo */}
      {isAddRiskModalOpen && (
        <AddRiskModal
          scopes={scopesList}
          onSave={handleAddRisk}
          onClose={closeAddRiskModal}
        />
      )}

      {/* Modal añadir tarea */}
      {isAddTaskModalOpen && (
        <AddTaskModal
          developers={developers}
          onCreate={handleCreateTask}
          onClose={closeAddTaskModal}
        />
      )}

      {/* Modal añadir desarrollador */}
      {isAddDevModalOpen && (
        <AddDevModal
          users={availableDevelopersToAdd}
          onAddUser={handleAddUserToProject}
          onClose={closeAddDevModal}
        />
      )}

      {isDeleteDevModalOpen && selectedTask && (
        <DeleteDevModal
          developers={selectedTask.developers}
          onRemoveUser={async (user) => {
            // Elimina el developer en backend y actualiza estados
            await handleRemoveDeveloperFromTask(user);
          }}
          onClose={() => setIsDeleteDevModalOpen(false)}
        />
      )}

      {/* Modal eliminar desarrollador */}
      {isDeleteDevModalOpen && (
        <DeleteDevModal
          developers={developers}
          onRemoveUser={handleRemoveUserFromProject}
          onClose={closeDeleteDevModal}
        />
      )}
    </>
  );
}
