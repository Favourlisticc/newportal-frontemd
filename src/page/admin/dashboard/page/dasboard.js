import React, { useEffect, useState } from 'react';
import { FaUsers, FaStar, FaClock, FaFileContract } from 'react-icons/fa'; // Changed FaBath to FaClock
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalConsultants: 0,
    totalWithdrawn: 0,
    pendingWithdrawals: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, earningsRes] = await Promise.all([
          axios.get('http://localhost:3005/admin/dashboard-stats'),
        ]);
        setStats(statsRes.data);
        setEarnings(earningsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-[#002657] shadow-lg rounded-xl p-4 md:p-6 transition-all hover:scale-105 min-h-[120px]">
      <div className="flex items-center space-x-3 md:space-x-4">
        <div className={`p-2 md:p-3 rounded-full ${color}`}>
          {React.cloneElement(icon, { className: 'text-xl md:text-2xl text-[#E5B30F]' })}
        </div>
        <div className="flex-1">
          <p className="text-xs md:text-sm text-gray-300 mb-1">{title}</p>
          {isLoading ? (
            <div className="h-6 flex items-center">
              <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-[#E5B30F]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </div>
          ) : (
            <p className="text-lg md:text-2xl font-bold text-white">
              {title.includes('CONSULTANTS') 
                ? value.toLocaleString() // Number format for consultants
                : value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
        <h2 className="text-xl md:text-2xl font-semibold text-[#002657]">Dashboard</h2>
        <div className="flex items-center space-x-3 md:space-x-4">
          <span className="text-xs md:text-sm text-[#002657]">Admin</span>
          <div className="h-6 w-6 md:h-8 md:w-8 bg-[#E5B30F] rounded-full"></div>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard
          icon={<FaUsers />}
          title="REGISTERED CONSULTANTS"
          value={stats.totalConsultants}
          color="bg-[#E5B30F]/10"
        />
        
        <StatCard
          icon={<FaStar />}
          title="TOTAL WITHDRAWN"
          value={stats.totalWithdrawn}
          color="bg-[#E5B30F]/10"
        />
        
        <StatCard
          icon={<FaClock />} 
          title="PENDING WITHDRAWALS"
          value={stats.pendingWithdrawals}
          color="bg-[#E5B30F]/10"
        />
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 md:p-6 bg-[#002657]">
          <h3 className="text-base md:text-lg font-semibold text-[#E5B30F]">
            <FaFileContract className="inline mr-2" />
            Last 15 Earning History
          </h3>
        </div>
        
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
              {earnings.map((entry, index) => (
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
      </div>
    </div>
  );
};

export default AdminDashboard;