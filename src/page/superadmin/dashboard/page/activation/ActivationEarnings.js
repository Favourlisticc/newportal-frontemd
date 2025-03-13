import { useState, useEffect } from "react";
import { Edit, Trash, Loader, Save, X } from "lucide-react";

export default function ActivationEarnings() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCommission, setCurrentCommission] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(commission => 
      Object.values(commission).some(value => 
        value && value.toString().toLowerCase().includes(search.toLowerCase())
      ) ||
      commission.clientDetails?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      commission.clientDetails?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      commission.realtorantId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      commission.realtorantId?.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3005/admin/view-commissions');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (commission) => {
    setCurrentCommission(commission);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    setIsEditing(true);
    try {
      const response = await fetch(
        `https://newportal-backend.onrender.com/admin/edit-commissions/${currentCommission._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: currentCommission.amount,
            type: currentCommission.type,
          }),
        }
      );
      if (response.ok) {
        await fetchData();
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating commission:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this commission?')) {
      try {
        const response = await fetch(
          `https://newportal-backend.onrender.com/admin/delete-commissions/${id}`,
          { method: 'DELETE' }
        );
        if (response.ok) {
          await fetchData();
        }
      } catch (error) {
        console.error("Error deleting commission:", error);
      }
    }
  };

  const exportToExcel = () => {
    // Implementation would require xlsx library
    console.log("Export to Excel clicked");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Activation Earnings History</h2>
        
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="mb-2 sm:mb-0">
            <label className="text-gray-700 mr-2">Show</label>
            <select
              className="border p-2 rounded-lg"
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-64 border p-2 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Client</th>
                <th className="border p-2">Realtor</th>
                <th className="border p-2">Property</th>
                <th className="border p-2">Amount Paid</th>
                <th className="border p-2">Commission</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center p-4">
                    <Loader className="animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredData.slice(0, entries).map((commission, index) => (
                <tr key={commission._id} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    {commission.clientDetails?.firstName} {commission.clientDetails?.lastName}
                    <div className="text-sm text-gray-500">{commission.clientDetails?.email}</div>
                  </td>
                  <td className="border p-2">
                    {commission.realtorId?.firstName} {commission.realtorId?.lastName}
                    <div className="text-sm text-gray-500">{commission.realtorId?.email}</div>
                    <div className="text-sm text-gray-500">{commission.realtorId?.phone}</div>
                  </td>
                  <td className="border p-2">{commission.propertyDetails?.propertyName}</td>
                  <td className="border p-2">${commission.propertyDetails?.amountPaid}</td>
                  <td className="border p-2">${commission.amount}</td>
                  <td className="border p-2 capitalize">{commission.type}</td>
                  <td className="border p-2">
                    {new Date(commission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(commission)}
                      className="text-yellow-600 hover:text-yellow-700 mr-2"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(commission._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-4">
          <span>
            Showing {filteredData.length > 0 ? 1 : 0} to {Math.min(entries, filteredData.length)} of {filteredData.length} entries
          </span>
          <div className="space-x-2">
            <button
              className="bg-blue-900 text-white py-1 px-3 rounded-lg hover:bg-blue-800"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Commission</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Commission Amount</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded-lg"
                  value={currentCommission?.amount}
                  onChange={(e) => setCurrentCommission({
                    ...currentCommission,
                    amount: Number(e.target.value)
                  })}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Commission Type</label>
                <select
                  className="w-full border p-2 rounded-lg"
                  value={currentCommission?.type}
                  onChange={(e) => setCurrentCommission({
                    ...currentCommission,
                    type: e.target.value
                  })}
                >
                  <option value="direct">Direct</option>
                  <option value="indirect">Indirect</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isEditing}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
              >
                {isEditing ? <Loader className="animate-spin w-5 h-5" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}