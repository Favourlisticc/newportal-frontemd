import React, { useState } from 'react';
import { FaBirthdayCake, FaMapMarkerAlt, FaUser, FaIdCard, FaBuilding, FaPhone, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';
import { CiBank } from 'react-icons/ci';
import axios from 'axios';

const RegisterFormPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    referrer: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    celebrateBirthday: false,
    gender: '',
    address: '',
    country: '',
    state: '',
    accountName: '',
    accountNumber: '',
    bank: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading button

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (formData.gender === '') newErrors.gender = 'Gender is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.accountName) newErrors.accountName = 'Account name is required';
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    if (!formData.bank) newErrors.bank = 'Bank is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';

    // Password matching validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true); // Set loading to true when submitting
        const response = await axios.post('http://localhost:3005/auth/register', formData); // Adjust the endpoint URL based on your backend
        if (response.status === 201) {
          setSuccess(true);
          setTimeout(() => {
            window.location.href = '/consult-dashboard'; // Adjust the redirection URL based on your app's structure
          }, 3000);
        }
      } catch (error) {
        console.error('Registration error:', error);
      }finally {
        setLoading(false); // Set loading to false after request completes, regardless of success/failure
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12">
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Register</h2>
      </div>
      <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300 text-left">
        {success ? (
          <div className="text-center">
            <img src="/success.png" alt="Success" className="mx-auto h-32 w-32" />
            <p className="text-green-500 mt-4">Registration successful! Redirecting to dashboard...</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="flex items-center mt-1">
                <FaUser className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className={`block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

           
            {/* Referrer Field (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Referrer (Optional)</label>
              <div className="flex items-center mt-1">
                <FaUser className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="referrer"
                  value={formData.referrer}
                  onChange={handleInputChange}
                  placeholder="Referrer"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>

            {/* First Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="flex items-center mt-1">
                <FaUser className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className={`block w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>

            {/* Last Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="flex items-center mt-1">
                <FaUser className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className={`block w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <div className="flex items-center mt-1">
                <FaPhone className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className={`block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center mt-1">
                <FaEnvelope className="mr-2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Date of Birth Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="flex items-center mt-1">
                <FaBirthdayCake className="mr-2 text-gray-400" />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <div className="flex items-center mt-1">
                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className={`block w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            {/* Country Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <div className="flex items-center mt-1">
                <FaBuilding className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className={`block w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
            </div>

            {/* State Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <div className="flex items-center mt-1">
                <FaBuilding className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className={`block w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>

            {/* Account Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <div className="flex items-center mt-1">
                <FaUser className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="Account Name"
                  className={`block w-full px-3 py-2 border ${errors.accountName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.accountName && <p className="text-red-500 text-sm">{errors.accountName}</p>}
            </div>

            {/* Account Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <div className="flex items-center mt-1">
                <FaIdCard className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Account Number"
                  className={`block w-full px-3 py-2 border ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
            </div>

            {/* Bank Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank</label>
              <div className="flex items-center mt-1">
                <CiBank className="mr-2 text-gray-400" />
                <input
                  type="text"
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                  placeholder="Bank"
                  className={`block w-full px-3 py-2 border ${errors.bank ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.bank && <p className="text-red-500 text-sm">{errors.bank}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center mt-1">
                <FaLock className="mr-2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="flex items-center mt-1">
                <FaKey className="mr-2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={`block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Registering...' : 'Register'} {/* Conditional button text */}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterFormPage;