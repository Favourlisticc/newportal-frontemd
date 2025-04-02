import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const realtorData = JSON.parse(localStorage.getItem('realtorData'));
        const response = await axios.get('https://newportal-backend.onrender.com/realtor/clients', {
          params: {
            uplineEmail: realtorData.email,
            searchTerm,
            startDate,
            endDate,
            sortField,
            sortOrder,
          },
        });
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [searchTerm, startDate, endDate, sortField, sortOrder]);

  const handleViewPayments = async (clientId) => {
    setSelectedClientId(clientId);
    try {
      const response = await axios.get(`https://newportal-backend.onrender.com/realtor/clients/purchases?clientId=${clientId}`);
      setPurchaseDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching purchase details:', error);
    }
  };

  return (
    <div className="flex max-sm:w-screen">
      {/* Main Content */}
      <div className=" bg-gray-100 p-4 md:p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-700">View Clients</h1>
          <div className="text-sm text-gray-500">/ Dashboard</div>
        </header>
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-lg font-semibold mb-4 md:mb-0">View Clients</h2>
            <input
              type="text"
              placeholder="Search"
              className="border rounded p-2 text-sm w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <input
              type="date"
              className="border rounded p-2 text-sm w-full md:w-auto"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border rounded p-2 text-sm w-full md:w-auto"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto max-sm:w-screen"> {/* Wrapper for horizontal scrolling */}
              <table className="min-w-full border-collapse border border-gray-200 text-left text-sm text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-2">No</th>
                    <th className="border p-2">First Name</th>
                    <th className="border p-2">Last Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Phone</th>
                  
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => (
                    <tr key={client._id} className="odd:bg-white even:bg-gray-50">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{client.firstName}</td>
                      <td className="border p-2">{client.lastName}</td>
                      <td className="border p-2">{client.email}</td>
                      <td className="border p-2">{client.phone}</td>
                    
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
            <span className="text-sm text-gray-500 mb-4 md:mb-0">
              Showing 1 to {clients.length} of {clients.length} entries
            </span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-200 rounded">Previous</button>
              <button className="px-4 py-2 bg-gray-800 text-white rounded">
                1
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for View Payments */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full md:w-1/2 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Purchase Details</h2>
            <div className="overflow-x-auto"> {/* Wrapper for horizontal scrolling */}
              <table className="min-w-full border-collapse border border-gray-200 text-left text-sm text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-2">Property Name</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Payment Method</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseDetails.map((purchase) => (
                    <tr key={purchase._id} className="odd:bg-white even:bg-gray-50">
                      <td className="border p-2">{purchase.propertyName}</td>
                      <td className="border p-2">{purchase.amount}</td>
                      <td className="border p-2">{purchase.paymentMethod}</td>
                      <td className="border p-2">{purchase.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewClients;