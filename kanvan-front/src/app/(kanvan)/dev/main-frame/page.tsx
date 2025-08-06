"use client";
import React from "react";
import ProjectCard from "@/components/project-component/project-card";

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
      style={{
        padding: 40,
        backgroundColor: "#181818",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#e0e0e0",
      }}
    >
      {/* Encabezado principal de la página */}
      <h1
        style={{
          margin: 0,
          fontWeight: 700,
          fontSize: "2rem",
          marginBottom: 32,
        }}
      >
        Tus Proyectos
      </h1>

      {/* Contenedor en grid: 4 columnas, gap entre cards */}
      <section
        style={{
          marginTop: 0,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          maxWidth: 1360,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {projects.map((proj, idx) => (
          <ProjectCard key={idx} {...proj} />
        ))}
      </section>
    </main>
  );
}
