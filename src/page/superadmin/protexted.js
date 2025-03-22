import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "./component/sidebar";
import AdminNavbar from "./component/navbar";

const ProtectedRoute = () => {
  const jwt = localStorage.getItem("SuperAdmintoken");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Baay Realtors - Super Admin Portal";
  }, []);

  if (!jwt) {
    return <Navigate to="/superadmin/login" />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 md:pl-64">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <main className="p-6 max-sm:p-0 overflow-y-auto mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;