import React from "react";
import Header from "./Header"; // Asegúrate de que la ruta sea correcta

const MainLayout = ({ children }) => {
  return (
    <div className="bg-gray-800 text-gray-200 min-h-screen">
      {/* Se pasa la función onNavigate a Header */}
      <Header onNavigate={() => {}} currentPage={() => {}} />

      {/* El contenido de la página se renderiza aquí */}
      <main className="container mx-auto px-6 py-20">{children}</main>
    </div>
  );
};

export default MainLayout;
