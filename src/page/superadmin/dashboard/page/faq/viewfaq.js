// Updated ViewFAQ Component
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewFAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editLoading, setEditLoading] = useState(null);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchFAQs();
    fetchProperties();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data } = await axios.get("https://newportal-backend.onrender.com/admin/view/faq");
      setFaqs(data);
    } catch (err) {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data } = await axios.get("https://newportal-backend.onrender.com/admin/faq/properties");
      setProperties(data);
    } catch (err) {
      toast.error("Failed to fetch properties");
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await axios.delete(`https://newportal-backend.onrender.com/admin/afaq/${id}`);
      setFaqs(faqs.filter(faq => faq._id !== id));
      toast.success("FAQ deleted successfully");
    } catch (err) {
      toast.error("Failed to delete FAQ");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const { data } = await axios.put(
        `https://newportal-backend.onrender.com/admin/faq/${selectedFaq._id}`,
        selectedFaq
      );
      setFaqs(faqs.map(f => f._id === data._id ? data : f));
      toast.success("FAQ updated successfully");
      setSelectedFaq(null);
    } catch (err) {
      toast.error("Failed to update FAQ");
    } finally {
      setEditLoading(false);
    }
  };

  const sortedFaqs = [...faqs].sort((a, b) => {
    if (!sortColumn) return 0;
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredFaqs = sortedFaqs.filter(faq =>
    Object.values(faq).some(val =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-[#002657] mb-4">View FAQ</h2>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 p-2 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-[#002657] text-white">
              <tr>
                {["Question", "Answer", "Property", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 p-2 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    <FaSpinner className="animate-spin text-2xl text-[#002657] mx-auto" />
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{faq.question}</td>
                    <td className="border border-gray-300 p-2">{faq.answer}</td>
                    <td className="border border-gray-300 p-2">{faq.property}</td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="text-[#E5B30F] hover:text-[#c4990e]"
                          onClick={() => setSelectedFaq(faq)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(faq._id)}
                          disabled={deleteLoading === faq._id}
                        >
                          {deleteLoading === faq._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {selectedFaq && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <form onSubmit={handleUpdate} className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h3 className="text-xl font-bold text-[#002657] mb-4">Edit FAQ</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium">Property</label>
                  <select
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    value={selectedFaq.property}
                    onChange={(e) => setSelectedFaq({...selectedFaq, property: e.target.value})}
                  >
                    {properties.map((prop) => (
                      <option key={prop._id} value={prop.propertyName}>
                        {prop.propertyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Question</label>
                  <input
                    type="text"
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    value={selectedFaq.question}
                    onChange={(e) => setSelectedFaq({...selectedFaq, question: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Answer</label>
                  <textarea
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    rows="4"
                    value={selectedFaq.answer}
                    onChange={(e) => setSelectedFaq({...selectedFaq, answer: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setSelectedFaq(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#002657] text-white px-4 py-2 rounded flex items-center"
                  disabled={editLoading}
                >
                  {editLoading && <FaSpinner className="animate-spin mr-2" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFAQ;