import { Risk } from "@/api/risks/interface/input/risk.input.dto";
import { FaTrashAlt } from "react-icons/fa";

interface RiskCardProps {
  risks: Risk[];
  onAddRisk?: () => void;
  onDeleteRisk?: (riskId: string) => void;
  showAddButton?: boolean;
}

const RiskCard: React.FC<RiskCardProps> = ({
  risks,
  onAddRisk,
  onDeleteRisk,
  showAddButton = true,
}) => {
  const colorMap: Record<string, string> = {
    LOW: "bg-green-400",
    NORMAL: "bg-yellow-400",
    CRITICAL: "bg-red-400",
  };

  const labelMap: Record<string, string> = {
    LOW: "bajo",
    NORMAL: "normal",
    CRITICAL: "crítico",
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
      <h2 className="m-0 mb-6 text-[#c2c2c2] font-bold text-xl">
        Registro de Riesgos y Bloqueos
      </h2>

      {showAddButton && (
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
      )}

      <div className="mt-3 max-h-52 overflow-y-auto flex flex-col gap-3 pr-3">
        {risks.length === 0 && (
          <p className="text-[#c2c2c2] italic">
            No hay riesgos registrados todavía.
          </p>
        )}

        {risks.map((risk, idx) => {
          const bgColor = colorMap[risk.scope] ?? "bg-gray-400";
          const label = labelMap[risk.scope] ?? "desconocido";

          return (
            <div
              key={idx}
              className="
                flex items-center gap-3
                p-3 rounded-lg
                bg-white/7
              "
            >
              {/* Nombre del riesgo */}
              <span className="flex-1 text-[#e0e0e0] truncate">
                {risk.name}
              </span>

              {/* Estado con rectángulo coloreado con tamaño fijo y centrado */}
              <span
                className={`${bgColor} text-gray-900 text-xs px-2 py-0.5 rounded select-none font-semibold min-w-[60px] text-center`}
                title={`Impacto: ${label}`}
              >
                {label}
              </span>

              {/* Botón eliminar */}
              {onDeleteRisk && risk.id && (
                <button
                  onClick={() => onDeleteRisk(risk.id)}
                  aria-label="Eliminar riesgo"
                  className="text-red-500 hover:text-red-700 transition p-1"
                  title="Eliminar riesgo"
                  type="button"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RiskCard;
