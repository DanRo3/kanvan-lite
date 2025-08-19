// src/components/project-component/TaskSummaryTable.tsx

import React, { useState } from "react";
import TaskRowDetails from "./TaskRowDetails";

// Interfaz para la estructura de una tarea
interface Task {
  id: string;
  title: string;
  status: string;
}

interface TaskSummaryTableProps {
  tasks: Task[];
}

const TaskSummaryTable: React.FC<TaskSummaryTableProps> = ({ tasks }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleRowClick = (status: string) => {
    setExpandedRow(expandedRow === status ? null : status);
  };

  // Mapeo de estados para la traducción
  const statusMap: Record<string, string> = {
    PENDING: "Planificadas",
    IN_PROGRESS: "En Progreso",
    COMPLETED: "Completadas",
    DEPLOYED: "Desplegadas",
  };

  // Filtra y cuenta las tareas para cada estado
  const taskCounts = Object.keys(statusMap).reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  const total = tasks.length;

  return (
    <table className="table-auto border border-gray-700 rounded-lg overflow-hidden w-full text-left text-[#e0e0e0] mt-8">
      <thead>
        <tr className="bg-gray-800">
          <th className="px-6 py-3 border-b border-gray-700">Tareas</th>
          <th className="px-6 py-3 border-b border-gray-700 text-right">
            Cantidad
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(statusMap).map(([status, label]) => (
          <React.Fragment key={status}>
            <tr
              className="bg-white/5 hover:bg-white/10 transition cursor-pointer"
              onClick={() => handleRowClick(status)}
            >
              <td className="px-6 py-3 border-b border-gray-700">{label}</td>
              <td className="px-6 py-3 border-b border-gray-700 text-right">
                {taskCounts[status]}
              </td>
            </tr>
            {expandedRow === status && (
              <tr className="bg-white/5">
                <TaskRowDetails
                  tasks={tasks.filter((t) => t.status === status)}
                />
              </tr>
            )}
          </React.Fragment>
        ))}
        <tr className="bg-white/10 font-bold">
          <td className="px-6 py-3">Totales</td>
          <td className="px-6 py-3 text-right">{total}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TaskSummaryTable;
