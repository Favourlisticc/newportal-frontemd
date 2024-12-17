import React from 'react';
import { FaUsers, FaStar, FaBath } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Admin</span>
          <div className="h-8 w-8 bg-green-600 rounded-full"></div>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <FaUsers className="text-green-500 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">REGISTERED MEMBERS</p>
              <p className="text-xl font-semibold">1 Member</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <FaStar className="text-red-500 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">TOTAL WITHDRAWN</p>
              <p className="text-xl font-semibold">₦ 1,082,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <FaBath className="text-gray-500 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">TOTAL PENDING WITHDRAWAL</p>
              <p className="text-xl font-semibold">₦ 22,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earning History Table */}
      <div className="mt-8 bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Last 15 Earning History</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left">
              <th className="py-2">No</th>
              <th className="py-2">Username</th>
              <th className="py-2">Phone Number</th>
              <th className="py-2">Property</th>
              <th className="py-2">Property ID</th>
              <th className="py-2">Payment Type</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Purchase Price Paid</th>
              <th className="py-2">Commission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">1</td>
              <td className="py-2">admin1</td>
              <td className="py-2">9130657684</td>
              <td className="py-2">Greenwood</td>
              <td className="py-2">836dcf</td>
              <td className="py-2">Full</td>
              <td className="py-2">₦ 20,000</td>
              <td className="py-2">₦ 20,000,000</td>
              <td className="py-2">₦ 1,600,000</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
