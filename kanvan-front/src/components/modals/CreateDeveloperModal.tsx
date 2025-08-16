import React, { useState } from "react";
import { createUser } from "@/api/user/service/user.service";
import CreateUserInputDto from "@/api/user/interface/input/create-user.input.dto";

interface CreateDeveloperModalProps {
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateDeveloperModal: React.FC<CreateDeveloperModalProps> = ({
  onClose,
  onUserCreated,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !email) {
      setError("Por favor, completa ambos campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, introduce un correo electrónico válido.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userData: CreateUserInputDto = { name, email };
      await createUser(userData);
      onUserCreated();
      onClose();
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Error al crear el usuario. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
      <div className="bg-[#121212]/90 backdrop-blur-md rounded-xl shadow-lg max-w-lg w-full p-6 text-gray-200 font-sans relative">
        <h2 className="text-2xl font-bold text-green-400 mb-6">
          Crear Desarrollador
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="w-full mb-4">
          <label
            className="block text-gray-300 text-sm font-semibold mb-2"
            htmlFor="name"
          >
            Usuario
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/10 text-gray-200 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          />
        </div>

        <div className="w-full mb-6">
          <label
            className="block text-gray-300 text-sm font-semibold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/10 text-gray-200 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          />
        </div>

        <div className="flex gap-4 w-full justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-green-400 bg-green-500/20 text-green-300 font-semibold transition-colors hover:bg-green-500/30 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-gray-300 font-semibold transition-colors hover:bg-white/20"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDeveloperModal;
