import React, { useState, useEffect } from "react";
import axios from "axios";

const logActivity = async (userId, userModel, activityType, description, metadata = {}) => {
  try {
    await axios.post('https://newportal-backend.onrender.com/activity/log-activity', {
      userId,
      userModel,
      role: userModel.toLowerCase(), // 'realtor' or 'client'
      activityType,
      description,
      metadata
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

const App = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Fetch properties from the backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("https://newportal-backend.onrender.com/realtor/properties"); // Replace with your backend API endpoint
        setProperties(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search query
  const filteredProperties = properties.filter((property) =>
    property.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add this to the handleViewDetails function
const handleViewDetails = (property) => {
  const realtorData = JSON.parse(localStorage.getItem("realtorData"));
  
  // Log the activity
  logActivity(
    realtorData._id,
    'Realtor',
    'property_view',
    'Realtor viewed property details',
    {
      propertyId: property._id,
      propertyName: property.propertyName
    }
  );

  setSelectedProperty(property);
};

  // Close the details modal
  const handleCloseDetails = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border-2 border-[#002657] rounded-lg focus:outline-none focus:border-[#E5B305]"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="w-12 h-12 border-4 border-[#002657] border-t-[#E5B305] rounded-full animate-spin"></div>
          <p className="mt-4 text-[#002657]">Loading properties...</p>
        </div>
      )}

      {/* Property List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={property.featuredImage}
              alt={property.propertyName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-[#002657]">
                {property.propertyName}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Amount:</strong> ${property.amount}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {property.city}, {property.state}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Type:</strong> {property.propertyType}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {property.propertyStatus}
              </p>
              <button
                onClick={() => handleViewDetails(property)}
                className="mt-4 w-full bg-[#E5B305] text-[#002657] px-4 py-2 rounded-lg hover:bg-[#d4a000] transition-colors duration-300"
              >
                View More Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold text-[#002657]">
                {selectedProperty.propertyName}
              </h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-600 hover:text-[#E5B305]"
              >
                &times;
              </button>
            </div>
            <img
              src={selectedProperty.featuredImage}
              alt={selectedProperty.propertyName}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong> ₦{selectedProperty.amount}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {selectedProperty.city},{" "}
                {selectedProperty.state}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Type:</strong> {selectedProperty.propertyType}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {selectedProperty.propertyStatus}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Bedrooms:</strong> {selectedProperty.bedrooms}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Bathrooms:</strong> {selectedProperty.bathrooms}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Land Size:</strong> {selectedProperty.landSize} sqft
              </p>
              <p className="text-sm text-gray-600">
                <strong>Description:</strong> {selectedProperty.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;