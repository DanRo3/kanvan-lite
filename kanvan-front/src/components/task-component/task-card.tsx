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
    <>
      <a href={href} className="task-card">
        <div className="name">{name}</div>
        <div className="avatars">
          {developers.map((dev, idx) => {
            const hasPhoto = !!dev.photoUrl;
            const initial = dev.email[0].toUpperCase();
            const bgColor = getRandomColor(dev.email);

            return (
              <div
                key={dev.id}
                className="avatar"
                style={{
                  background: hasPhoto ? "none" : bgColor,
                  zIndex: developers.length - idx, // para efecto de stack
                }}
                title={dev.email}
              >
                {hasPhoto ? (
                  <img src={dev.photoUrl!} alt={dev.email} />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
            );
          })}
        </div>
      </a>

      <style jsx>{`
        .task-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 32px 20px 56px 20px;
          min-height: 120px;
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
          transition: transform 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .task-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(31, 38, 135, 0.7);
          background: rgba(255, 255, 255, 0.15);
        }
        .name {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 16px; /* aumento del espacio vertical entre nombre y avatares */
          word-break: break-word;
        }
        .avatars {
          position: absolute;
          bottom: 16px;
          right: 20px;
          display: flex;
          flex-direction: row;
          gap: 0;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          color: #222;
          margin-left: -10px; /* para efecto de solapado */
          border: 2px solid #181818;
          background: #eee;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .avatar span {
          display: block;
        }
      `}</style>
    </>
  );
};

export default TaskCard;
