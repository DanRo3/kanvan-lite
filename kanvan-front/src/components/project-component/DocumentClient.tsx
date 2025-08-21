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

  const exportToPdf = async () => {
    if (!projectData || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      let y = 10; // Posición vertical inicial
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      // Función para verificar y añadir una nueva página si es necesario
      const checkPage = (heightNeeded) => {
        if (y + heightNeeded > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // Función para trazar una línea separadora
      const drawSeparator = (startY) => {
        doc.setLineWidth(0.5);
        doc.setDrawColor("#D3D3D3"); // Gris claro
        doc.line(10, startY, 200, startY);
        y = startY + 5;
      };

      // ---
      // Mapeo de estados de tareas y proyectos
      // ---
      const projectStatusMap = {
        PLANNED: "Planificado",
        IN_PROGRESS: "En Progreso",
        COMPLETED: "Completado",
      };

      const recentActivityStatusMap = {
        PENDING: "Planificada",
        IN_PROGRESS: "En Progreso",
        COMPLETED: "Completada",
        DEPLOYED: "Desplegada",
      };

      // ========================
      // 1. Información General
      // ========================
      doc.setFontSize(24);
      doc.setFont(undefined, "bold");
      doc.text(`Informe de Progreso`, 10, y);
      y += 10;
      doc.setFontSize(18);
      doc.setFont(undefined, "normal");
      const splitProjectName = doc.splitTextToSize(
        projectData.projectName,
        180
      );
      doc.text(splitProjectName, 10, y);
      y += splitProjectName.length * 7 + 10;

      const translatedStatus =
        projectStatusMap[projectData.status] || projectData.status;
      let statusColor = "#000000"; // Color por defecto
      if (projectData.status === "COMPLETED") {
        statusColor = "#28a745"; // Verde
      } else if (projectData.status === "IN_PROGRESS") {
        statusColor = "#ffc107"; // Amarillo
      } else if (projectData.status === "PLANNED") {
        statusColor = "#dc3545"; // Rojo
      }

      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Estado:", 10, y);
      doc.setFont(undefined, "normal");
      doc.setTextColor(statusColor);
      doc.text(translatedStatus, 32, y);
      doc.setTextColor("#000000"); // Negro (reset)
      y += 7;

      doc.setFont(undefined, "bold");
      doc.text("Fecha Límite:", 10, y);
      doc.setFont(undefined, "normal");
      doc.text(formattedDueDate, 45, y);
      y += 7;

      doc.setFont(undefined, "bold");
      doc.text("Días Restantes:", 10, y);
      doc.setFont(undefined, "normal");
      doc.setTextColor("#ffc107"); // Amarillo
      doc.text(formattedDaysRemaining, 50, y);
      doc.setTextColor("#000000"); // Negro (reset)
      y += 15;

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("Descripción del Proyecto:", 10, y);
      y += 7;
      doc.setFont(undefined, "normal");
      const splitDescription = doc.splitTextToSize(
        projectData.description || "",
        180
      );
      doc.text(splitDescription, 10, y);
      y += splitDescription.length * 7 + 10;
      drawSeparator(y);

      // ========================
      // 2. Resumen de Puntos
      // ========================
      checkPage(50);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Resumen de Puntos", 10, y);
      y += 10;
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");

      doc.text("Puntos Usados:", 10, y);
      doc.setFont(undefined, "bold");
      doc.setTextColor("#28a745"); // Verde
      doc.text(projectData.pointsUsed.toString(), 42, y);
      doc.setTextColor("#000000"); // Negro (reset)
      y += 7;

      doc.setFont(undefined, "normal");
      doc.text("Puntos Presupuestados:", 10, y);
      doc.setFont(undefined, "bold");
      doc.text(projectData.pointsBudget.toString(), 58, y);
      doc.setFont(undefined, "normal");
      y += 15;
      drawSeparator(y);

      // ========================
      // 3. Métricas de Progreso
      // ========================
      checkPage(50);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Progreso General del Proyecto", 10, y);
      y += 10;

      const completedTasks = projectData.tasks.filter(
        (t) => t.status === "COMPLETED"
      ).length;
      const deployedTasks = projectData.tasks.filter(
        (t) => t.status === "DEPLOYED"
      ).length;
      const totalTasks = projectData.tasks.length;

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`Tareas Completadas:`, 10, y);
      doc.setFont(undefined, "bold");
      doc.text(`${deployedTasks} / ${totalTasks}`, 52, y);
      doc.setFont(undefined, "normal");
      y += 7;

      const devPercent =
        totalTasks > 0
          ? (((completedTasks + deployedTasks) / totalTasks) * 100).toFixed(2)
          : "0.00";
      doc.text(`Desarrollado:`, 10, y);
      doc.setFont(undefined, "bold");
      doc.text(`${devPercent}%`, 38, y);
      doc.setFont(undefined, "normal");
      y += 7;

      const deployedPercent =
        totalTasks > 0
          ? ((deployedTasks / totalTasks) * 100).toFixed(2)
          : "0.00";
      doc.text(`Desplegado:`, 10, y);
      doc.setFont(undefined, "bold");
      doc.text(`${deployedPercent}%`, 37, y);
      doc.setFont(undefined, "normal");
      y += 7;

      const projectPercent =
        projectData.pointsBudget > 0
          ? ((projectData.pointsUsed / projectData.pointsBudget) * 100).toFixed(
              2
            )
          : "0.00";
      doc.text(`% Proyecto Completado:`, 10, y);
      doc.setFont(undefined, "bold");
      doc.text(`${projectPercent}%`, 58, y);
      doc.setFont(undefined, "normal");
      y += 15;
      drawSeparator(y);

      // ========================
      // 4. Tabla de Resumen de Tareas
      // ========================
      checkPage(50);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Resumen de Tareas", 10, y);
      y += 10;

      const taskStatusMap = {
        PENDING: "Planificadas",
        IN_PROGRESS: "En Progreso",
        COMPLETED: "Completadas",
        DEPLOYED: "Desplegadas",
      };

      const taskCounts = Object.keys(taskStatusMap).reduce((acc, status) => {
        acc[status] = projectData.tasks.filter(
          (t) => t.status === status
        ).length;
        return acc;
      }, {});

      const summaryHeaders = ["Tareas", "Cantidad"];
      const summaryColWidths = [120, 40];
      const summaryRowHeight = 10;
      const startX = 10;

      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      let summaryX = startX;
      summaryHeaders.forEach((header, index) => {
        doc.text(header, summaryX, y);
        summaryX += summaryColWidths[index];
      });
      doc.line(
        startX,
        y + 2,
        startX + summaryColWidths.reduce((sum, width) => sum + width, 0),
        y + 2
      );
      y += summaryRowHeight;
      doc.setFont(undefined, "normal");

      Object.entries(taskStatusMap).forEach(([status, label]) => {
        checkPage(summaryRowHeight);
        summaryX = startX;
        doc.text(label, summaryX, y);
        summaryX += summaryColWidths[0];
        doc.text(taskCounts[status].toString(), summaryX, y, {
          align: "right",
        });
        y += summaryRowHeight;
      });

      doc.setFont(undefined, "bold");
      checkPage(summaryRowHeight);
      doc.text("Totales", startX, y);
      doc.text(totalTasks.toString(), startX + summaryColWidths[0], y, {
        align: "right",
      });
      y += summaryRowHeight;
      y += 5;
      drawSeparator(y);

      // ========================
      // 5. Tareas del Proyecto
      // ========================
      checkPage(50);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Tareas del Proyecto", 10, y);
      y += 10;

      const allSortedTasks = [...projectData.tasks].sort((a, b) => {
        const dateA = new Date(a.fechaFinalizacion);
        const dateB = new Date(b.fechaFinalizacion);
        return dateB.getTime() - dateA.getTime();
      });

      if (allSortedTasks.length > 0) {
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        let recentX = startX;
        const recentHeaders = ["Título", "Estado", "Finalización"];
        const recentColWidths = [120, 30, 40];
        recentHeaders.forEach((header, index) => {
          doc.text(header, recentX, y);
          recentX += recentColWidths[index];
        });
        doc.line(
          startX,
          y + 2,
          startX + recentColWidths.reduce((sum, width) => sum + width, 0),
          y + 2
        );
        y += 10;

        doc.setFont(undefined, "normal");
        allSortedTasks.forEach((task) => {
          const titleLines = doc.splitTextToSize(
            task.title,
            recentColWidths[0] - 5
          );
          const taskHeight = titleLines.length * 7;
          checkPage(taskHeight + 3);

          let currentY = y;
          recentX = startX;
          doc.text(titleLines, recentX, currentY);
          recentX += recentColWidths[0];
          const displayStatus =
            recentActivityStatusMap[task.status.toUpperCase()] || task.status;
          doc.text(displayStatus, recentX, currentY);
          recentX += recentColWidths[1];
          doc.text(
            format(new Date(task.fechaFinalizacion), "dd/MM/yyyy"),
            recentX,
            currentY
          );
          y += taskHeight + 3;
        });
      } else {
        checkPage(10);
        doc.setFont(undefined, "italic");
        doc.setFontSize(12);
        doc.text("No hay tareas registradas.", 10, y);
        y += 10;
      }

      y += 5;
      drawSeparator(y);

      // ========================
      // 6. Métricas de Calidad
      // ========================
      checkPage(50);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Métricas de Calidad", 10, y);
      y += 10;
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");

      doc.text(`Bugs Críticos:`, 10, y);
      doc.setFont(undefined, "bold");
      doc.setTextColor("#dc3545"); // Rojo
      doc.text(projectData.criticalBugs.toString(), 38, y);
      doc.setTextColor("#000000"); // Negro (reset)
      y += 7;

      doc.setFont(undefined, "normal");
      doc.text(`Total de Bugs:`, 10, y);
      doc.setFont(undefined, "bold");
      doc.text(projectData.totalBugs.toString(), 39, y);
      doc.setFont(undefined, "normal");
      y += 7;

      doc.text(`Cobertura de Tests:`, 10, y);
      doc.setFont(undefined, "bold");
      doc.text(`${projectData.testsCoberage || "N/A"}`, 50, y);
      doc.setFont(undefined, "normal");
      y += 15;
      drawSeparator(y);

      // ========================
      // 7. Riesgos
      // ========================
      checkPage(50);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Riesgos", 10, y);
      y += 10;
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      if (projectData.risks && projectData.risks.length > 0) {
        projectData.risks.forEach((risk) => {
          const riskText = `• ${risk.name || "Descripción no disponible."}`;
          const splitRisk = doc.splitTextToSize(riskText, 180);
          checkPage(splitRisk.length * 7);
          doc.text(splitRisk, 10, y);
          y += splitRisk.length * 7;
        });
      } else {
        checkPage(7);
        doc.setFont(undefined, "italic");
        doc.text("No se han registrado riesgos.", 10, y);
        y += 7;
      }

      // ========================
      // 8. Guardar el PDF
      // ========================
      doc.save(`${projectData.projectName}_Informe_Progreso.pdf`);
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
