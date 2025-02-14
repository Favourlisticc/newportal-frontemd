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
        const consultantData = JSON.parse(localStorage.getItem('consultData'));
        const response = await axios.get('https://newportal-backend.onrender.com/consult/clients', {
          params: {
            uplineEmail: consultantData.email,
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
      const response = await axios.get(`https://newportal-backend.onrender.com/consult/clients/purchases?clientId=${clientId}`);
      setPurchaseDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching purchase details:', error);
    }
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">View Clients</h1>
          <div className="text-sm text-gray-500">/ Dashboard</div>
        </header>
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">View Clients</h2>
            <input
              type="text"
              placeholder="Search"
              className="border rounded p-2 text-sm w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <input
              type="date"
              className="border rounded p-2 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border rounded p-2 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <table className="min-w-full border-collapse border border-gray-200 text-left text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-2">No</th>
                  <th className="border p-2">First Name</th>
                  <th className="border p-2">Last Name</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Date of Birth</th>
                  <th className="border p-2">Gender</th>
                  <th className="border p-2">Passport Photo</th>
                  <th className="border p-2">Street</th>
                  <th className="border p-2">City</th>
                  <th className="border p-2">State</th>
                  <th className="border p-2">Country</th>
                  <th className="border p-2">Zip Code</th>
                  <th className="border p-2">Next of Kin Name</th>
                  <th className="border p-2">Next of Kin Relationship</th>
                  <th className="border p-2">Next of Kin Email</th>
                  <th className="border p-2">Next of Kin Phone</th>
                  <th className="border p-2">Employer Name</th>
                  <th className="border p-2">Employer Address</th>
                  <th className="border p-2">Employer Email</th>
                  <th className="border p-2">Employer Phone</th>
                  <th className="border p-2">Upline Name</th>
                  <th className="border p-2">Upline Phone</th>
                  <th className="border p-2">Upline Email</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={client._id} className="odd:bg-white even:bg-gray-50">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{client.firstName}</td>
                    <td className="border p-2">{client.lastName}</td>
                    <td className="border p-2">{client.username}</td>
                    <td className="border p-2">{client.email}</td>
                    <td className="border p-2">{client.phone}</td>
                    <td className="border p-2">{new Date(client.dateOfBirth).toLocaleDateString()}</td>
                    <td className="border p-2">{client.gender}</td>
                    <td className="border p-2">
                      <img src={client.passportPhoto} alt="Passport" className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="border p-2">{client.address?.street}</td>
                    <td className="border p-2">{client.address?.city}</td>
                    <td className="border p-2">{client.address?.state}</td>
                    <td className="border p-2">{client.address?.country}</td>
                    <td className="border p-2">{client.address?.zipCode}</td>
                    <td className="border p-2">{client.nextOfKin?.name}</td>
                    <td className="border p-2">{client.nextOfKin?.relationship}</td>
                    <td className="border p-2">{client.nextOfKin?.email}</td>
                    <td className="border p-2">{client.nextOfKin?.phone}</td>
                    <td className="border p-2">{client.employer?.name}</td>
                    <td className="border p-2">{client.employer?.address}</td>
                    <td className="border p-2">{client.employer?.email}</td>
                    <td className="border p-2">{client.employer?.phone}</td>
                    <td className="border p-2">{client.upline?.name}</td>
                    <td className="border p-2">{client.upline?.phone}</td>
                    <td className="border p-2">{client.upline?.email}</td>
                    <td className="border p-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleViewPayments(client._id)}
                      >
                        View Payments
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Purchase Details</h2>
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