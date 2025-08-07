import React from "react";
import TaskCard from "@/components/task-component/TaskCard";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

interface Task {
  id: string;
  name: string;
  status: "red" | "yellow" | "green";
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
      {/* Pendientes (rojo) */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-red-400 text-black flex flex-col">
        <h3 className="mt-0 mb-3">Pendientes</h3>
        {tasks
          .filter((t) => t.status === "red")
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

      {/* En Progreso (naranja) */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-orange-700 text-black flex flex-col">
        <h3 className="mt-0 mb-3">En Progreso</h3>
        {tasks
          .filter((t) => t.status === "yellow")
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

      {/* Completadas (amarillo clarito) */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-yellow-400 text-black flex flex-col">
        <h3 className="mt-0 mb-3">Completadas</h3>
        {tasks
          .filter((t) => t.status === "green")
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

      {/* Desplegadas (verde más oscuro) */}
      <section className="flex-1 rounded-lg p-4 overflow-y-auto bg-green-400 text-black flex flex-col">
        <h3 className="mt-0 mb-3 text-green-900">Desplegadas</h3>
        {tasks
          .filter((t) => t.status === "green")
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

export default TasksProjectComponent;
