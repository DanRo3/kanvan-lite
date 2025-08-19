import React from "react";

// Interfaz para la estructura de una tarea
interface Task {
  id: string;
  title: string;
  status: string;
}

// Interfaz para los props del componente
interface TaskRowDetailsProps {
  tasks: Task[];
}

const TaskRowDetails: React.FC<TaskRowDetailsProps> = ({ tasks }) => {
  return (
    <td colSpan={2} className="p-4 bg-white/5 border-b border-gray-700">
      <ul className="list-disc ml-20 space-y-2 text-[#c2c2c2] text-sm">
        {tasks.length === 0 ? (
          <li className="italic">No hay tareas en este estado.</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id}>
              <span className="font-semibold">{task.title}</span>
            </li>
          ))
        )}
      </ul>
    </td>
  );
};

export default TaskRowDetails;
