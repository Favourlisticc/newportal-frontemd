import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('SuperAdmintoken');
    localStorage.removeItem('SuperAdminusername');
    navigate('/admin/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-gray-800 text-gray-100 flex items-center justify-between px-6 shadow-lg z-10 md:left-64">
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-700 rounded-lg focus:outline-none md:hidden"
      >
        <FaBars className="h-6 w-6" />
      </button>

      <h1 className="text-xl font-semibold">SuperAdmin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="p-2 hover:bg-gray-700 rounded-lg focus:outline-none"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;