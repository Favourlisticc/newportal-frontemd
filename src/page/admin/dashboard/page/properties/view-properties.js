import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaEdit, FaTrash, FaInfoCircle, FaSpinner, FaImage } from "react-icons/fa";

const PropertyList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyName: "",
    amount: "",
    state: "",
    city: "",
    propertyType: "",
    propertyStatus: "",
    bedrooms: "",
    bathrooms: "",
    landSize: "",
    description: "",
    featuredImage: "",
    galleryImages: [],
    subscriptionForm: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await axios.get("http://localhost:3005/admin/properties", {
        params: { category, search },
      });
      setProperties(data);
    } catch (err) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
  };

  const handleEdit = (property) => {
    setFormData(property);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:3005/admin/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success("Property deleted successfully");
    } catch (err) {
      toast.error("Failed to delete property");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const { data } = await axios.put(
        `http://localhost:3005/admin/properties/${formData._id}`,
        formData
      );
      setProperties(properties.map((p) => (p._id === data._id ? data : p)));
      setEditModalOpen(false);
      toast.success("Property updated successfully");
    } catch (err) {
      toast.error("Failed to update property");
    } finally {
      setEditLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#002657]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold flex items-center mb-4 text-[#002657]">
        <span className="mr-2">🏠</span> View Properties
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <select
          className="border p-2 rounded md:w-1/3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ borderColor: "#002657" }}
        >
          <option value="All">All Categories</option>
          <option value="Land">Land</option>
          <option value="Terranova Urban Estate">Terranova Urban Estate</option>
        </select>
        <input
          type="text"
          placeholder="Search for Property"
          className="border p-2 rounded flex-grow"
          style={{ borderColor: "#002657" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-[#002657] text-white px-4 py-2 rounded hover:bg-[#001a3d] flex items-center justify-center"
          onClick={fetchProperties}
        >
          Search
        </button>
      </div>

      {/* Property Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="border p-4 rounded-lg shadow-md">
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              {property.featuredImage ? (
                <img
                  src={property.featuredImage}
                  alt={property.propertyName}
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <FaImage className="text-4xl text-gray-500" />
              )}
            </div>
            <h2 className="text-lg font-semibold mt-4 text-[#002657]">
              {property.propertyName}
            </h2>
            <p className="text-gray-600">{property.propertyType}</p>
            <p className="text-black font-semibold mt-2">
              ₦{property.amount.toLocaleString()}
            </p>

            <div className="mt-4 space-y-2">
              <button
                className="w-full py-2 rounded flex items-center justify-center bg-[#E5B30F] text-white hover:bg-[#c4990e]"
                onClick={() => handleViewDetails(property)}
              >
                <FaInfoCircle className="mr-2" /> View Details
              </button>
              <button
                className="w-full py-2 rounded flex items-center justify-center bg-[#002657] text-white hover:bg-[#001a3d]"
                onClick={() => handleEdit(property)}
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button
                className="w-full py-2 rounded flex items-center justify-center bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(property._id)}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaTrash className="mr-2" />
                )}
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#002657] mb-4">
              {selectedProperty.propertyName}
            </h2>
            <div className="space-y-4">
              <p><strong>Amount:</strong> ₦{selectedProperty.amount.toLocaleString()}</p>
              <p><strong>State:</strong> {selectedProperty.state}</p>
              <p><strong>City:</strong> {selectedProperty.city}</p>
              <p><strong>Property Type:</strong> {selectedProperty.propertyType}</p>
              <p><strong>Property Status:</strong> {selectedProperty.propertyStatus}</p>
              <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
              <p><strong>Land Size:</strong> {selectedProperty.landSize} sqm</p>
              <p><strong>Description:</strong> {selectedProperty.description}</p>
              <p><strong>Commission</strong> {selectedProperty.commission}</p>
              <p><strong>IndirectCommission:</strong> {selectedProperty.indirectcommission}</p>
              <div>
                <strong>Featured Image:</strong>
                <img
                  src={selectedProperty.featuredImage}
                  alt="Featured"
                  className="w-full h-48 object-cover mt-2 rounded-lg"
                />
              </div>
              <div>
                <strong>Gallery Images:</strong>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {selectedProperty.galleryImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              className="mt-4 bg-[#E5B30F] text-white px-4 py-2 rounded"
              onClick={() => setSelectedProperty(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-[#002657] mb-4">Edit Property</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Property Name</label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <label>Property Type</label>
                <input
                  type="text"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <label>Property Status</label>
                <input
                  type="text"
                  name="propertyStatus"
                  value={formData.propertyStatus}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <label>Land Size (sqm)</label>
                <input
                  type="number"
                  name="landSize"
                  value={formData.landSize}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  rows="4"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 border rounded"
                onClick={() => setEditModalOpen(false)}
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
  );
};

export default PropertyList;