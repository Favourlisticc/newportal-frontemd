import React, { useState } from "react";

const Withdraw = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const pendingWithdrawals = [
    { id: 1, amount: "₦2,300", date: "2025-01-22", status: "Pending" },
    { id: 2, amount: "₦1,000", date: "2025-01-22", status: "Pending" },
    { id: 3, amount: "₦3,000", date: "2025-01-22", status: "Pending" },
    { id: 4, amount: "₦3,000", date: "2025-01-22", status: "Pending" },
    { id: 5, amount: "₦2,000", date: "2025-01-22", status: "Pending" },
  ];

  const approvedWithdrawals = [
    { id: 1, amount: "₦5,000", date: "2025-01-20", status: "Approved" },
    { id: 2, amount: "₦10,000", date: "2025-01-19", status: "Approved" },
  ];

  const renderTable = (data) => (
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
        {data.map((item, index) => (
          <tr key={item.id} className="border-t">
            <td className="px-4 py-2 text-gray-700">{index + 1}</td>
            <td className="px-4 py-2 text-gray-700">{item.amount}</td>
            <td className="px-4 py-2 text-gray-700">{item.date}</td>
            <td className="px-4 py-2 text-green-500">{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Withdrawal History</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <div className="flex space-x-4">
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
          </div>
        </div>
        {activeTab === "pending"
          ? renderTable(pendingWithdrawals)
          : renderTable(approvedWithdrawals)}
      </div>
    </div>
  );
};

export default Withdraw;
