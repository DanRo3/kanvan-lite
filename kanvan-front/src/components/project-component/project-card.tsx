import React from "react";

type Status = "green" | "yellow" | "red";

interface ProjectCardProps {
  name: string;
  status: Status;
  pointsDone: number;
  pointsTotal: number;
  dueDate: string | Date;
  href: string;
}

const statusColors: Record<Status, string> = {
  green: "#4ade80",
  yellow: "#facc15",
  red: "#f87171",
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  status,
  pointsDone,
  pointsTotal,
  dueDate,
  href,
}) => {
  const color = statusColors[status];
  const dueDateObj = typeof dueDate === "string" ? new Date(dueDate) : dueDate;

  return (
    <>
      <a href={href} className="project-card">
        <div className="status" style={{ backgroundColor: color }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
        <div className="name">{name}</div>
        <div className="points">
          {pointsDone} / {pointsTotal} puntos realizados
        </div>
        <div className="due-date">
          Fecha de entrega: {dueDateObj.toLocaleDateString()}
        </div>
      </a>

      <style jsx>{`
        .project-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 40px 20px 20px 20px; /* espacio arriba para el estado */
          max-width: 320px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          color: #e0e0e0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease,
            background 0.3s ease;
        }
        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(31, 38, 135, 0.7);
          background: rgba(255, 255, 255, 0.15);
        }
        .status {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 4px 12px;
          border-radius: 8px;
          color: #1f2937;
          font-weight: 600;
          width: fit-content;
          user-select: none;
          white-space: nowrap;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .name {
          font-weight: 700;
          font-size: 1.25rem;
          width: 100%;
          margin: 16px 0 0 0; /* margen arriba para dar más espacio */
          word-break: break-word;
        }
        .points {
          font-weight: 500;
          font-size: 1rem;
        }
        .due-date {
          font-size: 0.9rem;
          color: #b0b0b0;
        }
      `}</style>
    </>
  );
};

export default ProjectCard;
