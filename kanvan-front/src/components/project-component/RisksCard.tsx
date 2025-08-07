import React from "react";

export interface Risk {
  descripcion: string;
  impacto: "bajo" | "medio" | "alto";
}

interface RiskCardProps {
  risks: Risk[];
  onAddRisk: () => void;
}

const RiskCard: React.FC<RiskCardProps> = ({ risks, onAddRisk }) => {
  const colorMap: Record<string, string> = {
    bajo: "bg-green-400",
    medio: "bg-yellow-400",
    alto: "bg-red-400",
  };

  return (
    <section
      className="
        mt-8 rounded-lg p-6
        bg-white/5 backdrop-blur-md
        border border-white/20
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        relative
      "
    >
      <h2
        className="
          m-0 mb-6 text-[#c2c2c2] font-bold text-xl
        "
      >
        Registro de Riesgos y Bloqueos
      </h2>

      {/* Botón + en esquina superior derecha */}
      <button
        type="button"
        aria-label="Agregar riesgo"
        onClick={onAddRisk}
        className="
          absolute top-6 right-6
          rounded-md border border-white/30
          bg-white/10 text-gray-200 font-semibold
          cursor-pointer px-3.5 py-1.5
          text-[1.25rem] leading-none
          select-none
          transition-colors duration-300 ease-in-out
          z-10
          hover:bg-white/20
        "
      >
        +
      </button>

      {/* Lista de riesgos */}
      <div className="mt-3 max-h-52 overflow-y-auto flex flex-col gap-3 pr-3">
        {risks.length === 0 && (
          <p className="text-[#c2c2c2] italic">
            No hay riesgos registrados todavía.
          </p>
        )}

        {risks.map((risk, idx) => {
          const bgColor = colorMap[risk.impacto] ?? "bg-gray-400";

          return (
            <div
              key={idx}
              className="
                flex items-center gap-3
                p-3 rounded-lg
                bg-white/7
              "
            >
              <span className="flex-1 text-[#e0e0e0]">{risk.descripcion}</span>
              <div
                title={`Impacto: ${risk.impacto}`}
                className={`${bgColor} w-6 h-6 rounded-sm`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RiskCard;
