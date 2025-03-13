import React, { useState, useEffect } from "react";
import axios from "axios";

const Transactionrealtor = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWithdrawals = async (status) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://newportal-backend.onrender.com/realtor/withdrawal-requests?status=${status}`
      );
      setWithdrawals(response.data);
    } catch (error) {
      console.log("Error fetching withdrawals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(activeTab);
  }, [activeTab]);

  const renderTable = () => (
    <div className="overflow-x-auto"> {/* Wrapper for horizontal scrolling */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-gray-600">No</th>
            <th className="px-4 py-2 text-left text-gray-600">Amount</th>
            <th className="px-4 py-2 text-left text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((item, index) => (
            <tr key={item._id} className="border-t">
              <td className="px-4 py-2 text-gray-700">{index + 1}</td>
              <td className="px-4 py-2 text-gray-700">{item.amount}</td>
              <td className="px-4 py-2 text-gray-700">
                {new Date(item.timestamp).toLocaleDateString()}
              </td>
              <td
                className={`px-4 py-2 ${
                  item.status === "pending"
                    ? "text-yellow-500"
                    : item.status === "approved"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Withdrawal History
      </h2>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="mb-4">
          {/* Buttons Stacked on Mobile, Horizontal on Larger Screens */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <button
              className={`px-4 py-2 rounded-lg focus:outline-none ${
                activeTab === "pending"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Withdrawals
            </button>
            <button
              className={`px-4 py-2 rounded-lg focus:outline-none ${
                activeTab === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => setActiveTab("approved")}
            >
              Approved Withdrawals
            </button>
            <button
              className={`px-4 py-2 rounded-lg focus:outline-none ${
                activeTab === "rejected"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => setActiveTab("rejected")}
            >
              Rejected Withdrawals
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading withdrawals...</p>
          </div>
        ) : withdrawals.length > 0 ? (
          renderTable()
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} withdrawals found
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactionrealtor;