"use client";
import React, { useState } from "react";

interface AddRiskModalProps {
  scopes: string[]; // Lista de alcances desde BD
  onSave: (riskDescription: string, scope: string) => void;
  onClose: () => void;
}

const AddRiskModal: React.FC<AddRiskModalProps> = ({
  scopes,
  onSave,
  onClose,
}) => {
  const [risk, setRisk] = useState("");
  const [selectedScope, setSelectedScope] = useState(
    scopes.length > 0 ? scopes[0] : ""
  );

  const handleSave = () => {
    if (!risk.trim()) {
      alert("Por favor, ingresa una descripción para el riesgo.");
      return;
    }
    onSave(risk.trim(), selectedScope);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-risk-title"
          className="bg-[#121212]/90 backdrop-blur-md rounded-xl shadow-lg max-w-md w-full text-[#e0e0e0] p-6 font-sans"
        >
          <h2 id="add-risk-title" className="text-2xl font-bold mb-6">
            Agregar Riesgo
          </h2>

          {/* Campo Riesgo */}
          <label htmlFor="risk-input" className="block font-semibold mb-1">
            Riesgo
          </label>
          <input
            id="risk-input"
            type="text"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            placeholder="Describe el riesgo"
            className="mb-5 w-full rounded-md border border-green-400 bg-[#222] px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-green-500"
          />

          {/* Barra desplegable Alcance */}
          <label htmlFor="scope-select" className="block font-semibold mb-1">
            Alcance
          </label>
          <select
            id="scope-select"
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            className="mb-6 w-full rounded-md border border-green-400 bg-[#222] px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-green-500"
          >
            {scopes.map((scope) => (
              <option key={scope} value={scope}>
                {scope}
              </option>
            ))}
          </select>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-md border border-green-400 bg-green-400/30 font-semibold cursor-pointer text-green-400 hover:bg-green-400/60 transition"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-white/30 bg-white/10 font-semibold cursor-pointer text-[#e0e0e0] hover:bg-white/20 transition"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRiskModal;
