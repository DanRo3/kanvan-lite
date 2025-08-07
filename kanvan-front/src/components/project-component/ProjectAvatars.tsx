import React from "react";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

interface ProjectAvatarsProps {
  showButtons?: boolean;
  developers: Developer[];
  onAdd?: () => void;
  onRemove?: () => void;
}

const getRandomColor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 60%, 70%)`;
};

const ProjectAvatars: React.FC<ProjectAvatarsProps> = ({
  developers,
  onAdd,
  onRemove,
  showButtons = true,
}) => {
  return (
    <div className="flex items-center mt-2">
      {/* Botón eliminar dev (−) */}
      {showButtons && (
        <button
          onClick={onRemove}
          aria-label="Eliminar desarrolladores"
          className="
            bg-transparent border border-green-400 text-green-400
            font-bold text-2xl rounded-lg w-9 h-9
            cursor-pointer mr-2 flex items-center justify-center
            select-none transition-colors duration-300 ease-in-out
            hover:bg-green-300/30
          "
          type="button"
        >
          −
        </button>
      )}

      {/* Avatares */}
      <div
        className="
          flex items-center
          overflow-x-auto
          flex-nowrap
          scrollbar-thin
          gap-[-10px]
        "
      >
        {developers.map((dev, idx) => {
          const hasPhoto = !!dev.photoUrl;
          const initial = dev.email[0].toUpperCase();
          const bgColor = getRandomColor(dev.email);

          return (
            <div
              key={dev.id}
              title={dev.email}
              className="
                w-9 h-9 rounded-full border-2 border-[#121212] shadow-sm
                flex justify-center items-center flex-shrink-0 select-none cursor-default
                font-bold text-base
                text-[#222]
              "
              style={{
                backgroundColor: hasPhoto ? "transparent" : bgColor,
                marginLeft: idx === 0 ? 0 : -10,
              }}
            >
              {hasPhoto ? (
                <img
                  src={dev.photoUrl!}
                  alt={dev.email}
                  className="w-full h-full object-cover block rounded-full"
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón añadir dev (+) */}
      {showButtons && (
        <button
          onClick={onAdd}
          aria-label="Agregar desarrolladores"
          className="
            bg-transparent border border-green-400 text-green-400
            font-bold text-2xl rounded-lg w-9 h-9
            cursor-pointer ml-2 flex items-center justify-center
            select-none transition-colors duration-300 ease-in-out
            hover:bg-green-300/30
          "
          type="button"
        >
          +
        </button>
      )}
    </div>
  );
};

export default ProjectAvatars;
