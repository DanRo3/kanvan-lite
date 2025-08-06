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
    href: `/owner/project-details/`,
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
        Proyectos Actuales
      </h1>

      {/* Botón en esquina superior derecha */}
      <button
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "10px 20px",
          borderRadius: 16,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          color: "#e0e0e0",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.background = "rgba(255, 255, 255, 0.2)";
          target.style.boxShadow = "0 10px 40px 0 rgba(31, 38, 135, 0.6)";
          target.style.color = "#fafafa";
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.background = "rgba(255, 255, 255, 0.1)";
          target.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
          target.style.color = "#e0e0e0";
        }}
        onClick={() => {
          alert("Aquí iría la navegación para crear un nuevo proyecto");
        }}
        type="button"
        aria-label="Crear nuevo proyecto"
      >
        + Nuevo Proyecto
      </button>

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
