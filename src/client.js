// DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './page/clients/components/sidebar';
import Navbar from './page/clients/components/navbar';

const ClientDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 pl-60">
        <Navbar />
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientDashboardLayout;