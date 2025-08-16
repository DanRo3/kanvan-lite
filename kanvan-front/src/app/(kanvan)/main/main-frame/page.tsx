"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import ProjectsPage from "../../owner/main-frame/page";
import UsersPage from "../../owner/users/page";

const App = () => {
  const [currentPage, setCurrentPage] = useState("projects");

  const renderPage = () => {
    switch (currentPage) {
      case "projects":
        return <ProjectsPage />;
      case "users":
        return <UsersPage />;
      default:
        return <ProjectsPage />;
    }
  };
  return (
    <div className="bg-gray-800 text-gray-200 min-h-screen">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="container mx-auto px-6 py-20">{renderPage()}</div>
    </div>
  );
};

export default App;
