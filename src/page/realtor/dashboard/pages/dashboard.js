import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaThumbsUp, FaCopy, FaFile, FaStar, FaMoneyBillWave, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReferralChart from '../component/chart';
import { motion, AnimatePresence } from 'framer-motion'; // For animations

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
  const testimonialsContainerRef = useRef(null);

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

  // Scroll testimonials left
  const scrollLeft = () => {
    if (testimonialsContainerRef.current) {
      testimonialsContainerRef.current.scrollBy({
        left: -300, // Adjust scroll distance
        behavior: 'smooth',
      });
    }
  };

  // Scroll testimonials right
  const scrollRight = () => {
    if (testimonialsContainerRef.current) {
      testimonialsContainerRef.current.scrollBy({
        left: 300, // Adjust scroll distance
        behavior: 'smooth',
      });
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
    <div className="flex-1 md:p-10 bg-gray-100">
      {/* Testimonials Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 relative">
        <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#002657] text-white p-2 rounded-full z-10"
          >
            <FaChevronLeft />
          </button>

          {/* Testimonials Container */}
          <div
            ref={testimonialsContainerRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 p-4"
          >
            <AnimatePresence>
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0 w-72 p-4 border border-gray-200 rounded-lg"
                >
                  <h3 className="font-semibold">{testimonial.title}</h3>
                  <p className="text-gray-700">{testimonial.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    - {testimonial.realtorName} ({testimonial.realtorEmail})
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#002657] text-white p-2 rounded-full z-10"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Balance */}
        <div className="bg-[#002657] p-6 rounded-lg shadow-md flex items-center">
          <FaMoneyBillWave className="text-white text-2xl mr-4" />
          <div>
            <p className="text-white font-semibold">Total Balance</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-lg">₦{formatNumber(dashboardData.earningAmount)}</p>
            )}
          </div>
        </div>

        {/* Funding */}
        <div className="bg-[#E5B305] p-6 rounded-lg shadow-md flex items-center">
          <FaThumbsUp className="text-white text-2xl mr-4" />
          <div>
            <p className="text-white font-semibold">Funding</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-lg">₦{formatNumber(dashboardData.funding)}</p>
            )}
          </div>
        </div>

        {/* Direct Commissions */}
        <div className="bg-[#002657] p-6 rounded-lg shadow-md flex items-center">
          <FaThumbsUp className="text-white text-2xl mr-4" />
          <div>
            <p className="text-white font-semibold">DIRECT COMMISSIONS</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-lg">₦{formatNumber(dashboardData.directCommissions)}</p>
            )}
          </div>
        </div>

        {/* Indirect Commissions */}
        <div className="bg-[#E5B305] p-6 rounded-lg shadow-md flex items-center">
          <FaStar className="text-white text-2xl mr-4" />
          <div>
            <p className="text-white font-semibold">INDIRECT COMMISSIONS</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-lg">₦{formatNumber(dashboardData.indirectCommissions)}</p>
            )}
          </div>
        </div>

        {/* Total Properties Sold */}
        <div className="bg-[#002657] p-6 rounded-lg shadow-md flex items-center">
          <FaUsers className="text-white text-2xl mr-4" />
          <div>
            <p className="text-white font-semibold">Total Properties Sold</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-lg">{formatNumber(dashboardData.unitsSold)}</p>
            )}
          </div>
        </div>

        {/* Total Referralled Realtor */}
        <div className="bg-[#E5B305] p-6 rounded-lg shadow-md flex items-center">
          <FaFile className="text-white text-2xl mr-4" />
          <div>
            <p className="text-white font-semibold">Total Referralled Realtor</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-lg">{formatNumber(dashboardData.realtorReferralsCount)}</p>
            )}
          </div>
        </div>

        {/* Total Referralled Client */}
        <div className="bg-[#002657] p-6 rounded-lg shadow-md flex items-center">
          <FaFile className="text-white text-2xl mr-4" />
          <div>
            <p className="text-white font-semibold">Total Referralled Client</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-lg">{formatNumber(dashboardData.clientReferralsCount)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Referral Chart */}
      <ReferralChart username={username} />

      {/* Referral Links and Upline Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Realtor Referral Link:</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={`https://baay-frontemd.onrender.com/realtor/registrationForm/${dashboardData.referralId}`}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
          />
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => copyToClipboard(`https://baay-frontemd.onrender.com/realtor/registrationForm/${dashboardData.referralId}`)}
          >
            <FaCopy />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Client Referral Link:</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={`https://baay-frontemd.onrender.com/realtor/registrationForm/${dashboardData.referralId}`}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
          />
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => copyToClipboard(`https://baay-frontemd.onrender.com/client/referralId/${dashboardData.referralId}`)}
          >
            <FaCopy />
          </button>
        </div>
      </div>

      {/* Upline Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upline Name:</h2>
        <p className="text-gray-700 mb-4">{dashboardData.uplineName}</p>
        <h2 className="text-xl font-semibold mb-4">Upline Phone Number:</h2>
        <p className="text-gray-700 mb-4">{dashboardData.uplinePhone}</p>
        <h2 className="text-xl font-semibold mb-4">Upline Email:</h2>
        <p className="text-gray-700">{dashboardData.uplineemail}</p>
      </div>

      {/* Support Contact */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-20">
        <h2 className="text-xl font-semibold mb-4">Support Contact Phone Number</h2>
        <p className="text-gray-700 mb-4">08071260398</p>
        <h2 className="text-xl font-semibold mb-4">Email Address</h2>
        <p className="text-gray-700 mb-4">clientrelations.baayprojects@gmail.com</p>
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