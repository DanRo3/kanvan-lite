import React from "react";

type Status = "Completado" | "En_Progreso" | "Planeado";

interface ProjectCardProps {
  name: string;
  status: Status;
  pointsDone: number;
  pointsTotal: number;
  dueDate: string | Date | null | undefined;
  href: string;
}

const statusColors: Record<Status, string> = {
  Completado: "bg-green-400 text-gray-800 shadow-md",
  En_Progreso: "bg-yellow-400 text-gray-800 shadow-md",
  Planeado: "bg-red-400 text-gray-800 shadow-md",
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  status,
  pointsDone,
  pointsTotal,
  dueDate,
  href,
}) => {
  console.log(`La url es ${href}`);
  const statusStyle = statusColors[status];

  const dueDateObj =
    dueDate && typeof dueDate === "string" ? new Date(dueDate) : dueDate;

  const isValidDate =
    dueDateObj instanceof Date && !isNaN(dueDateObj.getTime());

  return (
    <a
      href={href}
      className="relative flex flex-col gap-3 p-10 pt-14 max-w-xs rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(31,38,135,0.37)] text-gray-300 font-sans no-underline cursor-pointer transition-transform transition-shadow transition-bg duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(31,38,135,0.7)] hover:bg-white/15"
    >
      <div
        className={`absolute top-5 right-5 px-3 py-1.5 rounded-lg font-semibold w-fit select-none whitespace-nowrap ${statusStyle}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>

      <div className="font-extrabold text-lg w-full mt-4 break-words">
        {name}
      </div>
      <div className="font-medium text-base">
        {pointsDone} / {pointsTotal} puntos realizados
      </div>
      <div className="text-sm text-gray-400">
        Fecha de entrega:{" "}
        {isValidDate ? dueDateObj!.toLocaleDateString() : "Sin fecha definida"}
      </div>
    </a>
  );
};

export default ProjectCard;
