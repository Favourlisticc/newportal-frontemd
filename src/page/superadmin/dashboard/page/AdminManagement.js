import React, { useState, useEffect } from 'react';
import { FaUser,  FaPlusSquare, FaSpinner, FaUserShield, FaUserCog } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Admin Management Page
const AdminManagement = () => {
    const [activeTab, setActiveTab] = useState('view'); // 'view' or 'create'
    const [adminViewType, setAdminViewType] = useState('superadmin'); // 'superadmin' or 'admin'
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      adminType: 'admin'
    });
  
    useEffect(() => {
      fetchAdmins();
    }, [adminViewType]);
  
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3005/admin/get-all-admins?type=${adminViewType}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setAdmins(response.data.admins);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch admins');
      } finally {
        setLoading(false);
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setCreateLoading(true);
      
      try {
        const response = await axios.post('http://localhost:3005/admin/create-admin', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        toast.success(response.data.message || 'Admin created successfully');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          adminType: 'admin'
        });
        
        // Refresh the admin list if on view tab
        if (activeTab === 'view') {
          fetchAdmins();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create admin');
      } finally {
        setCreateLoading(false);
      }
    };
  
    const handleDeleteAdmin = async (adminId) => {
      if (window.confirm('Are you sure you want to delete this admin?')) {
        console.log(adminId)
        try {
          const response = await axios.delete(`http://localhost:3005/admin/delete-admin/${adminId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          toast.success(response.data.message || 'Admin deleted successfully');
          fetchAdmins();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete admin');
        }
      }
    };
  
    console.log(admins)
    return (
      <div className="p-6 mt-20">
        <ToastContainer />
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Admin Management</h1>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'view' 
                    ? 'text-blue-600 border-blue-600 active' 
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('view')}
              >
                <FaUser className="w-4 h-4 mr-2" />
                View Admins
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'create' 
                    ? 'text-blue-600 border-blue-600 active' 
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('create')}
              >
                <FaPlusSquare className="w-4 h-4 mr-2" />
                Create Admin
              </button>
            </li>
          </ul>
        </div>
        
        {/* View Admins Tab */}
        {activeTab === 'view' && (
          <div>
            <div className="mb-6 border-b border-gray-200">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                <li className="mr-2">
                  <button
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                      adminViewType === 'superadmin' 
                        ? 'text-blue-600 border-blue-600 active' 
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setAdminViewType('superadmin')}
                  >
                    <FaUserShield className="w-4 h-4 mr-2" />
                    Super Admins
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                      adminViewType === 'admin' 
                        ? 'text-blue-600 border-blue-600 active' 
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setAdminViewType('admin')}
                  >
                    <FaUserCog className="w-4 h-4 mr-2" />
                    Admins
                  </button>
                </li>
              </ul>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
              </div>
            ) : admins.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
                No {adminViewType === 'superadmin' ? 'super admins' : 'admins'} found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Type</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 whitespace-nowrap">{admin.firstName} {admin.lastName}</td>
                        <td className="py-4 px-4 whitespace-nowrap">{admin.email}</td>
                        <td className="py-4 px-4 whitespace-nowrap">{admin.phoneNumber}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            admin.adminType === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.adminType === 'superadmin' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Create Admin Tab */}
        {activeTab === 'create' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Admin</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="adminType" className="block text-sm font-medium text-gray-700 mb-1">Admin Type</label>
                <select
                  id="adminType"
                  name="adminType"
                  value={formData.adminType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Admin'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };
  
  export default AdminManagement;