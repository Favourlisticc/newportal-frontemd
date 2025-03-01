import React from 'react';
import AdminDashboard from './page/superadmin/dashboard/page/dasboard';
import AdminSidebar from './page/superadmin/component/sidebar';
import { Outlet } from "react-router-dom"; // Import Outlet

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
