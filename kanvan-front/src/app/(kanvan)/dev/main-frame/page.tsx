"use client";

import React, { useState, useEffect } from "react";
import ProjectCard from "@/components/project-component/ProjectCard";
import AddProjectModal from "@/components/modals/AddProjectModal";
import { getAllProjects } from "@/api/projects/service/project.service";
import CreateProjectOutputDto from "@/api/projects/interface/output/create-project.output.dto";

type Status = "Completado" | "En_Progreso" | "Planeado";

function mapStatus(status?: string): Status {
  if (!status) return "Completado";
  const st = status.toLowerCase();
  if (st === "completed" || st === "deployed") return "Completado";
  if (st === "in_progress") return "En_Progreso";
  if (st === "planned" || st === "delayed" || st === "cancelled")
    return "Planeado";
  return "Completado";
}

function mapProjectsToCards(projects: CreateProjectOutputDto[]) {
  return projects.map((proj) => ({
    name: proj.name,
    status: mapStatus(proj.status),
    pointsDone: proj.pointsUsed ?? 0,
    pointsTotal: proj.pointsBudget ?? 0,
    dueDate: proj.deadline ?? null,
    href: `/dev/project-details/${proj.id}`,
  }));
}

export default function ProjectsDevPage() {
  const [projects, setProjects] = useState<
    Array<{
      name: string;
      status: Status;
      pointsDone: number;
      pointsTotal: number;
      dueDate: string | Date | null;
      href: string;
    }>
  >([]);

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  const exampleDevelopers = [
    { id: "1", email: "ana@example.com", photoUrl: null },
    { id: "2", email: "jose@example.com", photoUrl: null },
    { id: "3", email: "luisa@example.com", photoUrl: null },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        const mapped = mapProjectsToCards(data);
        setProjects(mapped);
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    };
    fetchProjects();
  }, []);

  const closeAddProjectModal = () => setIsAddProjectModalOpen(false);

  const handleCreateProject = (createdProject: CreateProjectOutputDto) => {
    const newCard = {
      name: createdProject.name,
      status: mapStatus(createdProject.status),
      pointsDone: createdProject.pointsUsed ?? 0,
      pointsTotal: createdProject.pointsBudget ?? 0,
      dueDate: createdProject.deadline ?? null,
      href: `/dev/project-details/${createdProject.id}`,
    };
    setProjects((prev) => [...prev, newCard]);
    closeAddProjectModal();
  };

  return (
    <main
      className="p-10 bg-[#181818] min-h-screen font-sans text-[#e0e0e0] relative"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <h1 className="m-0 font-bold text-2xl mb-8">Mis Proyectos</h1>

      <section
        className="
          mt-0
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
          max-w-[1360px]
          mx-auto
        "
      >
        {projects.map((proj, id) => (
          <ProjectCard key={id} {...proj} />
        ))}
      </section>

      {isAddProjectModalOpen && (
        <AddProjectModal
          developers={exampleDevelopers}
          onCreate={handleCreateProject}
          onClose={closeAddProjectModal}
        />
      )}
    </main>
  );
}
