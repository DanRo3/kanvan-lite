"use client";

import React from "react";
import TaskCard from "../task-component/TaskCard";

export type Status = "DEPLOYED" | "COMPLETED" | "PENDING" | "IN_PROGRESS";

export interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

export interface Task {
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

const ProjectTasksPage: React.FC<TasksProjectComponentProps> = ({
  tasks,
  onTaskClick,
}) => {
  return (
    <div className="flex gap-4 mt-6 w-full h-[400px]">
      {/* Pendientes */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-red-400 text-black flex flex-col">
        <h3>Pendientes</h3>
        {tasks
          .filter((t) => t.status === "PENDING")
          .map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onTaskClick(task);
              }}
            >
              <TaskCard {...task} />
            </div>
          ))}
      </section>

      {/* En progreso */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-orange-700 text-black flex flex-col">
        <h3>En Progreso</h3>
        {tasks
          .filter((t) => t.status === "IN_PROGRESS")
          .map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
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
        <h3>Completadas</h3>
        {tasks
          .filter((t) => t.status === "COMPLETED")
          .map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
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
        <h3 className="text-green-900">Desplegadas</h3>
        {tasks
          .filter((t) => t.status === "DEPLOYED")
          .map((task) => (
            <div
              key={task.id + "-despl"}
              onClick={() => onTaskClick(task)}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
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

export default ProjectTasksPage;
