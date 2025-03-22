import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiFrown } from 'react-icons/fi'; // Import icons for search and no results

export default function FundingHistory() {
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const tabs = ['pending', 'approved', 'rejected'];

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const response = await axios.get('https://newportal-backend.onrender.com/admin/funds');
      setFunds(response.data);
    } catch (error) {
      toast.error('Failed to fetch funds');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus, amount, _id) => {
    setProcessingId(id);
    try {
      await axios.put(`https://newportal-backend.onrender.com/admin/funds/${id}`, { status: newStatus, amount, id });
      toast.success(`Fund request ${newStatus}`);
      await fetchFunds();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    setProcessingId(id);
    try {
      await axios.delete(`https://newportal-backend.onrender.com/admin/funds/${id}`);
      toast.success('Fund request deleted');
      await fetchFunds();
    } catch (error) {
      toast.error('Failed to delete request');
    } finally {
      setProcessingId(null);
    }
  };

  // Fix the search filter
  const filteredData = funds
    .filter(fund => fund.status === activeTab)
    .filter(fund => {
      const usernameMatch = fund.username?.toLowerCase().includes(search.toLowerCase());
      const fullNameMatch = fund.user?.fullName?.toLowerCase().includes(search.toLowerCase());
      return usernameMatch || fullNameMatch;
    });

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg max-sm:w-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Funding History</h2>
      
      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-lg font-medium ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-4 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by username or name..."
            className="border p-2 pl-10 rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Table */}
     <div className=' overflow-x-auto'>
     <table className="min-w-full bg-white border mt-4">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Payment Date</th>
            <th className="p-3 text-left">Proof</th>
            <th className="p-3 text-left">Created At</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="p-3 text-center">
                <div className="flex justify-center">
                  <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((fund) => (
              <tr key={fund._id} className="border-b hover:bg-gray-100">
                <td className="p-3">
                  <div className="font-medium">{fund.username}</div>
                  <div className="text-sm text-gray-600">{fund.firstName}  {fund.lastName}</div>
                </td>
                <td className="font-medium p-3">{fund.phone}</td>
                <td className="text-sm text-gray-600 p-3">{fund.email}</td>
                <td className="p-3">₦{fund.amount}</td>
                <td className="p-3">{new Date(fund.paymentDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <img 
                    src={fund.proofImage} 
                    alt="Proof" 
                    className="w-16 h-16 cursor-pointer"
                    onClick={() => setSelectedImage(fund.proofImage)}
                  />
                </td>
                <td className="p-3">{new Date(fund.createdAt).toLocaleString()}</td>
                <td className="p-3 space-x-2">
                  {activeTab === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(fund._id, 'approved', fund.amount)}
                        className="bg-green-500 text-white px-3 mb-2 py-1 rounded disabled:opacity-50"
                        disabled={processingId === fund._id}
                      >
                        {processingId === fund._id ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            {/* Spinner SVG */}
                          </svg>
                        ) : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(fund._id, 'rejected')}
                        className="bg-red-500 text-white px-3 mb-2 py-1 rounded disabled:opacity-50"
                        disabled={processingId === fund._id}
                      >
                        {processingId === fund._id ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            {/* Spinner SVG */}
                          </svg>
                        ) : 'Reject'}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(fund._id)}
                    className="bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={processingId === fund._id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="p-3 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                  <FiFrown className="text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-500">No results found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
     </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999] overflow-x-auto">
          <div className="bg-white p-4 rounded-lg">
            <img src={selectedImage} alt="Proof" className=" h-96" />
            <button
              onClick={() => setSelectedImage(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}