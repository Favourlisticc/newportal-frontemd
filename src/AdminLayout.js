import React from 'react';
import AdminDashboard from './page/auth/admin/dashboard/page/dasboard';
import AdminSidebar from './page/auth/admin/component/sidebar';

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-grow">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminLayout;
