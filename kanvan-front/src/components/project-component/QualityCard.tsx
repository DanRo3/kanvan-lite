import React from "react";

interface QualityCardProps {
  editable?: boolean; // Por defecto true para mantener comportamiento actual
}

const QualityCard: React.FC<QualityCardProps> = ({ editable = true }) => {
  const metrics = [
    "Bugs Bajos",
    "Bugs Normales",
    "Bugs Críticos",
    "Bugs Totales",
    "Cobertura de Tests",
  ];

  return (
    <section
      className="
        mt-8
        rounded-lg
        p-6
        bg-white/5
        backdrop-blur-md
        border border-white/20
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
      "
    >
      <h2 className="mt-0 mb-6 text-[#c2c2c2] font-bold text-xl">
        Métricas de Calidad
      </h2>

      <div className="flex flex-wrap justify-between gap-6">
        {metrics.map((title) => (
          <div
            key={title}
            className="
              flex-1 min-w-[140px]
              bg-white/15
              rounded-lg
              p-5
              shadow-[0_8px_32px_rgba(31,38,135,0.37)]
              flex flex-col items-center justify-center
            "
          >
            <span
              className="
                text-[#e0e0e0] font-semibold text-lg mb-3 text-center select-none
              "
            >
              {title}
            </span>
            <input
              type="number"
              min={0}
              step={1}
              defaultValue={0}
              aria-label={`${title} ${editable ? "editable" : "no editable"}`}
              onClick={(e) => {
                if (editable) e.currentTarget.select();
              }}
              readOnly={!editable}
              className={`
                w-20
                text-2xl font-extrabold text-green-400
                text-center
                bg-transparent border-none outline-none
                appearance-none
                ${
                  editable
                    ? "cursor-text"
                    : "cursor-not-allowed text-green-700/60"
                }
              `}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default QualityCard;
