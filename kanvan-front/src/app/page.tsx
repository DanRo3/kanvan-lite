"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/auth/login"); // ajusta esta ruta según tu setup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-8">
      <div className="bg-gray-800 bg-opacity-40 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full p-12 text-gray-100 font-sans text-center select-none">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          Bienvenido a <span className="text-indigo-400">Kanvan-Lite</span>
        </h1>
        <p className="text-gray-300 mb-10 max-w-md mx-auto text-base md:text-lg leading-relaxed">
          Organiza y supervisa los proyectos de tu empresa de forma sencilla.
          Mantén el control sobre el avance, tareas y resultados con una
          interfaz intuitiva y moderna.
        </p>
        <button
          onClick={goToLogin}
          className="inline-block px-10 py-3 rounded-2xl bg-gray-700 bg-opacity-50 backdrop-blur-md text-gray-200 font-semibold 
                     shadow-lg shadow-black/60 hover:bg-gray-600 hover:bg-opacity-70 hover:shadow-indigo-500/70 
                     transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500/60"
          aria-label="Ingresar al login"
        >
          Ingresar al Login
        </button>
      </div>
    </div>
  );
}
