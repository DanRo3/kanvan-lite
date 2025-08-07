import React from "react";
import TaskCard from "@/components/task-component/task-card";

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
}

interface TasksProjectComponentProps {
  tasks: Task[];
}

const TasksProjectComponent: React.FC<TasksProjectComponentProps> = ({
  tasks,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        marginTop: 24,
        width: "100%",
        height: 400,
      }}
    >
      {/* Pendientes (rojo) */}
      <section
        style={{
          backgroundColor: "#f87171",
          flex: 1,
          borderRadius: 12,
          padding: 16,
          overflowY: "auto",
          color: "#121212",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Pendientes</h3>
        {tasks
          .filter((t) => t.status === "red")
          .map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
      </section>

      {/* En Progreso (naranja) */}
      <section
        style={{
          backgroundColor: "#d97706",
          flex: 1,
          borderRadius: 12,
          padding: 16,
          overflowY: "auto",
          color: "#121212",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>En Progreso</h3>
        {tasks
          .filter((t) => t.status === "yellow")
          .map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
      </section>

      {/* Completadas (amarillo clarito) */}
      <section
        style={{
          backgroundColor: "#fbbf24",
          flex: 1,
          borderRadius: 12,
          padding: 16,
          overflowY: "auto",
          color: "#121212",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Completadas</h3>
        {tasks
          .filter((t) => t.status === "green")
          .map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
      </section>

      {/* Desplegadas (verde más oscuro) */}
      <section
        style={{
          backgroundColor: "#4ade80",
          flex: 1,
          borderRadius: 12,
          padding: 16,
          overflowY: "auto",
          color: "#121212",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12, color: "#0f5132" }}>
          Desplegadas
        </h3>

        {tasks
          .filter((t) => t.status === "green")
          .map((task) => (
            <TaskCard key={task.id + "-despl"} {...task} />
          ))}
      </section>
    </div>
  );
};

export default TasksProjectComponent;
