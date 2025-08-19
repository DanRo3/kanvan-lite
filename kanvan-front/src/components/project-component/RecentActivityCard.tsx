// src/components/project-component/RecentActivityCard.tsx

import React from "react";
import { format } from "date-fns";

// Interfaz para la estructura de una tarea, replicando la de tu página principal
interface Task {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
}

// Interfaz para los props del componente
interface RecentActivityCardProps {
  recentTasks: Task[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  recentTasks,
}) => {
  return (
    <section
      className="
        mt-8 rounded-lg p-6
        bg-white/5 backdrop-blur-md
        border border-white/20
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
      "
    >
      <h2 className="m-0 mb-6 text-[#c2c2c2] font-bold text-xl">
        Actividad Reciente
      </h2>

      {/* Contenedor de la lista de actividades */}
      <div className="mt-3 max-h-52 overflow-y-auto flex flex-col gap-3 pr-3">
        {recentTasks.length === 0 && (
          <p className="text-[#c2c2c2] italic">
            No hay actividad reciente registrada.
          </p>
        )}

        {recentTasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className="
              flex items-center gap-3
              p-3 rounded-lg
              bg-white/7
            "
          >
            <span className="flex-1 text-[#e0e0e0] truncate">
              <span className="font-semibold">{task.title}</span> -{" "}
              {task.status} (finalizada el{" "}
              {format(new Date(task.updatedAt), "dd/MM/yyyy")})
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivityCard;
