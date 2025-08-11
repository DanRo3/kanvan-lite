"use client";
import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import RiskCard, { Risk } from "@/components/project-component/RisksCard";
import QualitySummaryCard from "@/components/project-component/QualitySummaryCard";
import ProjectProgressSummary from "@/components/project-component/ProjectProgressSummary";
import { format, differenceInCalendarDays } from "date-fns";

interface TaskSummary {
  implementadas: number;
  pendientesDespliegue: number;
  planificadas: number;
  total: number;
}

interface Task {
  id: string;
  name: string;
  status: string;
  fechaFinalizacion: string; // ISO string
}

// Datos simulados para ejemplo
const projectName = "Proyecto X";
const status = "green"; // Puede ser "green", "yellow" o "red" para el color de estado
const dueDate = "2025-09-30";

const taskSummary: TaskSummary = {
  implementadas: 15,
  pendientesDespliegue: 5,
  planificadas: 10,
  total: 30,
};

const completedTasks = 20;
const totalTasks = 30;

const progressDesarrollado = 65; // %
const progressDesplegado = 30; // %

const recentTasks: Task[] = [
  {
    id: "1",
    name: "Corregir bug login",
    status: "Completada",
    fechaFinalizacion: "2025-07-25",
  },
  {
    id: "2",
    name: "Implementar log de actividad",
    status: "Completada",
    fechaFinalizacion: "2025-07-24",
  },
  {
    id: "3",
    name: "Refactorizar página principal",
    status: "Completada",
    fechaFinalizacion: "2025-07-23",
  },
  {
    id: "4",
    name: "Actualizar dependencias",
    status: "Completada",
    fechaFinalizacion: "2025-07-22",
  },
  {
    id: "5",
    name: "Mejorar SEO",
    status: "Completada",
    fechaFinalizacion: "2025-07-21",
  },
];

const risks: Risk[] = [
  { descripcion: "Pérdida de datos parcial", impacto: "alto" },
  { descripcion: "Retraso entrega API externa", impacto: "medio" },
  { descripcion: "Baja cobertura de pruebas", impacto: "bajo" },
];

const InfoBox: React.FC<{
  title: string;
  content: React.ReactNode;
  colorClass?: string;
}> = ({ title, content, colorClass = "text-white" }) => (
  <div className="flex-1 min-w-[140px] bg-white/15 rounded-lg p-5 shadow-[0_8px_32px_rgba(31,38,135,0.37)] flex flex-col justify-center items-center">
    <span
      className={`text-[#e0e0e0] font-semibold text-lg mb-3 text-center select-none`}
    >
      {title}
    </span>
    <span className={`text-2xl font-bold ${colorClass} text-center`}>
      {content}
    </span>
  </div>
);

// Componente para mostrar el estado con color de fondo según estado
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  // Define fondo según estado
  const statusMap: Record<string, { bgColor: string; textColor: string }> = {
    green: { bgColor: "bg-green-600", textColor: "text-green-100" },
    yellow: { bgColor: "bg-yellow-500", textColor: "text-yellow-900" },
    red: { bgColor: "bg-red-600", textColor: "text-red-100" },
    "En progreso": { bgColor: "bg-yellow-500", textColor: "text-yellow-900" }, // Adaptable
    // Agrega aquí otros estados personalizados si necesario
  };

  const colors = statusMap[status.toLowerCase()] ?? {
    bgColor: "bg-gray-700",
    textColor: "text-gray-300",
  };

  return (
    <div
      className={`${colors.bgColor} ${colors.textColor} inline-block px-3 py-1 rounded-md font-semibold text-sm select-none`}
      aria-label={`Estado del proyecto: ${status}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default function DocumentClient() {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calcDays = differenceInCalendarDays(new Date(dueDate), new Date());
    setDaysRemaining(calcDays > 0 ? calcDays : 0);
  }, []);

  // Exportar contenido a PDF
  const exportToPdf = () => {
    if (!contentRef.current) return;

    const options = {
      margin: 0.5,
      filename: `${projectName.replace(/\s+/g, "_")}_Informe_Progreso.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(options).from(contentRef.current).save();
  };

  return (
    <main
      className="max-w-5xl mx-auto p-8 font-sans text-[#e0e0e0] bg-[#121212] min-h-screen relative"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Botón Exportar en esquina superior derecha */}
      <button
        onClick={exportToPdf}
        className="
          absolute top-8 right-8
          bg-green-600 hover:bg-green-700
          text-white font-semibold
          px-4 py-2 rounded-md
          transition-colors duration-300 ease-in-out
          z-20
          select-none
          shadow-lg
        "
        aria-label="Exportar informe a PDF"
      >
        Exportar
      </button>

      <div ref={contentRef}>
        <h1 className="text-3xl font-bold mb-5">Informe de Progreso</h1>

        {/* Estado y nombre del proyecto */}
        <div className="mb-6 flex items-center gap-4">
          <StatusBadge status={status} />
          <div className="text-2xl font-extrabold">{projectName}</div>
        </div>

        {/* Fecha límite y días restantes en cuadros */}
        <div className="flex gap-6 mb-8">
          <InfoBox
            title="Fecha límite"
            content={format(new Date(dueDate), "dd/MM/yyyy")}
          />
          <InfoBox
            title="Días restantes"
            content={`${daysRemaining} días`}
            colorClass="text-yellow-400"
          />
        </div>

        <hr className="border-gray-700 my-8" />

        {/* Progreso General del Proyecto */}
        <section>
          <h2 className="text-xl font-bold mb-6">
            Progreso General del Proyecto
          </h2>

          <ProjectProgressSummary
            desarrollado={progressDesarrollado}
            desplegado={progressDesplegado}
            tareasCompletadas={completedTasks}
            tareasTotales={totalTasks}
          />

          {/* Tabla resumen tareas */}
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
                <td className="px-6 py-3 border-b border-gray-700">
                  Implementadas
                </td>
                <td className="px-6 py-3 border-b border-gray-700 text-right">
                  {taskSummary.implementadas}
                </td>
              </tr>
              <tr className="bg-white/5 hover:bg-white/10 transition">
                <td className="px-6 py-3 border-b border-gray-700">
                  Pendientes de despliegue
                </td>
                <td className="px-6 py-3 border-b border-gray-700 text-right">
                  {taskSummary.pendientesDespliegue}
                </td>
              </tr>
              <tr className="bg-white/5 hover:bg-white/10 transition">
                <td className="px-6 py-3 border-b border-gray-700">
                  Planificadas
                </td>
                <td className="px-6 py-3 border-b border-gray-700 text-right">
                  {taskSummary.planificadas}
                </td>
              </tr>
              <tr className="bg-white/10 font-bold">
                <td className="px-6 py-3">Totales</td>
                <td className="px-6 py-3 text-right">{taskSummary.total}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <hr className="border-gray-700 my-8" />

        {/* Actividad Reciente */}
        <section>
          <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
          <ul className="list-disc list-inside space-y-2">
            {recentTasks.slice(0, 5).map((task) => (
              <li key={task.id}>
                <span className="font-semibold">{task.name}</span> -{" "}
                {task.status} (finalizada el{" "}
                {format(new Date(task.fechaFinalizacion), "dd/MM/yyyy")})
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-gray-700 my-8" />

        {/* Registro de Riesgos y Bloqueos */}
        <section>
          <RiskCard risks={risks} showAddButton={false} />
        </section>

        <hr className="border-gray-700 my-8" />

        {/* Métricas de Calidad */}
        <section>
          <QualitySummaryCard />
        </section>
      </div>
    </main>
  );
}
