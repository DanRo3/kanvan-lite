"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import RiskCard, { Risk } from "@/components/project-component/RisksCard";
import QualityCard from "@/components/project-component/QualityCard";
import TasksProjectComponent from "@/components/project-component/TasksProjectComponent";
import ProjectAvatars from "@/components/project-component/ProjectAvatars";
import EditDetailsTaskDeveloper from "@/components/modals/EditDetailsTaskDeveloper"; // Nuevo modal
// import AddDevModal from "@/components/modals/AddDevModal"; // Ya no lo necesitas si no usas modal agregar devs

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

interface User {
  id: string;
  email: string;
}

interface Task {
  id: string;
  name: string;
  status: "red" | "yellow" | "green";
  developers: Developer[];
  href: string;
  points: number;
  developmentHours: number;
}

export default function Page() {
  const params = useParams();
  const { id } = params;

  // ... (tus estados y funciones iguales como antes)

  const [projectName, setProjectName] = useState("Proyecto " + (id ?? ""));
  const [dueDate] = useState("2025-09-01"); // no editable
  const [pointsDone] = useState(12); // no editable
  const [pointsTotal] = useState(20); // no editable
  const [description] = useState(
    `Esta es la descripción completa y editable para el proyecto ${
      id ?? ""
    }.\nLorem ipsum dolor sit amet, consectetur adipiscing elit...`
  );
  const [developers] = useState<Developer[]>([
    { id: "1", email: "ana@example.com", photoUrl: null },
    {
      id: "2",
      email: "jose@example.com",
      photoUrl: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    { id: "3", email: "luisa@example.com", photoUrl: null },
  ]);

  const [risks] = useState<Risk[]>([
    {
      descripcion: "Retraso en proveedores",
      impacto: "alto",
    },
    {
      descripcion: "Falta de recursos humanos",
      impacto: "medio",
    },
    {
      descripcion: "Pruebas insuficientes",
      impacto: "bajo",
    },
  ]);

  const [status, setStatus] = useState<"green" | "yellow" | "red">("green");

  const [tasks] = useState<Task[]>([
    {
      id: "t1",
      name: "Diseñar interfaz de usuario",
      status: "red",
      developers: developers.slice(0, 1),
      href: "#",
      points: 5,
      developmentHours: 10,
    },
    {
      id: "t2",
      name: "Implementar autenticación",
      status: "yellow",
      developers: developers.slice(0, 2),
      href: "#",
      points: 8,
      developmentHours: 15,
    },
    {
      id: "t3",
      name: "Revisar pruebas unitarias",
      status: "green",
      developers: developers.slice(1, 3),
      href: "#",
      points: 12,
      developmentHours: 20,
    },
    {
      id: "t4",
      name: "Desplegar a producción",
      status: "green",
      developers: developers.slice(0, 3),
      href: "#",
      points: 7,
      developmentHours: 14,
    },
    {
      id: "t5",
      name: "Test de carga",
      status: "yellow",
      developers: [developers[1]],
      href: "#",
      points: 6,
      developmentHours: 11,
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const calcDaysRemaining = () => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };
  const [daysRemaining, setDaysRemaining] = useState(calcDaysRemaining());
  useEffect(() => {
    const interval = setInterval(() => {
      setDaysRemaining(calcDaysRemaining());
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [dueDate]);

  const statusColors: Record<typeof status, string> = {
    green: "#4ade80",
    yellow: "#facc15",
    red: "#f87171",
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const saveTaskChanges = (updated: any) => {
    // Aquí debes implementar la lógica para guardar cambios dependiendo de la estructura que te pase EditDetailsTaskDeveloper
    alert(
      "Guardar cambios del desarrollador en la tarea: " +
        (selectedTask?.name ?? "")
    );
    closeModal();
  };

  return (
    <>
      {/* Main content */}
      <main
        className={`
          p-10 min-h-screen relative font-sans
          bg-[#121212] text-[#e0e0e0]
          ${
            selectedTask
              ? "filter blur-sm brightness-90 pointer-events-none select-none"
              : ""
          }
        `}
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Estado proyecto */}
        <div
          title={`Estado: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
          className="absolute top-5 right-5 min-w-[100px] h-12 px-3 rounded-lg shadow-md flex items-center justify-center font-bold text-sm text-[#121212]"
          style={{
            backgroundColor: statusColors[status],
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        {/* Nombre editable */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          aria-label="Nombre del proyecto editable"
          className="text-4xl font-extrabold mb-3 w-full bg-transparent border-none outline-none cursor-text text-green-400 font-sans"
        />

        {/* Fecha y puntos */}
        <div className="flex flex-wrap gap-12 mb-3 text-gray-400 font-semibold text-lg items-start">
          {/* Fecha no editable */}
          <div className="flex flex-col gap-1.5 w-44">
            <input
              type="text"
              value={dueDate}
              readOnly
              aria-label="Fecha de entrega no editable"
              className="text-lg text-[#a0a0a0] bg-transparent border border-green-400 rounded-lg px-2 py-1 cursor-not-allowed outline-none w-full font-semibold"
            />
            <span>Quedan {daysRemaining} días para finalizar</span>
          </div>

          {/* Puntos no editables */}
          <div className="flex items-center gap-3 select-none">
            <div className="flex flex-col items-center gap-1">
              <span>Puntos obtenidos</span>
              <input
                type="number"
                value={pointsDone}
                readOnly
                aria-label="Puntos obtenidos no editables"
                className="w-14 text-lg font-bold text-right border border-green-400 rounded-lg bg-transparent text-[#a0a0a0] px-1.5 py-0.5 cursor-not-allowed outline-none"
              />
            </div>
            <div className="font-bold text-lg text-gray-400 select-none pb-6">
              /
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>Puntos totales</span>
              <input
                type="number"
                value={pointsTotal}
                readOnly
                aria-label="Puntos totales no editables"
                className="w-14 text-lg font-bold text-right border border-green-400 rounded-lg bg-transparent text-[#a0a0a0] px-1.5 py-0.5 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Texto debajo de puntos */}
          <div className="mt-1.5 text-cyan-300 font-semibold text-sm text-center w-[372px] ml-12">
            Faltan {pointsTotal - pointsDone} puntos para completar el proyecto
          </div>
        </div>

        {/* Desarrolladores (sin botones + / -) */}
        <div className="mt-6 mb-2 font-semibold text-lg text-gray-400">
          Desarrolladores
        </div>
        <ProjectAvatars developers={developers} showButtons={false} />

        {/* Descripción no editable */}
        <div className="mt-6 mb-2 font-semibold text-lg text-gray-400">
          Descripción del Proyecto
        </div>
        <textarea
          value={description}
          readOnly
          rows={8}
          aria-label="Descripción no editable del proyecto"
          className="mt-2 w-full bg-white/10 border border-green-400 rounded-xl text-[#a0a0a0] text-base p-3 font-sans resize-none min-h-[150px] outline-none cursor-not-allowed"
        />

        {/* Sin botón nueva tarea */}

        {/* Panel tareas */}
        <TasksProjectComponent tasks={tasks} onTaskClick={handleTaskClick} />

        {/* Panel riesgos sin botón + */}
        <RiskCard risks={risks} showAddButton={false} />

        {/* Panel métricas calidad sin edición */}
        <QualityCard editable={false} />

        {/* Sin botones guardar y salir */}
      </main>

      {/* Modal detalle desarrolladores (reemplazo de EditDetailTaskModal) */}
      {selectedTask && (
        <EditDetailsTaskDeveloper
          taskName={selectedTask.name}
          status={selectedTask.status}
          developers={selectedTask.developers ?? []} // Asegura que sea un array
          points={selectedTask.points}
          developmentHours={selectedTask.developmentHours}
          onAddDeveloper={() => {}}
          onRemoveDeveloper={() => {}}
          onSave={saveTaskChanges}
          onClose={closeModal}
        />
      )}
    </>
  );
}
