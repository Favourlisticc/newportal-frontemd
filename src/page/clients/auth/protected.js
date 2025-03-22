import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ClientSidebar from "../components/sidebar";
import Navbar from "../components/navbar";

const ProtectedRoute = () => {
  const jwt = localStorage.getItem("Clienttoken");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Baay Realty - Client Portal";
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!jwt) {
    return <Navigate to="/client/login" />;
  }

  return (
    <div className="flex">
      <ClientSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 lg:pl-60">
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;