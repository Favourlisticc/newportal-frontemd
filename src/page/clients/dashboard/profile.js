import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiEdit, FiSave, FiLock, FiUser } from 'react-icons/fi';

const logActivity = async (userId, userModel, activityType, description, metadata = {}) => {
  try {
    await axios.post('https://newportal-backend.onrender.com/activity/log-activity', {
      userId,
      userModel,
      role: userModel.toLowerCase(), // 'realtor' or 'client'
      activityType,
      description,
      metadata
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

const Profile = () => {
  const [clientData, setClientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    passportPhoto: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria',
      zipCode: '',
    },
    nextOfKin: {
      name: '',
      relationship: '',
      email: '',
      phone: '',
    },
    employer: {
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    upline: {
      name: '',
      phone: '',
      email: '',
    },
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch client data from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('Clientuser'));
    if (data) {
      setClientData(data);
      setFormData(data);
    }
  }, []);

  // Handle input change for profile form
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle input change for password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.put(
        `https://newportal-backend.onrender.com/client/profile/${clientData._id}`, 
        formData
      );
      
      // Log the activity
      await logActivity(
        clientData._id,
        'client',
        'profile_update',
        'You updated your profile information',
        {
          updatedFields: Object.keys(formData).filter(
            key => formData[key] !== clientData[key]
          )
        }
      );
  
      setClientData(response.data);
      localStorage.setItem('Clientuser', JSON.stringify(response.data));
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'New password and confirm password do not match.',
      });
      setLoading(false);
      return;
    }
  
    try {
      await axios.put(
        `https://newportal-backend.onrender.com/client/password/${clientData._id}`, {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }
      );
  
      // Log the activity
      await logActivity(
        clientData._id,
        'client',
        'password_change',
        'You changed password',
        {}
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Password Updated!',
        text: 'Your password has been updated successfully.',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-8">
        <button
          className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-[#002657] text-[#002657]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('profile')}
        >
          <FiUser className="inline-block mr-2" />
          Profile Information
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'password' ? 'border-b-2 border-[#002657] text-[#002657]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('password')}
        >
          <FiLock className="inline-block mr-2" />
          Change Password
        </button>
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <button
              className="text-indigo-600 hover:text-indigo-800"
              onClick={() => setIsEditing(!isEditing)}
            >
              <FiEdit className="inline-block mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-left">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-left">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-left">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-left">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-left">Street</label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-left">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-left">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-left">Zip Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-[#002657] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Change Password</h2>

          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-left text-left">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-left">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-left">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-[#002657] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;