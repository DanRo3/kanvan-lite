"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FiLogOut, FiArrowLeft } from "react-icons/fi";

const TopMenu = ({ role }) => {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    router.push("/auth/login");
  };

  const handleGoBack = () => {
    const path = role === "owner" ? "/main/main-frame" : "/main/main-frame-dev";
    router.push(path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-10 backdrop-blur-md bg-gray-950 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-6 py-1.5 flex justify-between items-center">
        <button
          onClick={handleGoBack}
          className="flex items-center px-3 py-1.5 rounded-lg border border-white/20 bg-gray-800/50 text-white font-semibold transition-colors duration-200 hover:bg-gray-800/80"
          aria-label="Volver"
        >
          <FiArrowLeft className="text-xl" />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-1.5 rounded-lg border border-red-500/50 bg-red-600/20 text-red-400 font-semibold transition-colors duration-200 hover:bg-red-600/30"
          aria-label="Salir"
        >
          <FiLogOut className="text-xl mr-2" /> Salir
        </button>
      </div>
    </header>
  );
};

export default TopMenu;
