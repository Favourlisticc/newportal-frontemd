import React, { useEffect, useState } from 'react';
import { FaUsers, FaStar, FaClock, FaFileContract } from 'react-icons/fa';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRealtor: 0,
    totalWithdrawn: 0,
    pendingWithdrawals: 0,
    totalPropertiesBought: 0,
    totalAmount: 0,
    totalClients: 0, // Assuming you have this stat
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes] = await Promise.all([
          axios.get('https://newportal-backend.onrender.com/admin/dashboard-stats'),
        ]);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ icon, title, value, color }) => {
    const formattedValue = typeof value === 'number' 
      ? title.includes('REALTORS') || title.includes('PROPERTIES') 
        ? value.toLocaleString() // Number format for realtors and properties
        : value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) // Currency format for amounts
      : 'N/A'; // Fallback for invalid values

    return (
      <div className={`${color} shadow-lg rounded-xl p-4 md:p-6 transition-all hover:scale-105 min-h-[120px] text-white`}>
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="p-2 md:p-3 rounded-full bg-white/10">
            {React.cloneElement(icon, { className: 'text-xl md:text-2xl' })}
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm text-gray-200 mb-1">{title}</p>
            {isLoading ? (
              <div className="h-6 flex items-center">
                <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
            ) : (
              <p className="text-lg md:text-2xl font-bold">
                {formattedValue}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ChartComponent = ({ stats }) => {
    const data = [
      { name: 'Realtors', value: stats.totalRealtor },
      { name: 'Clients', value: stats.totalClients },
      { name: 'Properties Sold', value: stats.totalPropertiesBought },
      { name: 'Total Amount', value: stats.totalAmount },
      { name: 'Total Withdrawn', value: stats.totalWithdrawn },
      { name: 'Pending Withdrawals', value: stats.pendingWithdrawals },
    ];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard
          icon={<FaUsers />}
          title="REGISTERED REALTORS"
          value={stats.totalRealtor || 0}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<FaStar />}
          title="TOTAL WITHDRAWN"
          value={stats.totalWithdrawn || 0}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          icon={<FaClock />}
          title="PENDING WITHDRAWALS"
          value={stats.pendingWithdrawals || 0}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
        <StatCard
          icon={<FaFileContract />}
          title="TOTAL PROPERTIES BOUGHT"
          value={stats.totalPropertiesBought || 0}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          icon={<FaFileContract />}
          title="TOTAL AMOUNT"
          value={stats.totalAmount || 0}
          color="bg-gradient-to-r from-red-500 to-red-600"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-[#002657] mb-4">
          Dashboard Overview
        </h3>
        <ChartComponent stats={stats} />
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
        <div className="p-4 md:p-6 bg-[#002657]">
          <h3 className="text-base md:text-lg font-semibold text-[#E5B30F]">
            <FaFileContract className="inline mr-2" />
            Last 15 Earning History
          </h3>
        </div>
        
        {error ? (
          <div className="p-4 md:p-6 text-center text-red-500">
            {error}
          </div>
        ) : isLoading ? (
          <div className="p-4 md:p-6 text-center">
            <svg className="animate-spin h-6 w-6 text-[#E5B30F] mx-auto" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['No', 'Username', 'Phone', 'Property', 'Property ID', 'Payment Type', 'Amount', 'Purchase Price', 'Commission'].map((header) => (
                    <th 
                      key={header}
                      className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-[#002657] uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {/* Example static data */}
                {[].map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">{entry.username}</td>
                    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">{entry.phone}</td>
                    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">{entry.property}</td>
                    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">{entry.propertyId}</td>
                    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">{entry.paymentType}</td>
                    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">
                      {Number(entry.amount).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">
                      {Number(entry.purchasePrice).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">
                      {Number(entry.commission).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;