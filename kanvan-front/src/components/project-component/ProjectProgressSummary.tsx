"use client";
import React from "react";

interface ProjectProgressSummaryProps {
  desarrollado: number; // porcentaje
  desplegado: number; // porcentaje
  tareasCompletadas: number;
  tareasTotales: number;
}

const ProjectProgressSummary: React.FC<ProjectProgressSummaryProps> = ({
  desarrollado,
  desplegado,
  tareasCompletadas,
  tareasTotales,
}) => {
  const porcentajeCompletado =
    tareasTotales > 0
      ? ((tareasCompletadas / tareasTotales) * 100).toFixed(2)
      : "0.00";

  return (
    <section
      className="
        mt-8 rounded-lg p-6
        bg-white/5 backdrop-blur-md
        border border-white/20
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        text-[#e0e0e0]
        font-sans
      "
    >
      <h2 className="m-0 mb-6 font-bold text-xl select-none">
        Resumen de Progreso
      </h2>

      <div className="flex flex-wrap justify-between gap-6 text-center">
        <div className="flex-1 min-w-[140px] bg-white/15 rounded-lg p-5 shadow-[0_8px_32px_rgba(31,38,135,0.37)] flex flex-col items-center justify-center">
          <span className="font-semibold text-lg mb-3 select-none">
            Desarrollado
          </span>
          <span className="text-3xl font-extrabold text-green-400">
            {desarrollado}%
          </span>
        </div>

        <div className="flex-1 min-w-[140px] bg-white/15 rounded-lg p-5 shadow-[0_8px_32px_rgba(31,38,135,0.37)] flex flex-col items-center justify-center">
          <span className="font-semibold text-lg mb-3 select-none">
            Desplegado
          </span>
          <span className="text-3xl font-extrabold text-cyan-400">
            {desplegado}%
          </span>
        </div>

        <div className="flex-1 min-w-[140px] bg-white/15 rounded-lg p-5 shadow-[0_8px_32px_rgba(31,38,135,0.37)] flex flex-col items-center justify-center">
          <span className="font-semibold text-lg mb-3 select-none">
            Tareas Completadas
          </span>
          <span className="text-2xl font-extrabold">
            {tareasCompletadas} / {tareasTotales}
          </span>
        </div>

        <div className="flex-1 min-w-[140px] bg-white/15 rounded-lg p-5 shadow-[0_8px_32px_rgba(31,38,135,0.37)] flex flex-col items-center justify-center">
          <span className="font-semibold text-lg mb-3 select-none">
            % Proyecto Completado
          </span>
          <span className="text-3xl font-extrabold text-yellow-400">
            {porcentajeCompletado}%
          </span>
        </div>
      </div>
    </section>
  );
};

export default ProjectProgressSummary;
