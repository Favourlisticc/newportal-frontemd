import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate(); // Hook for navigation

  // Handle logout
  const handleLogout = () => {
    // Remove items from localStorage
    localStorage.removeItem('Admintoken');
    localStorage.removeItem('Adminusername');

    // Redirect to /admin/login
    navigate('/admin/login');
  };

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-gray-800 text-gray-100 flex items-center justify-between px-6 shadow-lg z-10">
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-700 rounded-lg focus:outline-none"
      >
        ☰
      </button>
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
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