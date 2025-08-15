"use client";

import React from "react";
import TaskCard from "../task-component/TaskCard";
import { useDrop } from "react-dnd";
import { Status, Task, Developer } from "./TasksProjectComponent"; // IMPORTACIÓN DE TIPOS

interface DropTargetSectionProps {
  status: Status;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDelete: (id: string) => void;
  onDrop: (taskId: string, newStatus: Status) => void;
  bgColor: string;
}

const DropTargetSection: React.FC<DropTargetSectionProps> = ({
  status,
  title,
  tasks,
  onTaskClick,
  onDelete,
  onDrop,
  bgColor,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: string }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const containerStyle = {
    backgroundColor: bgColor,
    outline: isOver ? "2px dashed #e0e0e0" : "none",
  };

  return (
    <section
      ref={drop}
      className="flex-1 rounded-lg p-4 overflow-y-auto text-black flex flex-col gap-4 transition-outline duration-200"
      style={containerStyle}
    >
      <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          {...task}
          onTaskClick={onTaskClick}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};

export default DropTargetSection;
