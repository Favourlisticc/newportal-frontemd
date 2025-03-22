import React, { useState, useEffect } from 'react';
import Navbar from './dashboard/component/navbar';
import RealtorSidebar from './dashboard/component/sidebar';
import { Outlet, Navigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const jwt = localStorage.getItem("realtorJwt");

  useEffect(() => {
    document.title = "Baay Realty - Realtor Portal";
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  if (!jwt) {
    return <Navigate to="/realtor/login" />;
  }

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <RealtorSidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 pl-60 max-sm:pl-0">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;