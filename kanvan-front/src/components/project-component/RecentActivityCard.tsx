// src/components/project-component/RecentActivityCard.tsx

import React from "react";
import { format } from "date-fns";

// Interfaz para la estructura de una tarea
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
  // Mapeo de estados para la traducción
  const statusMap: Record<string, string> = {
    PENDING: "Planificada",
    IN_PROGRESS: "En Progreso",
    COMPLETED: "Completada",
    DEPLOYED: "Desplegada",
  };

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

      {recentTasks.length === 0 ? (
        <p className="text-[#c2c2c2] italic">
          No hay actividad reciente registrada.
        </p>
      ) : (
        <div className="mt-3 max-h-52 overflow-y-auto pr-3">
          <table className="min-w-full table-fixed divide-y divide-white/20">
            <thead className="bg-white/10 sticky top-0">
              <tr>
                <th className="w-1/2 py-2 px-4 text-left text-sm font-semibold text-[#c2c2c2]">
                  Título
                </th>
                <th className="w-1/4 py-2 px-4 text-left text-sm font-semibold text-[#c2c2c2]">
                  Estado
                </th>
                <th className="w-1/4 py-2 px-4 text-left text-sm font-semibold text-[#c2c2c2]">
                  Finalización
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recentTasks.slice(0, 5).map((task) => (
                <tr key={task.id} className="hover:bg-white/10">
                  <td className="py-2 px-4 text-sm text-[#e0e0e0] truncate">
                    {task.title}
                  </td>
                  <td className="py-2 px-4 text-sm text-[#e0e0e0]">
                    {/* Usa el mapa para traducir el estado */}
                    {statusMap[task.status.toUpperCase()] || task.status}
                  </td>
                  <td className="py-2 px-4 text-sm text-[#e0e0e0]">
                    {format(new Date(task.updatedAt), "dd/MM/yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentActivityCard;
