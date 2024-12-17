import React, { useState, useEffect } from 'react';
import { FaUsers, FaThumbsUp, FaCopy, FaFile, FaStar, FaMoneyBillWave } from 'react-icons/fa';

const ConsultDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        unitsSold: 0,
        directCommissions: 0,
        downlines: 0,
        indirectCommissions: 0,
        earningAmount: 500000,
        uplineName: "",
        uplinePhone: "",

      });

      useEffect(() => {
        // Fetch dashboard data from your backend API
        const fetchDashboardData = async () => {
          try {
            const response = await fetch('YOUR_BACKEND_API_ENDPOINT'); // Replace with your API endpoint
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDashboardData(data);
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Handle error, e.g., display an error message
          }
        };
    
        fetchDashboardData();
      }, []);
    
      const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Optionally show a success message to the user
      };


  return (
    <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-teal-500 p-6 rounded-lg shadow-md flex items-center">
                <FaUsers className="text-white text-2xl mr-4" />
                <div>
                    <p className="text-white font-semibold">UNITS SOLD DIRECT</p>
                    <p className="text-white text-lg">{dashboardData.unitsSold}</p>
                </div>
            </div>
            <div className="bg-teal-500 p-6 rounded-lg shadow-md flex items-center">
                <FaThumbsUp className="text-white text-2xl mr-4" />
                <div>
                    <p className="text-white font-semibold">DIRECT COMMISSIONS</p>
                    <p className="text-white text-lg">₦{dashboardData.directCommissions}</p>
                </div>
            </div>
            <div className="bg-yellow-500 p-6 rounded-lg shadow-md flex items-center">
                <FaFile className="text-white text-2xl mr-4" />
                <div>
                    <p className="text-white font-semibold">DOWNLINES</p>
                    <p className="text-white text-lg">{dashboardData.downlines}</p>
                </div>
            </div>
             <div className="bg-red-500 p-6 rounded-lg shadow-md flex items-center">
                <FaStar className="text-white text-2xl mr-4" />
                <div>
                    <p className="text-white font-semibold">INDIRECT COMMISSIONS</p>
                    <p className="text-white text-lg">₦{dashboardData.indirectCommissions}</p>
                </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center col-span-2 md:col-span-1 lg:col-span-1">
                <FaMoneyBillWave className="text-white text-2xl mr-4" />
                <div>
                    <p className="text-white font-semibold">EARNING AMOUNT</p>
                    <p className="text-white text-lg">₦{dashboardData.earningAmount}</p>
                </div>
            </div>
        </div>


        {/* Referral Links and Upline Information */}
        {/* ... (rest of the component code for referral links and upline info) ... */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Consultant Referral Link:</h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value="https://xixira.com/sites/wetfront/129a0a"
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg mr-2"
            />
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
              onClick={() => copyToClipboard("https://xixira.com/sites/wetfront/129a0a")}
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
              value="https://xixira.com/sites/wetfront/office/regclient.php?cid=129a0a"
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg mr-2"
            />
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg"
              onClick={() =>
                copyToClipboard(
                  "https://xixira.com/sites/wetfront/office/regclient.php?cid=129a0a"
                )
              }
            >
              <FaCopy />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upline Name:</h2>
          <p className="text-gray-700 mb-4">{dashboardData.uplineName}</p> {/* Display uplineName from state */}
          <h2 className="text-xl font-semibold mb-4">Upline Phone Number:</h2>
          <p className="text-gray-700">{dashboardData.uplinePhone}</p> {/* Display uplinePhone from state */}
        </div>

    </div>
  );
};

export default ConsultDashboard;