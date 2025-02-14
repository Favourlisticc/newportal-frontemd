import React, { useState, useEffect } from 'react';
import { FaUsers, FaThumbsUp, FaCopy, FaFile, FaStar, FaMoneyBillWave, FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReferralChart from '../component/chart';

const ConsultDashboard = () => {
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
    consultReferralsCount: 0,
    clientReferralsCount: 0,
  });
  const [loading, setLoading] = useState(true); // Add loading state

  // Replace this with actual username (from localStorage, context, or props)
  const storedConsultData = localStorage.getItem('consultData');
  const parsedData = JSON.parse(storedConsultData);
  const username = parsedData.username; // Ensure this key matches what’s stored in localStorage

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`https://newportal-backend.onrender.com/consult/dashboard/${username}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.log('Error fetching dashboard data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDashboardData();
  }, [username]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy!');
    }
  };

  // Function to format numbers with commas
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  return (
    <div className="flex-1 p-4 md:p-10 bg-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Dashboard</h1>

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

        {/* Total Referralled Consultant */}
        <div className="bg-[#E5B305] p-6 rounded-lg shadow-md flex items-center">
          <FaFile className="text-white text-2xl mr-4" />
          <div>
            <p className="text-white font-semibold">Total Referralled Consultant</p>
            {loading ? (
              <FaSpinner className="text-white animate-spin" />
            ) : (
              <p className="text-white text-lg">{formatNumber(dashboardData.consultReferralsCount)}</p>
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

      <ReferralChart username={username} />

      {/* Referral Links and Upline Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Consultant Referral Link:</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={`https://baay-frontemd.onrender.com/consult/registrationForm/${dashboardData.referralId}`}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
          />
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => copyToClipboard(`hhttps://baay-frontemd.onrender.com/consult/registrationForm/${dashboardData.referralId}`)}
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
            value={`https://baay-frontemd.onrender.com/client/signin/${dashboardData.referralId}`}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
          />
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => copyToClipboard(`https://baay-frontemd.onrender.com/client/signin/${dashboardData.referralId}`)}
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

export default ConsultDashboard;