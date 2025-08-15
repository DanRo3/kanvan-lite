"use client";

import React from "react";
import { deleteTask } from "@/api/tasks/services/task.service";
import { FiTrash } from "react-icons/fi";
import { useDrag } from "react-dnd";
import { Status, Task } from "../project-component/TasksProjectComponent";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

interface TaskCardProps {
  id: string;
  name: string;
  developers: Developer[];
  href: string;
  onDelete: (id: string) => void;
  onTaskClick: (task: Task) => void; // AHORA ES UNA PROP REQUERIDA
  status: Status; // Necesitamos el estado para el `item` del drag
  points: number; // Necesitamos los puntos para el `item` del drag
  developmentHours: number; // Necesitamos las horas para el `item` del drag
}

function getRandomColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 60%, 70%)`;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  name,
  developers,
  href,
  onDelete,
  onTaskClick,
  status,
  points,
  developmentHours,
}) => {
  const handleDeleteClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete(id);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    onTaskClick({
      id,
      name,
      developers,
      href,
      status,
      points,
      developmentHours,
    });
  };

  // Hacemos el componente arrastrable usando useDrag
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK", // Define el tipo de elemento arrastrable
    item: { id, name, status, points, developmentHours, developers }, // Datos que se pasan al soltar
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <a
      ref={drag}
      href={href}
      onClick={handleClick}
      className="relative flex flex-col justify-end p-8 pt-8 pb-14 min-h-[120px] max-w-xs rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(31,38,135,0.37)] text-gray-300 font-sans no-underline cursor-grab transition-all duration-250 ease-in-out hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(31,38,135,0.7)] hover:bg-white/15"
      style={{
        opacity: isDragging ? 0.5 : 1, // La tarjeta se vuelve semi-transparente cuando se arrastra
      }}
    >
      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-300"
        aria-label="Borrar tarea"
        title="Borrar tarea"
        type="button"
      >
        <FiTrash size={20} />
      </button>

      <div className="font-bold text-lg mb-4 break-words">{name}</div>

      <div className="absolute bottom-4 right-5 flex flex-row gap-0">
        {developers.map((dev, idx) => {
          const hasPhoto = !!dev.photoUrl;
          const initial = dev.email[0].toUpperCase();
          const bgColor = getRandomColor(dev.email);

          return hasPhoto ? (
            <div
              key={dev.id}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-900 shadow-sm flex items-center justify-center"
              style={{
                marginLeft: idx === 0 ? 0 : "-10px",
                zIndex: developers.length - idx,
              }}
              title={dev.email}
            >
              <img
                src={dev.photoUrl!}
                alt={dev.email}
                className="w-full h-full object-cover block"
              />
            </div>
          ) : (
            <div
              key={dev.id}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base text-gray-900 border-2 border-gray-900 shadow-sm"
              style={{
                backgroundColor: bgColor,
                marginLeft: idx === 0 ? 0 : "-10px",
                zIndex: developers.length - idx,
              }}
              title={dev.email}
            >
              <span>{initial}</span>
            </div>
          );
        })}
      </div>
    </a>
  );
};

export default TaskCard;
