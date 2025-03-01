import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

const AddFAQ = () => {
  const [property, setProperty] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProperties, setFetchingProperties] = useState(true);

  // Fetch properties for dropdown
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await axios.get("http://localhost:3005/admin/faq/properties");
        setProperties(data);
      } catch (err) {
        toast.error("Failed to fetch properties");
      } finally {
        setFetchingProperties(false);
      }
    };
    fetchProperties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:3005/admin/faq", {
        property,
        question,
        answer,
      });
      toast.success("FAQ added successfully!");
      setQuestion("");
      setAnswer("");
      setProperty("");
    } catch (err) {
      toast.error("Failed to add FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-[#002657] mb-4">Add FAQ</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Dropdown */}
          <div>
            <label className="block text-gray-600 font-medium">Select Property</label>
            <select
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002657]"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a property
              </option>
              {fetchingProperties ? (
                <option disabled>Loading properties...</option>
              ) : (
                properties.map((prop) => (
                  <option key={prop._id} value={prop.propertyName}>
                    {prop.propertyName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Question Input */}
          <div>
            <label className="block text-gray-600 font-medium">Question</label>
            <input
              type="text"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002657]"
              placeholder="Enter Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          {/* Answer Textarea */}
          <div>
            <label className="block text-gray-600 font-medium">Answer</label>
            <textarea
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002657]"
              rows="4"
              placeholder="Type The Answer Here...."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#002657] text-white py-2 rounded-md hover:bg-[#001a3d] transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              "Add FAQ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFAQ;