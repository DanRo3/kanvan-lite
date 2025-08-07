import React from "react";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

interface TaskCardProps {
  name: string;
  developers: Developer[];
  href: string;
}

function getRandomColor(seed: string) {
  // Pequeña función para obtener color pastel único basado en la email
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 60%, 70%)`;
}

const TaskCard: React.FC<TaskCardProps> = ({ name, developers, href }) => {
  return (
    <a
      href={href}
      className="relative flex flex-col justify-end p-8 pt-8 pb-14 min-h-[120px] max-w-xs rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(31,38,135,0.37)] text-gray-300 font-sans no-underline cursor-pointer transition-transform transition-shadow transition-bg duration-250 ease-in-out hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(31,38,135,0.7)] hover:bg-white/15"
    >
      <div className="font-bold text-lg mb-4 break-words">{name}</div>
      <div className="absolute bottom-4 right-5 flex flex-row gap-0">
        {developers.map((dev, idx) => {
          const hasPhoto = !!dev.photoUrl;
          const initial = dev.email[0].toUpperCase();
          const bgColor = getRandomColor(dev.email);

          return hasPhoto ? (
            <div
              key={dev.id}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-900 shadow-sm flex items-center justify-center"
              style={{
                marginLeft: idx === 0 ? 0 : "-10px",
                zIndex: developers.length - idx,
              }}
              title={dev.email}
            >
              <img
                src={dev.photoUrl!}
                alt={dev.email}
                className="w-full h-full object-cover block"
              />
            </div>
          ) : (
            <div
              key={dev.id}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base text-gray-900 border-2 border-gray-900 shadow-sm"
              style={{
                backgroundColor: bgColor,
                marginLeft: idx === 0 ? 0 : "-10px",
                zIndex: developers.length - idx,
              }}
              title={dev.email}
            >
              <span>{initial}</span>
            </div>
          );
        })}
      </div>
    </a>
  );
};

export default TaskCard;
