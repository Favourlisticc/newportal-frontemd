import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, SortDesc, SortAsc, Eye, Edit2, Trash2, X, Loader, Download } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';

const RealtorsList = () => {
  const [realtors, setRealtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchRealtors = async () => {
    try {
      setLoading(true);
      const adjustDate = (date, isEnd) => {
        if (!date) return null;
        const newDate = new Date(date);
        if (isEnd) {
          newDate.setHours(23, 59, 59, 999);
        } else {
          newDate.setHours(0, 0, 0, 0);
        }
        return newDate;
      };

      const adjustedStartDate = adjustDate(startDate, false);
      const adjustedEndDate = adjustDate(endDate, true);

      const response = await axios.get(`https://newportal-backend.onrender.com/admin/viewrealtors`, {
        params: {
          search,
          sortOrder,
          startDate: adjustedStartDate ? adjustedStartDate.toISOString() : null,
          endDate: adjustedEndDate ? adjustedEndDate.toISOString() : null,
        },
      });
      setRealtors(response.data);
    } catch (error) {
      toast.error('Failed to fetch realtors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealtors();
  }, [search, sortOrder, startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      setActionLoading(id);
      await axios.delete(`https://newportal-backend.onrender.com/admin/delete/${id}`);
      toast.success('Realtor deleted successfully');
      fetchRealtors();
    } catch (error) {
      toast.error('Failed to delete Realtor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = async (id) => {
    try {
      setActionLoading(id);
      const response = await axios.get(`https://newportal-backend.onrender.com/admin/viewrealtors/${id}`);
      setSelectedRealtor(response.data);
      setIsViewModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch Realtor details');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = async (id) => {
    try {
      setActionLoading(id);
      const response = await axios.get(`https://newportal-backend.onrender.com/admin/viewrealtors/${id}`);
      setEditForm(response.data);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch Realtor details');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdate = async () => {
    try {
      setActionLoading(editForm._id);
      await axios.put(`https://newportal-backend.onrender.com/admin/editrealtors/${editForm._id}`, editForm);
      toast.success('Realtor updated successfully');
      setIsEditModalOpen(false);
      fetchRealtors();
    } catch (error) {
      toast.error('Failed to update Realtor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = () => {
    const flattenedRealtors = realtors.map(realtor => ({
      username: realtor.username,
      firstName: realtor.firstName,
      lastName: realtor.lastName,
      phone: realtor.phone,
      email: realtor.email,
      dob: new Date(realtor.dob).toLocaleDateString(),
      gender: realtor.gender,
      address: realtor.address,
      country: realtor.country,
      state: realtor.state,
      accountName: realtor.accountName,
      accountNumber: realtor.accountNumber,
      bank: realtor.bank,
      referrerIdNumber: realtor.referrerIdNumber || '',
      uplineName: realtor.upline?.name || '',
      uplinePhone: realtor.upline?.phone || '',
      uplineEmail: realtor.upline?.email || '',
      clientReferrals: realtor.Clientreferrals.map(r => `${r.name} (${r.phone}, ${r.email})`).join('; '),
      RealtorReferrals: realtor.Realtorreferrals.map(r => `${r.username} (${r.phone}, ${r.email})`).join('; '),
      profileimage: realtor.profileimage || '',
      balance: realtor.balance || '',
      createdAt: new Date(realtor.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(flattenedRealtors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Realtors');
    XLSX.writeFile(workbook, 'realtors.xlsx');
  };

  // Helper function to format data for display
  const formatDataForDisplay = (key, value) => {
    if (value === null || value === undefined || value === '') {
      return 'No data for this field';
    }

    // Format dates
    if (key.toLowerCase().includes('date') || key.toLowerCase().includes('dob') || key.toLowerCase().includes('createdat')) {
      return new Date(value).toLocaleString();
    }

    // Format upline information
    if (key === 'upline' && typeof value === 'object') {
      return value.name ? `${value.name} (${value.phone}, ${value.email})` : 'No upline data';
    }

    // Format arrays (e.g., referrals)
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'No data for this field';
    }

    // Default case
    return value;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto max-sm:w-screen">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002657] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex max-sm:flex-col items-center gap-4">
          <div className="flex max-sm:flex-col items-center gap-2 ">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002657] focus:border-transparent"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002657] focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 px-4 py-2 bg-[#002657] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            {sortOrder === 'desc' ? <SortDesc className="h-5 w-5" /> : <SortAsc className="h-5 w-5" />}
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <Download className="h-5 w-5" />
            Export to Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-[#002657] text-white">
            <tr>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  <Loader className="w-8 h-8 animate-spin text-[#002657] mx-auto" />
                </td>
              </tr>
            ) : realtors.length > 0 ? (
              realtors.map((realtor) => (
                <tr key={realtor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{realtor.username}</td>
                  <td className="px-6 py-4">{`${realtor.firstName} ${realtor.lastName}`}</td>
                  <td className="px-6 py-4">{realtor.email}</td>
                  <td className="px-6 py-4">{realtor.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleView(realtor._id)}
                        disabled={actionLoading === realtor._id}
                        className="p-2 text-[#002657] hover:bg-[#002657] hover:text-white rounded-full transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(realtor._id)}
                        disabled={actionLoading === realtor._id}
                        className="p-2 text-[#E5B305] hover:bg-[#E5B305] hover:text-white rounded-full transition-colors"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(realtor._id)}
                        disabled={actionLoading === realtor._id}
                        className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No realtors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedRealtor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#002657]">Realtor Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedRealtor).map(([key, value]) => {
                  if (key !== '_id' && key !== '__v' && key !== 'password') {
                    return (
                      <div key={key} className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-600 capitalize">{key}</p>
                        <p className="font-medium">
                          {formatDataForDisplay(key, value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#002657]">Edit Realtor</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['firstName', 'lastName', 'phone', 'email', 'address', 'country', 'state', 'accountName', 'accountNumber', 'bank', "password"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm text-left font-medium text-gray-700 mb-1 capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={editForm[field] || ''}
                        onChange={(e) => setEditForm({...editForm, [field]: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002657] focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 bg-[#002657] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
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

export default RealtorsList;