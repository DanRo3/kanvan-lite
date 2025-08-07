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
    href: `/owner/project-details/${i + 1}`,
  }));

  return (
    <main
      className="p-10 bg-[#181818] min-h-screen font-sans text-[#e0e0e0]"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Encabezado principal de la página */}
      <h1 className="m-0 font-bold text-2xl mb-8">Tus Proyectos</h1>

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
