import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const RejectedSalesHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchPendingPurchases();
  }, []);

  const fetchPendingPurchases = async () => {
    try {
      const response = await axios.get("http://localhost:3005/admin/purchases/rejected");
      setPurchases(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to fetch approved purchases");
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await axios.delete(`http://localhost:3005/admin/purchases/${id}`);
      toast.success("Purchase deleted successfully!");
      setPurchases(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      toast.error("Failed to delete purchase");
    }
    setActionLoading(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg p-6 max-w-6xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Rejected Sales History</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "No", "Client Name","Refferal By", "Property", "Amount", 
                  "Purchase Price", "Payment Method", "POP", 
                  "Date", "Actions"
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No Rejected purchases found
                  </td>
                </tr>
              ) : (
                purchases.map((purchase, index) => (
                  <tr key={purchase._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {purchase.ClientfirstName} {purchase.ClientlastName}
                      </div>
                      <div className="text-sm text-gray-500">{purchase.referralEmail}</div>
                      <div className="text-sm text-gray-500">{purchase.Clientphone}</div>
                      
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {purchase.referralName} 
                      </div>
                      <div className="text-sm text-gray-500">{purchase.referralEmail}</div>
                      <div className="text-sm text-gray-500">{purchase.referralPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{purchase.propertyName}</div>
      
                    </td>


                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{purchase.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{purchase.propertyActualPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {purchase.proofOfPayment ? (
                        <a
                          href={purchase.proofOfPayment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Proof
                        </a>
                      ) : (
                        <span className="text-gray-400">No proof</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleDelete(purchase._id)}
                        disabled={actionLoading[purchase._id]}
                        className={`px-3 py-1 rounded-md text-sm ${
                          actionLoading[purchase._id] === "delete"
                            ? "bg-gray-300"
                            : "bg-gray-600 hover:bg-gray-700 text-white"
                        }`}
                      >
                        {actionLoading[purchase._id] === "delete" ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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

export default RejectedSalesHistory;