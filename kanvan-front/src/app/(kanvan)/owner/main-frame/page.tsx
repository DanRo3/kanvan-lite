"use client";
import React from "react";
import ProjectCard from "@/components/project-component/ProjectCard";

export default function Page() {
  const baseProject = {
    name: "Proyecto Kanvan Prueba con nombre largo",
    status: "green" as const,
    pointsDone: 12,
    pointsTotal: 20,
    dueDate: "2025-09-01",
    href: "/owner/project-details",
  };

  const projects = Array.from({ length: 10 }, (_, i) => ({
    ...baseProject,
    name: `${baseProject.name} #${i + 1}`,
    href: `/owner/project-details/`,
  }));

  return (
    <main
      className="p-10 bg-[#181818] min-h-screen font-sans text-[#e0e0e0] relative"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Encabezado principal de la página */}
      <h1 className="m-0 font-bold text-2xl mb-8">Proyectos Actuales</h1>

      {/* Botón en esquina superior derecha */}
      <button
        type="button"
        aria-label="Crear nuevo proyecto"
        className="
          absolute top-5 right-5
          px-5 py-2.5
          rounded-xl border border-white/20
          bg-white/10 backdrop-blur-md
          text-[#e0e0e0] font-semibold
          cursor-pointer
          shadow-[0_8px_32px_rgba(31,38,135,0.37)]
          transition-colors transition-shadow duration-300 ease-in-out
          select-none
          hover:bg-white/20 hover:shadow-[0_10px_40px_rgba(31,38,135,0.6)] hover:text-[#fafafa]
        "
        onClick={() => {
          alert("Aquí iría la navegación para crear un nuevo proyecto");
        }}
      >
        + Nuevo Proyecto
      </button>

      {/* Contenedor en grid: 4 columnas, gap entre cards */}
      <section
        className="
          mt-0
          grid grid-cols-4 gap-6
          max-w-[1360px]
          mx-auto
        "
      >
        {projects.map((proj, idx) => (
          <ProjectCard key={idx} {...proj} />
        ))}
      </section>
    </main>
  );
}
