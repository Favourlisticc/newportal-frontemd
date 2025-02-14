import React, { useState, useEffect } from 'react';
import { FiEye, FiDownload } from 'react-icons/fi';
import { TailSpin } from 'react-loader-spinner';

const PurchaseRecord = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('confirmed'); // Default active tab

  // Fetch purchases based on active tab and search query
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const clientData = JSON.parse(localStorage.getItem('Clientuser'));
        const clientId = clientData._id; // Get client ID from localStorage

        const response = await fetch(
          `https://newportal-backend.onrender.com/client/purchases?_id=${clientId}&status=${activeTab}&search=${searchQuery}`
        );
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [activeTab, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'pending'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'confirmed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setActiveTab('failed')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'failed'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by property name or amount..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Purchase Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-8">
            <TailSpin color="#6366f1" height={40} width={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Purchase Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src="https://via.placeholder.com/80"
                          alt="Property"
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <span className="font-medium">{purchase.propertyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                    ₦{purchase.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          purchase.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : purchase.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {purchase.status}
                      </span>
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

export default PurchaseRecord;