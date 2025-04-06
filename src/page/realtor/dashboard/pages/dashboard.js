import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaThumbsUp, FaCopy, FaFile, FaStar, FaMoneyBillWave, FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReferralChart from '../component/chart';
import { motion, AnimatePresence } from 'framer-motion';

const RealtorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    unitsSold: 0,
    directCommissions: 0,
    downlines: 0,
    indirectCommissions: 0,
    earningAmount: 0,
    funding: 0,
    uplineName: "",
    uplinePhone: "",
    uplineemail: "",
    realtorReferralsCount: 0,
    clientReferralsCount: 0,
    referrerIdNumber: ""
  });
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [startX, setStartX] = useState(null); // For touch swipe functionality

  // Replace this with actual username (from localStorage, context, or props)
  const storedRealtorData = localStorage.getItem('realtorData');
  const parsedData = JSON.parse(storedRealtorData);
  const username = parsedData.username;

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`https://newportal-backend.onrender.com/realtor/dashboard/${username}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.log('Error fetching dashboard data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [username]);

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoadingTestimonials(true);
      try {
        const response = await fetch(`https://newportal-backend.onrender.com/realtor/testimonials`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTestimonials(data.testimonials);
      } catch (error) {
        console.log('Error fetching testimonials:', error);
        toast.error('Failed to fetch testimonials');
      } finally {
        setIsLoadingTestimonials(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide testimonials every 5 seconds
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex((prevIndex) =>
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  // Touch swipe functionality for mobile
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null) return;

    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (diff > 50) {
      // Swipe left
      setCurrentTestimonialIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setStartX(null);
    } else if (diff < -50) {
      // Swipe right
      setCurrentTestimonialIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setStartX(null);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy!');
    }
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  return (
    <div className="flex-1 md:p-10 bg-gray-100 overflow-x-hidden m-5">
      {/* Testimonials Section */}
      <div className="bg-white p-3 md:p-6 rounded-lg shadow-md mb-6 md:mb-8 relative">
        <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
        <div className="relative">
          {/* Loading State for Testimonials */}
          {isLoadingTestimonials ? (
            <div className="flex justify-center items-center h-32">
              <FaSpinner className="animate-spin text-2xl text-[#002657]" />
            </div>
          ) : testimonials.length > 0 ? (
            <div
              className="w-full overflow-hidden px-8"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {/* Mobile and Desktop View (Single Card) */}
              <AnimatePresence>
                <motion.div
                  key={testimonials[currentTestimonialIndex]._id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full p-4 border border-gray-200 rounded-lg"
                >
                  <h3 className="font-semibold">{testimonials[currentTestimonialIndex].title}</h3>
                  <p className="text-gray-700">{testimonials[currentTestimonialIndex].content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {testimonials[currentTestimonialIndex].realtorName}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-center text-gray-500">No testimonials available.</p>
          )}
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center mt-4">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 mx-1 rounded-full ${
                currentTestimonialIndex === index ? 'bg-[#002657]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        {/* Funding */}
        <div className="bg-[#E5B305] p-4 md:p-6 rounded-lg shadow-md flex items-center">
          <FaThumbsUp className="text-white text-xl md:text-2xl mr-3 md:mr-4" />
          <div className='text-left'>
            <p className="text-white font-semibold text-sm md:text-base text-left">Funding</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-base md:text-lg">₦{formatNumber(dashboardData.funding)}</p>
            )}
          </div>
        </div>
        
        {/* Total Balance */}
        <div className="bg-[#002657] p-4 md:p-6 rounded-lg shadow-md flex items-center">
          <FaMoneyBillWave className="text-white text-xl md:text-2xl mr-3 md:mr-4" />
          <div className='text-left'>
            <p className="text-white font-semibold text-sm md:text-base text-left">Total Balance</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-base md:text-lg">₦{formatNumber(dashboardData.earningAmount)}</p>
            )}
          </div>
        </div>

        {/* Direct Commissions */}
        <div className="bg-[#002657] p-4 md:p-6 rounded-lg shadow-md flex items-center">
          <FaThumbsUp className="text-white text-xl md:text-2xl mr-3 md:mr-4" />
          <div className='text-left'>
            <p className="text-white font-semibold text-sm md:text-base">DIRECT COMMISSIONS</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-base md:text-lg">₦{formatNumber(dashboardData.directCommissions)}</p>
            )}
          </div>
        </div>

        {/* Indirect Commissions */}
        <div className="bg-[#E5B305] p-4 md:p-6 rounded-lg shadow-md flex items-center">
          <FaStar className="text-white text-xl md:text-2xl mr-3 md:mr-4" />
          <div className='text-left'>
            <p className="text-white font-semibold text-sm md:text-base">INDIRECT COMMISSIONS</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-base md:text-lg">₦{formatNumber(dashboardData.indirectCommissions)}</p>
            )}
          </div>
        </div>

        {/* Total Properties Sold */}
        <div className="bg-[#002657] p-4 md:p-6 rounded-lg shadow-md flex items-center">
          <FaUsers className="text-white text-xl md:text-2xl mr-3 md:mr-4" />
          <div className='text-left'>
            <p className="text-white font-semibold text-sm md:text-base">Total Properties Sold</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-base md:text-lg">{formatNumber(dashboardData.unitsSold)}</p>
            )}
          </div>
        </div>

        {/* Total Referralled Realtor */}
        <div className="bg-[#E5B305] p-4 md:p-6 rounded-lg shadow-md flex items-center">
          <FaFile className="text-white text-xl md:text-2xl mr-3 md:mr-4" />
          <div className='text-left'>
            <p className="text-white font-semibold text-sm md:text-base">Total Referralled Realtor</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-base md:text-lg">{formatNumber(dashboardData.realtorReferralsCount)}</p>
            )}
          </div>
        </div>

        {/* Total Referralled Client */}
        <div className="bg-[#002657] p-4 md:p-6 rounded-lg shadow-md flex items-center">
          <FaFile className="text-white text-xl md:text-2xl mr-3 md:mr-4" />
          <div className='text-left'>
            <p className="text-white font-semibold text-sm md:text-base">Total Referralled Client</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-base md:text-lg">{formatNumber(dashboardData.clientReferralsCount)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Referral Chart
      <div className="w-full overflow-x-auto">
        <div className="min-w-full md:w-auto">
          <ReferralChart username={username} />
        </div>
      </div> */}

      {/* Referral Links and Upline Details */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md my-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Realtor Referral Link:</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={`https://baay-frontemd.onrender.com/realtor/registrationForm/${dashboardData.referralId}`}
            readOnly
            className="w-full p-2 text-sm md:text-base border border-gray-300 rounded-lg mr-2"
          />
          <button
            className="bg-green-500 text-white py-2 px-3 md:px-4 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => copyToClipboard(`https://baay-frontemd.onrender.com/realtor/registrationForm/${dashboardData.referralId}`)}
          >
            <FaCopy />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Client Referral Link:</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={`https://baay-frontemd.onrender.com/client/signin/${dashboardData.referralId}`}
            readOnly
            className="w-full p-2 text-sm md:text-base border border-gray-300 rounded-lg mr-2"
          />
          <button
            className="bg-green-500 text-white py-2 px-3 md:px-4 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => copyToClipboard(`https://baay-frontemd.onrender.com/client/signin/${dashboardData.referralId}`)}
          >
            <FaCopy />
          </button>
        </div>
      </div>

      {/* Upline Details */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Upline Name:</h2>
        <p className="text-gray-700 mb-4">{dashboardData.uplineName}</p>
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Upline Phone Number:</h2>
        <p className="text-gray-700 mb-4">{dashboardData.uplinePhone}</p>
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Upline Email:</h2>
        <p className="text-gray-700">{dashboardData.uplineemail}</p>
      </div>

      {/* Support Contact */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mt-6 md:mt-20">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Support Contact Phone Number</h2>
        <p className="text-gray-700 mb-4"> +2348113875325</p>
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Email Address</h2>
        <p className="text-gray-700 mb-4">realtorrelarions@baayrealty.com</p>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
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

export default RealtorDashboard;