import React from "react";

interface QualityCardProps {
  editable?: boolean; // Por defecto true
  criticalBugs: number;
  normalBugs: number;
  lowBugs: number;
  testsCoberage: number;
  onMetricChange?: (metric: string, value: number) => void;
}

const QualityCard: React.FC<QualityCardProps> = ({
  editable = true,
  criticalBugs,
  normalBugs,
  lowBugs,
  testsCoberage,
  onMetricChange,
}: QualityCardProps) => {
  const totalBugs = criticalBugs + normalBugs + lowBugs;

  const metrics = [
    { title: "Bugs Bajos", value: lowBugs, key: "lowBugs" },
    { title: "Bugs Normales", value: normalBugs, key: "normalBugs" },
    { title: "Bugs Críticos", value: criticalBugs, key: "criticalBugs" },
    {
      title: "Bugs Totales",
      value: totalBugs,
      key: "totalBugs",
      editable: false,
    }, // No editable, es una suma
    {
      title: "Cobertura de Tests",
      value: testsCoberage,
      key: "testsCoverage",
      unit: "%",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    if (!editable || !onMetricChange) return;

    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      onMetricChange(key, value);
    }
  };

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

      <div className="flex flex-wrap justify-center sm:justify-between gap-6">
        {metrics.map(
          ({ title, value, key, editable: metricEditable, unit = "" }) => (
            <div
              key={key}
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
              <div className="flex items-center">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={value}
                  onChange={(e) => handleInputChange(e, key)}
                  aria-label={`${title} ${
                    editable ? "editable" : "no editable"
                  }`}
                  onClick={(e) => {
                    if (editable && metricEditable !== false)
                      e.currentTarget.select();
                  }}
                  readOnly={!editable || metricEditable === false}
                  className={`
                    w-20
                    text-2xl font-extrabold text-green-400
                    text-center
                    bg-transparent border-none outline-none
                    appearance-none
                    ${
                      !editable || metricEditable === false
                        ? "cursor-not-allowed text-green-700/60"
                        : "cursor-text"
                    }
                  `}
                />
                {unit && (
                  <span className="text-2xl font-extrabold text-green-400 ml-1 select-none">
                    {unit}
                  </span>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default QualityCard;
