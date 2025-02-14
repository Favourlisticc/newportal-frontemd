// pages/PurchaseRecord.jsx
import { useState, useEffect } from 'react';
import { FiDollarSign, FiHome } from 'react-icons/fi';
import { TailSpin } from 'react-loader-spinner';

const Home = () => {
  const [stats, setStats] = useState({ totalPurchases: 0, totalProperties: 0 });
  const [loading, setLoading] = useState(true);
  const [referralInfo, setReferralInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientData = JSON.parse(localStorage.getItem('Clientuser'));
        const clientId = clientData._id;
        
        // Fetch client stats
        const statsResponse = await fetch(`https://newportal-backend.onrender.com/client/purchases/stats/${clientId}`);
        const statsData = await statsResponse.json();
        setStats(statsData);

        console.log(statsData)

        // Fetch referral info
        setReferralInfo({
          name: clientData.upline?.name || 'N/A',
          phone: clientData.upline?.phone || 'N/A',
          email: clientData.upline?.email || 'N/A'
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <FiDollarSign className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Purchases</p>
              {loading ? (
                <TailSpin color="#6366f1" height={24} width={24} />
              ) : (
                <p className="text-2xl font-semibold">₦{stats.totalPurchases?.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <FiHome className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Properties Owned</p>
              {loading ? (
                <TailSpin color="#22c55e" height={24} width={24} />
              ) : (
                <p className="text-2xl font-semibold">{stats.totalProperties}</p>
              )}
            </div>
          </div>
        </div>

        
      </div>

      {referralInfo && (
          <div className="bg-white p-6 rounded-xl shadow-sm col-span-2 text-left">
            <h3 className="text-sm font-medium text-gray-500 mb-2">You were referred by:</h3>
            <div className="space-y-1">
              <p className="text-gray-900">{referralInfo.name}</p>
              <p className="text-gray-600 text-sm">{referralInfo.phone}</p>
              <p className="text-gray-600 text-sm">{referralInfo.email}</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default Home;