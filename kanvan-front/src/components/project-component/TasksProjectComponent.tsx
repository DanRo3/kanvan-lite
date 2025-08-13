"use client";

import React, { useState, useEffect } from "react";
import {
  updateTask,
  getTasksByProjectId,
} from "@/api/tasks/services/task.service";

type Status = "DEPLOYED" | "COMPLETED" | "PENDING" | "IN_PROGRESS";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

interface Task {
  id: string;
  name: string;
  status: Status;
  developers: Developer[];
  href: string;
  points?: number;
  developmentHours?: number;
}

interface TasksProjectComponentProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TasksProjectComponent: React.FC<TasksProjectComponentProps> = ({
  tasks,
  onTaskClick,
}) => {
  return (
    <div className="flex gap-4 mt-6 w-full h-[400px]">
      {/* Pendientes */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-red-400 text-black flex flex-col">
        <h3 className="mt-0 mb-3">Pendientes</h3>
        {tasks
          .filter((t) => t.status === "PENDING")
          .map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onTaskClick(task);
              }}
            >
              <TaskCard {...task} />
            </div>
          ))}
      </section>

      {/* En Progreso */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-orange-700 text-black flex flex-col">
        <h3 className="mt-0 mb-3">En Progreso</h3>
        {tasks
          .filter((t) => t.status === "IN_PROGRESS")
          .map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onTaskClick(task);
              }}
            >
              <TaskCard {...task} />
            </div>
          ))}
      </section>

      {/* Completadas */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-yellow-400 text-black flex flex-col">
        <h3 className="mt-0 mb-3">Completadas</h3>
        {tasks
          .filter((t) => t.status === "COMPLETED")
          .map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onTaskClick(task);
              }}
            >
              <TaskCard {...task} />
            </div>
          ))}
      </section>

      {/* Desplegadas */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-green-400 text-black flex flex-col">
        <h3 className="mt-0 mb-3 text-green-900">Desplegadas</h3>
        {tasks
          .filter((t) => t.status === "DEPLOYED") // <-- Aquí filtro por estado correcto
          .map((task) => (
            <div
              key={task.id + "-despl"}
              onClick={() => onTaskClick(task)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onTaskClick(task);
              }}
            >
              <TaskCard {...task} />
            </div>
          ))}
      </section>
    </div>
  );
};

// --- Modal Import ---

import EditDetailTaskModal from "@/components/modals/EditDetailsTask";
import TaskCard from "../task-component/TaskCard";

// --- Helper getRandomColor usado en TaskCard/modal omitido por claridad ---

export default function ProjectTasksPage({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const loaded = await getTasksByProjectId(projectId);
        setTasks(
          loaded.map((t) => ({
            id: t.id,
            name: t.title,
            status: t.status as Status,
            developers:
              t.developers?.map((d: any) => ({
                id: d.id,
                email: d.email,
                photoUrl: null,
              })) || [],
            href: "#",
            points: t.points,
            developmentHours: t.developmentHours ?? 0,
          }))
        );
      } catch (error) {
        console.error("Error cargando tareas:", error);
      }
    }
    loadTasks();
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const saveTaskChanges = async (updatedData: {
    taskName: string;
    points: number;
    developmentHours: number;
    status: Status;
    developerIds: string[];
  }) => {
    if (!selectedTask) return;

    try {
      // Llamada al servicio para actualizar la tarea
      const updatedTaskFromApi = await updateTask(selectedTask.id, {
        title: updatedData.taskName,
        points: updatedData.points,
        developmentHours: updatedData.developmentHours,
        status: updatedData.status,
        developerIds: updatedData.developerIds,
      });

      // Mapear al formato local
      const updatedTask: Task = {
        id: updatedTaskFromApi.id,
        name: updatedTaskFromApi.title,
        status: updatedData.status,
        developers: updatedTaskFromApi.developers.map((d: any) => ({
          id: d.id,
          email: d.email,
          photoUrl: null,
        })),
        href: "#", // Ajusta o genera el link real si tienes
        points: updatedTaskFromApi.points,
        developmentHours: updatedTaskFromApi.developmentHours ?? 0,
      };

      // Actualizar estado y cerrar modal
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === selectedTask.id ? updatedTask : t))
      );

      setShowModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error guardando tarea:", error);
      alert("No se pudo guardar la tarea. Intenta nuevamente.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  // Implementa onAddDeveloper y onRemoveDeveloper como necesites, aquí vacíos para ejemplo
  const addDeveloperToSelectedTask = () => {
    if (!selectedTask) return;
    // Lógica para agregar developer localmente
  };
  const removeDeveloperFromSelectedTask = () => {
    if (!selectedTask) return;
    // Lógica para remover developer localmente
  };

  return (
    <>
      <TasksProjectComponent tasks={tasks} onTaskClick={handleTaskClick} />

      {showModal && selectedTask && (
        <EditDetailTaskModal
          taskName={selectedTask.name}
          status={selectedTask.status}
          developers={selectedTask.developers}
          points={selectedTask.points ?? 0}
          developmentHours={selectedTask.developmentHours ?? 0}
          onAddDeveloper={addDeveloperToSelectedTask}
          onRemoveDeveloper={removeDeveloperFromSelectedTask}
          onSave={saveTaskChanges}
          onClose={closeModal}
          editable={true}
        />
      )}
    </>
  );
}
