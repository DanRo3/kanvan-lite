// src/components/project-component/TaskSummaryTable.tsx
import React from "react";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface TaskSummaryTableProps {
  tasks: Task[];
}

const TaskSummaryTable: React.FC<TaskSummaryTableProps> = ({ tasks }) => {
  // 1. Filtra y cuenta las tareas para cada estado
  const planned = tasks.filter((t) => t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const deployed = tasks.filter((t) => t.status === "DEPLOYED").length;
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
        <tr className="bg-white/5 hover:bg-white/10 transition">
          <td className="px-6 py-3 border-b border-gray-700">Planificadas</td>
          <td className="px-6 py-3 border-b border-gray-700 text-right">
            {planned}
          </td>
        </tr>
        <tr className="bg-white/5 hover:bg-white/10 transition">
          <td className="px-6 py-3 border-b border-gray-700">En Progreso</td>
          <td className="px-6 py-3 border-b border-gray-700 text-right">
            {inProgress}
          </td>
        </tr>
        <tr className="bg-white/5 hover:bg-white/10 transition">
          <td className="px-6 py-3 border-b border-gray-700">Completadas</td>
          <td className="px-6 py-3 border-b border-gray-700 text-right">
            {completed}
          </td>
        </tr>
        <tr className="bg-white/5 hover:bg-white/10 transition">
          <td className="px-6 py-3 border-b border-gray-700">Desplegadas</td>
          <td className="px-6 py-3 border-b border-gray-700 text-right">
            {deployed}
          </td>
        </tr>
        <tr className="bg-white/10 font-bold">
          <td className="px-6 py-3">Totales</td>
          <td className="px-6 py-3 text-right">{total}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TaskSummaryTable;
