import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ActivationCommission = () => {
  const [commissions, setCommissions] = useState({
    IndirectCommission: "",
    DirectCommission: "",
  });
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get("http://localhost:3005/admin/commissions");
      console.log("API Response:", response.data); // Debugging
      setTableData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Failed to fetch commissions");
      setTableData([]); // Ensure it's an array
    } finally {
      setTableLoading(false);
    }
  };

  const handleChange = (e) => {
    setCommissions({ ...commissions, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3005/admin/commissions", {
        ...commissions,
        timestamp: new Date().toISOString(),
      });
      toast.success("Commissions updated successfully");
      setCommissions({ first: "", second: "" });
      fetchCommissions();
    } catch (error) {
      toast.error("Failed to update commissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Activation Commission</h2>
        <form onSubmit={handleSubmit}>
          {[
            "Indirect Commission(%)",
            "Direct Commission(%)",
          ].map((label, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700 font-medium mb-2">{label}</label>
              <input
                type="number"
                name={Object.keys(commissions)[index]}
                value={Object.values(commissions)[index]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Update"
            )}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Current Commissions</h3>
          {tableLoading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-8 w-8 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-300">Indirect Commission(%)</th>
                  <th className="p-2 border border-gray-300">Direct Commission(%)</th>
                  <th className="p-2 border border-gray-300">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index} className="bg-white">
                    <td className="p-2 border border-gray-300">{data.IndirectCommission}</td>
                    <td className="p-2 border border-gray-300">{data.DirectCommission}</td>
                    <td className="p-2 border border-gray-300">
                      {new Date(data.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivationCommission;