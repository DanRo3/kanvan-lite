"use client";
import React from "react";

interface User {
  id: string;
  email: string;
}

interface AddDevModalProps {
  users: User[];
  onAddUser: (user: User) => void;
  onClose: () => void;
}

const AddDevModal: React.FC<AddDevModalProps> = ({
  users,
  onAddUser,
  onClose,
}) => {
  return (
    <>
      {/* Contenedor modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
        <div className="bg-[#121212]/90 backdrop-blur-md rounded-xl shadow-lg max-w-lg w-full p-6 text-gray-200 font-sans relative">
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute top-4 right-4 text-gray-400 hover:text-green-400 transition-colors"
            type="button"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-6 select-none">
            Agregar desarrolladores
          </h2>

          <div className="overflow-auto max-h-[400px]">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr>
                  <th className="border-b border-green-400 pb-2 px-3">
                    Correo
                  </th>
                  <th className="border-b border-green-400 pb-2 px-3 w-16">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/10 transition-colors"
                  >
                    <td className="py-2 px-3 break-words">{user.email}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onAddUser(user)}
                        aria-label={`Agregar ${user.email} al proyecto`}
                        className="
                          text-green-400 font-bold text-xl 
                          w-7 h-7 rounded-lg border border-green-400 
                          flex items-center justify-center
                          hover:bg-green-400 hover:text-black
                          transition-colors
                          select-none
                        "
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-4 px-3 text-center text-gray-500 select-none"
                    >
                      No hay usuarios disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDevModal;
