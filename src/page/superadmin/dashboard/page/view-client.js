import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx';

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedClient, setSelectedClient] = useState(null);
  const [editClient, setEditClient] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [searchTerm, sortBy, sortOrder]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3005/admin/clients', {
        params: { search: searchTerm, sortBy, sortOrder }
      });
      setClients(response.data);
    } catch (error) {
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      setModalLoading(true);
      const response = await axios.get(`http://localhost:3005/admin/clients/${id}`);
      setSelectedClient(response.data);
    } catch (error) {
      toast.error('Failed to fetch client details');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditClient({ ...client });
  };

  const handleUpdate = async () => {
    try {
      setModalLoading(true);
      const response = await axios.put(`http://localhost:3005/admin/clients/${editClient._id}`, editClient);
      setClients(clients.map(c => c._id === editClient._id ? response.data : c));
      toast.success('Client updated successfully');
      setEditClient(null);
    } catch (error) {
      toast.error('Failed to update client');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setModalLoading(true);
      await axios.delete(`http://localhost:3005/admin/clients/${id}`);
      setClients(clients.filter(c => c._id !== id));
      toast.success('Client deleted successfully');
    } catch (error) {
      toast.error('Failed to delete client');
    } finally {
      setModalLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "Clients.xlsx");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search clients..."
          className="p-2 border rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            className="p-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Date</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
          </select>
          <select
            className="p-2 border rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
          <button
            onClick={exportToExcel}
            className="p-2 bg-green-500 text-white rounded"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {['First Name', 'Last Name', 'Username', 'Email', 'Phone', 'Actions'].map((header) => (
                  <th key={header} className="py-3 px-6 border-b">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 border-b">{client.firstName}</td>
                  <td className="py-4 px-6 border-b">{client.lastName}</td>
                  <td className="py-4 px-6 border-b">{client.username}</td>
                  <td className="py-4 px-6 border-b">{client.email}</td>
                  <td className="py-4 px-6 border-b">{client.phone}</td>
                  <td className="py-4 px-6 border-b space-x-2">
                    <button
                      onClick={() => handleView(client._id)}
                      className="text-blue-500 hover:text-blue-700"
                      disabled={modalLoading}
                    >
                      {modalLoading ? '...' : '👁️'}
                    </button>
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-yellow-500 hover:text-yellow-700"
                      disabled={modalLoading}
                    >
                      {modalLoading ? '...' : '✏️'}
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={modalLoading}
                    >
                      {modalLoading ? '...' : '🗑️'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl mb-4">Client Details</h2>
            {modalLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedClient).map(([key, value]) => (
                  key !== '_id' && (
                    <div key={key}>
                      <strong>{key}:</strong> {JSON.stringify(value)}
                    </div>
                  )
                ))}
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => setSelectedClient(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl mb-4">Edit Client</h2>
            {modalLoading ? (
              <div className="text-center">Saving...</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(editClient).map(([key, value]) => (
                  key !== '_id' && (
                    <div key={key} className="mb-2">
                      <label className="block mb-1 capitalize">{key}:</label>
                      <input
                        type={key === 'password' ? 'password' : 'text'}
                        className="w-full p-2 border rounded"
                        value={value}
                        onChange={(e) => setEditClient({
                          ...editClient,
                          [key]: e.target.value
                        })}
                      />
                    </div>
                  )
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleUpdate}
                disabled={modalLoading}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setEditClient(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ClientTable;