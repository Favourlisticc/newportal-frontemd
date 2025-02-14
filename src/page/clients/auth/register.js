import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { Building2, Upload, Briefcase, MapPin, Gift, Heart, Image, Calendar,  User, Mail, Phone, Lock, CreditCard, Eye, EyeOff, HandCoins } from 'lucide-react';
import { useParams } from "react-router-dom";
import logo from "../../../public/Baay Realty logo (2).png";

const SignupForm = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { referralId } = useParams(); // Get the referral ID from URL
    const [referrerDetails, setReferrerDetails] = useState(null); // Store referrer details
    
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      passportPhoto: "",
      password: '',
      confirmPassword: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      nextOfKinName: '',
      nextOfKinRelationship: '',
      nextOfKinEmail: '',
      nextOfKinPhone: '',
      employerName: '',
      employerAddress: '',
      employerEmail: '',
      employerPhone: '',
      propertyId: '',
      paymentMethod: '',
      amount: '',
      referralCode: referralId,
      proofOfPayment: "",
      termsAccepted: false,
    });
    
    useEffect(() => {
      fetchProperties();
      if (referralId) {
        fetchReferrerDetails(referralId);
        console.log(referralId)
      }
    }, [referralId]);
    
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://newportal-backend.onrender.com/client/properties');
        setProperties(response.data);
        console.log(properties)
      } catch (error) {
        toast.error('Failed to fetch properties');
      }
    };
    
    const fetchReferrerDetails = async (referralId) => {
      try {
        const response = await axios.get(`https://newportal-backend.onrender.com/client/validate-referral/${referralId}`);
        setReferrerDetails(response.data); // Store referrer details
      } catch (error) {
        toast.error('Invalid referral code');
        setReferrerDetails(null);
      }
    };
    
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
    
    const handleFileChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    };
    
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
    
    const validateForm = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;
    
      if (!formData.firstName || !formData.lastName) {
        toast.error('First and Last name are required');
        return false;
      }
      if (!emailRegex.test(formData.email)) {
        toast.error('Invalid email format');
        return false;
      }
      if (!phoneRegex.test(formData.phone)) {
        toast.error('Phone number must be 10 digits');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
      if (!formData.termsAccepted) {
        toast.error('You must accept the terms and conditions');
        return false;
      }
      if (!formData.dateOfBirth) {
        toast.error('Date of Birth is required');
        return false;
      }
      if (!formData.gender) {
        toast.error('Gender is required');
        return false;
      }
      if (!formData.country) {
        toast.error('Country is required');
        return false;
      }
      if (!formData.nextOfKinName || !formData.nextOfKinRelationship || !formData.nextOfKinEmail || !formData.nextOfKinPhone) {
        toast.error('Next of Kin Details are required');
        return false;
      }
      if (!formData.employerName || !formData.employerAddress || !formData.employerEmail || !formData.employerPhone) {
        toast.error('Employer Details are required');
        return false;
      }
      if (!formData.paymentMethod || !formData.amount) {
        toast.error('Property Details are required');
        return false;
      }
      if (!formData.passportPhoto) {
        toast.error('Passport Photo is required');
        return false;
      }
      return true;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

      
        setLoading(true);

        
        try {

            const selectedProperty = properties.find(p => p._id === formData.propertyId);
    
            if (!selectedProperty) {
              toast.error('Selected property not found');
              return;
            }
          // Upload passportPhoto to Cloudinary
          const passportPhotoData = new FormData();
          passportPhotoData.append('file', formData.passportPhoto);
          passportPhotoData.append('upload_preset', 'giweexpv');
          const passportPhotoResponse = await axios.post(
            'https://api.cloudinary.com/v1_1/dwpoik1jm/image/upload',
            passportPhotoData
          );
      
          // Upload proofOfPayment to Cloudinary
          const proofOfPaymentData = new FormData();
          proofOfPaymentData.append('file', formData.proofOfPayment);
          proofOfPaymentData.append('upload_preset', 'giweexpv');
          const proofOfPaymentResponse = await axios.post(
            'https://api.cloudinary.com/v1_1/dwpoik1jm/image/upload',
            proofOfPaymentData
          );

          
      
          // Prepare user data with uploaded file URLs
          const userData = {
            ...formData,
            passportPhoto: passportPhotoResponse.data.secure_url,
            proofOfPayment: proofOfPaymentResponse.data.secure_url,
            propertyName: selectedProperty.propertyName, // Add property name
            propertyActualPrice: selectedProperty.amount,      // Add property amount
          };

          console.log(userData)


      
          // Send data to the backend
          const response = await axios.post('https://newportal-backend.onrender.com/client/signup', userData);

            // Handle backend response (res.status(201).json({ token, user, purchase }))
            const { token, user } = response.data;

            // Store token in localStorage or state management
            localStorage.setItem('Clienttoken', token);
            localStorage.setItem('Clientuser', JSON.stringify(user));
      
          const property = properties.find((p) => p._id === formData.propertyId);

          console.log(property)
          Swal.fire({
            title: 'Registration Successful!',
            html: `
              Your registration and payment uplaod for ${selectedProperty.propertyName} was successful.<br>
              <span style="color: #E5B305">Check your email for confirmation.</span>
            `,
            icon: 'success',
            confirmButtonColor: '#002657',
          });
      
          navigate('/client-dashboard');
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || error.message || 'Registration failed. Please try again.';
          toast.error(errorMessage);
          console.error('Registration error:', error.response?.data || error);
        } finally {
          setLoading(false);
        }
      };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
         <div className='flex justify-center mb-9 items-center'>
       <img src={logo} className='w-32 h-32' /> 
       </div>
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
     
      <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#002657' }}>
        Complete your payment proof upload and creation your account
      </h2>
  
      <form onSubmit={handleSubmit} className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Personal Info</h3>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Mail className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Calendar className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>


          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              ZipCode
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>

          
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Image className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Passport Photo
            </label>
            <input
              type="file"
              name="passportPhoto"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#002657] file:text-white
                hover:file:bg-[#E5B305]"
            />
          </div>
        </div>
  
        {/* Next of Kin Details Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Next of Kin Details</h3>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Full Name
            </label>
            <input
              type="text"
              name="nextOfKinName"
              value={formData.nextOfKinName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Heart className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Relationship
            </label>
            <input
              type="text"
              name="nextOfKinRelationship"
              value={formData.nextOfKinRelationship}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Mail className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Email
            </label>
            <input
              type="email"
              name="nextOfKinEmail"
              value={formData.nextOfKinEmail}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Phone
            </label>
            <input
              type="tel"
              name="nextOfKinPhone"
              value={formData.nextOfKinPhone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
        </div>
  
        {/* Employment Details Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Employment Details</h3>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Briefcase className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Employer Name
            </label>
            <input
              type="text"
              name="employerName"
              value={formData.employerName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Employer Address
            </label>
            <input
              type="text"
              name="employerAddress"
              value={formData.employerAddress}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Mail className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Employer Email
            </label>
            <input
              type="email"
              name="employerEmail"
              value={formData.employerEmail}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Employer Phone
            </label>
            <input
              type="tel"
              name="employerPhone"
              value={formData.employerPhone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
        </div>
  
        {/* Referral Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Referral</h3>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Gift className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Referral Code
            </label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
          </div>
  
          {referrerDetails && (
            <p className="text-gray-700">Referred by: {referrerDetails.firstName} {referrerDetails.lastName}</p>
          )}
        </div>
  
        {/* Account & Property Payment Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Account & Property Payment</h3>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Building2 className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Select Property
            </label>
            <select
              name="propertyId"
              value={formData.propertyId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            >
              <option value="">Select a property</option>
              {properties.map(property => (
                <option key={property._id} value={property._id}>
                  {property.propertyName} - ₦{property.amount}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <CreditCard className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            >
              <option value="">Select payment method</option>
              <option value="full">Full Payment</option>
              <option value="installment">Installment</option>
            </select>
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Upload className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Proof of Payment
            </label>
            <input
              type="file"
              name="proofOfPayment"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#002657] file:text-white
                hover:file:bg-[#E5B305]"
            />
          </div>
  
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <HandCoins className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Amount
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2"
            />
          </div>
  
          <div className="flex items-center">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="h-4 w-4 text-[#002657] focus:ring-[#E5B305] border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              I accept the terms and conditions
            </label>
          </div>
        </div>
  
        {/* Password Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Password Section</h3>
  
          <div className="relative">
            <label className="flex items-center text-sm font-medium mb-2">
              <Lock className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 pt-8 flex items-center"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
  
          <div className="relative">
            <label className="flex items-center text-sm font-medium mb-2">
              <Lock className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 pt-8 flex items-center"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-full w-full py-3 px-4 rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#002657' }}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Processing...
            </span>
          ) : (
            'Sign Up & Purchase Property'
          )}
        </button>
      </form>
    </div>
    <ToastContainer position="top-right" />
  </div>
  );
};

export default SignupForm;