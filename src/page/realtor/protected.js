import React, { useState } from 'react';
import Navbar from './dashboard/component/navbar';
import RealtorSidebar from './dashboard/component/sidebar';
import { Outlet } from "react-router-dom"; // Import Outlet

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <RealtorSidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 pl-60 max-sm:pl-0">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;