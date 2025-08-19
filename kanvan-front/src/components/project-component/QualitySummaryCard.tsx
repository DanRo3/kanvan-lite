// src/components/project-component/QualitySummaryCard.tsx
"use client";
import React from "react";

interface QualitySummaryProps {
  criticalBugs: number;
  totalBugs: number;
  testsCoberage: number;
}

const QualitySummaryCard: React.FC<QualitySummaryProps> = ({
  criticalBugs,
  totalBugs,
  testsCoberage,
}) => {
  return (
    <section
      className="
        mt-8 rounded-lg p-6
        bg-white/5 backdrop-blur-md
        border border-white/20
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
      "
    >
      <h2 className="m-0 mb-6 text-[#c2c2c2] font-bold text-xl">
        Métricas de Calidad
      </h2>

      <div className="flex flex-wrap justify-between gap-6">
        <div className="flex-1 min-w-[140px] bg-white/15 rounded-lg p-5 shadow-[0_8px_32px_rgba(31,38,135,0.37)] flex flex-col items-center justify-center">
          <span className="text-[#e0e0e0] font-semibold text-lg mb-3 text-center select-none">
            Bugs Críticos
          </span>
          <span className="text-2xl font-extrabold text-red-500">
            {criticalBugs}
          </span>
        </div>
        <div className="flex-1 min-w-[140px] bg-white/15 rounded-lg p-5 shadow-[0_8px_32px_rgba(31,38,135,0.37)] flex flex-col items-center justify-center">
          <span className="text-[#e0e0e0] font-semibold text-lg mb-3 text-center select-none">
            Bugs Totales
          </span>
          <span className="text-2xl font-extrabold text-yellow-400">
            {totalBugs}
          </span>
        </div>
        <div className="flex-1 min-w-[140px] bg-white/15 rounded-lg p-5 shadow-[0_8px_32px_rgba(31,38,135,0.37)] flex flex-col items-center justify-center">
          <span className="text-[#e0e0e0] font-semibold text-lg mb-3 text-center select-none">
            Cobertura de Tests
          </span>
          <span className="text-2xl font-extrabold text-green-400">
            {testsCoberage}%
          </span>
        </div>
      </div>
    </section>
  );
};

export default QualitySummaryCard;
