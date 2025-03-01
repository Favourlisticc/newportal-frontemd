import React, { useState, useEffect } from "react";
import axios from "axios";

const FundingHistoryPage = () => {
  const [fundingData, setFundingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch user ID from localStorage
  const storedRealtorData = localStorage.getItem("realtorData");
  const parsedData = storedRealtorData ? JSON.parse(storedRealtorData) : null;
  const userId = parsedData?._id;

  useEffect(() => {
    if (userId) {
      fetchFundingHistory();
    }
  }, [userId]);

  const fetchFundingHistory = async () => {
    try {
      const response = await axios.get(
        `https://newportal-backend.onrender.com/realtor/funding-history/${userId}`
      );
      setFundingData(response.data);
    } catch (error) {
      console.error("Error fetching funding history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search
  const filteredData = fundingData.filter(
    (item) =>
      item.amount.toString().toLowerCase().includes(search.toLowerCase()) ||
      item.paymentDate.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase())
  );

  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-600 bg-green-100 px-2 py-1 rounded";
      case "pending":
        return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded";
      case "rejected":
        return "text-red-600 bg-red-100 px-2 py-1 rounded";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg mt-10 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2 text-green-600">✈</span> Funding History
        </h1>

        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="text-gray-600 mr-2">Search:</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-1 focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-500"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 border border-gray-200">No</th>
                  <th className="p-3 border border-gray-200">Amount</th>
                  <th className="p-3 border border-gray-200">Date</th>
                  <th className="p-3 border border-gray-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="p-3 border border-gray-200">{index + 1}</td>
                      <td className="p-3 border border-gray-200">₦{item.amount}</td>
                      <td className="p-3 border border-gray-200">{item.paymentDate}</td>
                      <td className={`p-3 border border-gray-200 font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundingHistoryPage;
