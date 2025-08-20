// src/components/project-component/DocumentClient.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
// Asegúrate de que los paths a tus componentes son correctos
import RiskCard from "@/components/project-component/RisksCard";
import QualitySummaryCard from "@/components/project-component/QualitySummaryCard";
import ProjectProgressSummary from "@/components/project-component/ProjectProgressSummary";
import TaskSummaryTable from "@/components/task-component/TaskSummaryTable";
import RecentActivityCard from "./RecentActivityCard";
import { format, differenceInCalendarDays } from "date-fns";
import { getProjectByPublicId } from "@/api/projects/service/project.service";

// --- Definición de Interfaces ---
// ... (Tus interfaces ProjectData, Risk, Task, TaskSummary, etc., se mantienen igual) ...

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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusMap: Record<string, { bgColor: string; textColor: string }> = {
    // Nuevos mapeos basados en los estados de la API
    PLANNED: { bgColor: "bg-red-600", textColor: "text-red-100" },
    IN_PROGRESS: { bgColor: "bg-yellow-500", textColor: "text-yellow-900" },
    COMPLETED: { bgColor: "bg-green-600", textColor: "text-green-100" },
  };

  const colors = statusMap[status.toUpperCase()] ?? {
    bgColor: "bg-gray-700",
    textColor: "text-gray-300",
  };

  // Mapear el nombre del estado para mostrarlo
  const displayStatus: Record<string, string> = {
    PLANNED: "Planificado",
    IN_PROGRESS: "En Progreso",
    COMPLETED: "Completado",
  };

  const statusText = displayStatus[status.toUpperCase()] ?? status;

  return (
    <div
      className={`${colors.bgColor} ${colors.textColor} inline-block px-3 py-1 rounded-md font-semibold text-sm select-none`}
      aria-label={`Estado del proyecto: ${statusText}`}
    >
      {statusText}
    </div>
  );
};

// --- Componente Principal ---
export default function DocumentClient({ publicId }: { publicId: string }) {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiData = await getProjectByPublicId(publicId);

        // Mapea los datos del backend a la estructura que tu componente espera
        const formattedData = {
          id: apiData.id,
          projectName: apiData.name, // <-- Corregido: 'name' se mapea a 'projectName'
          status: apiData.status,
          dueDate: apiData.deadline, // <-- Corregido: 'deadline' se mapea a 'dueDate'
          tasks: apiData.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            status: task.status,
            fechaFinalizacion: task.updatedAt,
          })),
          totalTasks: apiData.tasks.length,
          recentTasks: apiData.tasks || [],
          risks: apiData.risks || [],
          criticalBugs: apiData.criticalBugs,
          normalBugs: apiData.normalBugs,
          lowBugs: apiData.lowBugs,
          totalBugs:
            apiData.criticalBugs + apiData.normalBugs + apiData.lowBugs,
          testsCoberage: apiData.testsCoberage,
          pointsBudget: apiData.pointsBudget,
          pointsUsed: apiData.pointsUsed,
          description: apiData.description,
        };

        setProjectData(formattedData);
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("No se pudo cargar la información del proyecto.");
      } finally {
        setLoading(false);
      }
    };

    if (publicId) {
      fetchProject();
    }
  }, [publicId]);

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto p-8 font-sans text-[#e0e0e0] bg-[#121212] min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold">Cargando...</div>
      </main>
    );
  }

  if (error || !projectData) {
    return (
      <main className="max-w-5xl mx-auto p-8 font-sans text-[#e0e0e0] bg-[#121212] min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold text-red-500">{error}</div>
      </main>
    );
  }

  const dueDate = new Date(projectData.dueDate);
  const isDueDateValid = !isNaN(dueDate.getTime());
  const formattedDueDate = isDueDateValid
    ? format(dueDate, "dd/MM/yyyy")
    : "Fecha no válida";

  const daysRemaining = isDueDateValid
    ? differenceInCalendarDays(dueDate, new Date())
    : 0;
  const formattedDaysRemaining =
    daysRemaining > 0 ? `${daysRemaining} días` : "Finalizado";

  // Exportar a PDF (función sin cambios)
  const exportToPdf = async () => {
    if (!contentRef.current || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0.5, 0.5, pdfWidth, pdfHeight);
      pdf.save(
        `${projectData.projectName.replace(/\s+/g, "_")}_Informe_Progreso.pdf`
      );
    } catch (error) {
      console.error("Error al exportar el PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <main
      className="max-w-5xl mx-auto p-8 font-sans text-[#e0e0e0] bg-[#121212] min-h-screen relative"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <button
        onClick={exportToPdf}
        disabled={isExporting} // Deshabilita el botón mientras se exporta
        className={`
        absolute top-8 right-8
        text-white font-semibold
        px-4 py-2 rounded-md
        transition-colors duration-300 ease-in-out
        z-20
        select-none
        shadow-lg
        ${
          isExporting
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }
      `}
        aria-label={isExporting ? "Exportando..." : "Exportar informe a PDF"}
      >
        {isExporting ? "Exportando..." : "Exportar"}
      </button>

      <div ref={contentRef}>
        <h1 className="text-3xl font-bold mb-5">Informe de Progreso</h1>

        <div className="mb-6 flex items-center gap-4">
          <StatusBadge status={projectData.status || ""} />
          <div className="text-2xl font-extrabold">
            {projectData.projectName || "Cargando nombre..."}
          </div>
        </div>

        <div className="mt-6 mb-2 font-semibold text-lg text-gray-400">
          Descripción del Proyecto
        </div>
        <p className="mt-2 mb-4 w-full bg-white/5 border border-green-400 rounded-xl text-[#e0e0e0] text-base p-3 font-sans resize-y min-h-[150px]">
          {projectData.description ?? ""}
        </p>

        <div className="flex gap-6 mb-8">
          <InfoBox title="Fecha límite" content={formattedDueDate} />
          <InfoBox
            title="Días restantes"
            content={formattedDaysRemaining}
            colorClass="text-yellow-400"
          />
        </div>

        <hr className="border-gray-700 my-8" />

        <section>
          <h2 className="text-xl font-bold mb-6">
            Progreso General del Proyecto
          </h2>
          <ProjectProgressSummary
            tasks={projectData.tasks}
            pointsBudget={projectData.pointsBudget}
            pointsUsed={projectData.pointsUsed}
          />
          {projectData.tasks ? (
            <TaskSummaryTable tasks={projectData.tasks || []} />
          ) : null}{" "}
        </section>

        <hr className="border-gray-700 my-8" />

        <RecentActivityCard recentTasks={projectData.recentTasks || []} />
        <hr className="border-gray-700 my-8" />

        <section>
          <RiskCard risks={projectData.risks} showAddButton={false} />
        </section>

        <hr className="border-gray-700 my-8" />

        <section>
          <QualitySummaryCard
            criticalBugs={projectData.criticalBugs}
            totalBugs={projectData.totalBugs}
            testsCoberage={projectData.testsCoberage}
          />
        </section>
      </div>
    </main>
  );
}
