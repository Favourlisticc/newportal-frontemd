import React from 'react';
import { FaUsers, FaChartLine, FaMoneyBill, FaUniversity, FaRegFileAlt, FaRegQuestionCircle, FaBuilding } from 'react-icons/fa';

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-green-700 min-h-screen text-white">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold">Wetfront Admin</h1>
        <div className="mt-8">
          <p className="text-sm">Kenny King</p>
          <p className="text-xs">Admin</p>
        </div>
      </div>
      <nav className="px-6 mt-10">
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          <FaChartLine className="inline-block mr-2" /> Dashboard
        </a>
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          <FaUsers className="inline-block mr-2" /> Members
        </a>
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          <FaRegFileAlt className="inline-block mr-2" /> Statutory
        </a>
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          <FaMoneyBill className="inline-block mr-2" /> Funding
        </a>
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          <FaUniversity className="inline-block mr-2" /> Bank Details
        </a>
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          <FaBuilding className="inline-block mr-2" /> Property Sales
        </a>
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          Withdrawal
        </a>
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          <FaRegQuestionCircle className="inline-block mr-2" /> FAQ
        </a>
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          Properties
        </a>
        <a href="#" className="block py-2 text-white hover:bg-green-600 rounded-md">
          Extras
        </a>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
