"use client";

import React, { useState } from "react";
import ProjectsDevPage from "../../dev/main-frame/page";
import HeaderDev from "@/components/layout/HeaderDev";

const App = () => {
  const [currentPage, setCurrentPage] = useState("projects");

  const renderPage = () => {
    switch (currentPage) {
      case "projects":
        return <ProjectsDevPage />;

      default:
        return <ProjectsDevPage />;
    }
  };
  return (
    <div className="bg-gray-800 text-gray-200 min-h-screen">
      <HeaderDev onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="container mx-auto px-6 py-20">{renderPage()}</div>
    </div>
  );
};

export default App;
