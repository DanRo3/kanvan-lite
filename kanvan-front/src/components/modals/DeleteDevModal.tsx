"use client";

import React from "react";

interface Developer {
  id: string;
  email: string;
}

interface DeleteDevModalProps {
  developers: Developer[];
  onRemoveUser: (user: Developer) => void;
  onClose: () => void;
}

const DeleteDevModal: React.FC<DeleteDevModalProps> = ({
  developers,
  onRemoveUser,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
      <div className="bg-[#121212]/90 backdrop-blur-md rounded-xl shadow-lg max-w-lg w-full p-6 text-gray-200 font-sans relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          type="button"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 select-none">
          Eliminar desarrolladores
        </h2>

        <div className="overflow-auto max-h-[400px]">
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr>
                <th className="border-b border-red-500 pb-2 px-3">Correo</th>
                <th className="border-b border-red-500 pb-2 px-3 w-16">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {developers.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="py-4 px-3 text-center text-gray-500 select-none"
                  >
                    No hay desarrolladores asignados.
                  </td>
                </tr>
              )}
              {developers.map((dev) => (
                <tr
                  key={dev.id}
                  className="hover:bg-red-700/20 transition-colors"
                >
                  <td className="py-2 px-3 break-words">{dev.email}</td>
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveUser(dev)}
                      aria-label={`Eliminar ${dev.email} del proyecto`}
                      className="text-red-500 font-bold text-xl w-7 h-7 rounded-lg border border-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors select-none"
                    >
                      −
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeleteDevModal;
