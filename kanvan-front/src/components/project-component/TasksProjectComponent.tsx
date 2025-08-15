"use client";

import React from "react";
import DropTargetSection from "./DropTargetSection"; // NUEVA IMPORTACIÓN

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
  onDelete: (id: string) => void;
  onDrop: (taskId: string, newStatus: Status) => void;
}

const ProjectTasksPage: React.FC<TasksProjectComponentProps> = ({
  tasks,
  onTaskClick,
  onDelete,
  onDrop,
}) => {
  return (
    <div className="flex gap-4 mt-6 w-full h-[400px]">
      <DropTargetSection
        status="PENDING"
        title="Pendientes"
        tasks={tasks.filter((t) => t.status === "PENDING")}
        onTaskClick={onTaskClick}
        onDelete={onDelete}
        onDrop={onDrop}
        bgColor="#B91C1C"
      />
      <DropTargetSection
        status="IN_PROGRESS"
        title="En Progreso"
        tasks={tasks.filter((t) => t.status === "IN_PROGRESS")}
        onTaskClick={onTaskClick}
        onDelete={onDelete}
        onDrop={onDrop}
        bgColor="#D97706"
      />
      <DropTargetSection
        status="COMPLETED"
        title="Completadas"
        tasks={tasks.filter((t) => t.status === "COMPLETED")}
        onTaskClick={onTaskClick}
        onDelete={onDelete}
        onDrop={onDrop}
        bgColor="#F5B93E"
      />
      <DropTargetSection
        status="DEPLOYED"
        title="Desplegadas"
        tasks={tasks.filter((t) => t.status === "DEPLOYED")}
        onTaskClick={onTaskClick}
        onDelete={onDelete}
        onDrop={onDrop}
        bgColor="#22C55E"
      />
    </div>
  );
};

export default ProjectTasksPage;
