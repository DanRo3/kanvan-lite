"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

const HeaderDev = ({ onNavigate, currentPage }) => {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-10 backdrop-blur-md bg-gray-950 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-6 py-2 flex justify-end items-center">
        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-4 mr-6">
          <button
            onClick={() => onNavigate("projects")}
            // Aplica la clase condicional para resaltar el botón activo
            className={`transition-colors duration-200 ${
              currentPage === "projects"
                ? "text-green-400"
                : "text-gray-300 hover:text-green-400"
            }`}
          >
            Proyectos
          </button>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 rounded-lg border border-red-500/50 bg-red-600/20 text-red-400 font-semibold transition-colors duration-200 hover:bg-red-600/30"
        >
          <FiLogOut />
          Salir
        </button>
      </div>
    </header>
  );
};

export default HeaderDev;
