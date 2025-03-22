// Frontend Component
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

const PendingWithdrawals = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://newportal-backend.onrender.com/admin/withdrawals/${activeTab}`);
      setWithdrawals(response.data);
    } catch (error) {
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [activeTab]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`https://newportal-backend.onrender.com/admin/withdrawals/${id}`, { status: newStatus });
      toast.success(`Withdrawal ${newStatus}`);
      fetchWithdrawals();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-[#E5B30F] text-white',
      approved: 'bg-green-600 text-white',
      rejected: 'bg-red-600 text-white'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-white max-sm:w-screen max-sm:p-3">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#002657] mb-6">
          Withdrawal Requests
        </h2>

        <div className="flex space-x-2 mb-6">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
                ${
                  activeTab === tab
                    ? 'bg-[#002657] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#002657]" />
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <Clock className="w-24 h-24 mb-4 text-[#E5B30F]" />
              <p className="text-[#002657] text-lg font-medium">
                No {activeTab} withdrawals found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#002657] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Username</th>
                    <th className="px-6 py-4 text-left">Full Name</th>
                    <th className="px-6 py-4 text-left">Phone</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Amount</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    {activeTab === 'pending' && <th className="px-6 py-4 text-left">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {withdrawals.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.username}</td>
                      <td className="px-6 py-4">{`${item.firstName} ${item.lastName}`}</td>
                      <td className="px-6 py-4">{item.phone}</td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">₦{item.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {new Date(item.timestamp).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4">{statusBadge(item.status)}</td>
                      {activeTab === 'pending' && (
                        <td className="px-6 py-4 flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(item._id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(item._id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
    </div>
  );
};

export default PendingWithdrawals;