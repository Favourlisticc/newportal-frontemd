import { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiHome, FiHeart, FiDollarSign, FiGrid, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [formData, setFormData] = useState({
    propertyName: '',
    amount: '',
    proofOfPayment: null,
    paymentMethod: '',
  });

  // Fetch properties from the backend
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://newportal-backend.onrender.com/client/properties');
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'Unable to fetch properties. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProperties(properties);
      setSearchPerformed(false);
      return;
    }

    setSearchPerformed(true);
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = properties.filter(property => 
      property.propertyName.toLowerCase().includes(lowerCaseQuery) ||
      property.city.toLowerCase().includes(lowerCaseQuery) ||
      property.state.toLowerCase().includes(lowerCaseQuery) ||
      property.propertyType.toLowerCase().includes(lowerCaseQuery) ||
      property.propertyStatus.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredProperties(filtered);
  }, [searchQuery, properties]);

  // Handle view button click
  const handleViewClick = (property) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  // Handle buy now button click
  const handleBuyNowClick = (property) => {
    setSelectedProperty(property);
    setFormData({ ...formData, propertyName: property.propertyName, amount: property.amount });
    setIsBuyModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload proofOfPayment to Cloudinary
      const proofOfPaymentData = new FormData();
      proofOfPaymentData.append('file', formData.proofOfPayment);
      proofOfPaymentData.append('upload_preset', 'giweexpv');
      const proofOfPaymentResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dwpoik1jm/image/upload',
        proofOfPaymentData
      );

      // Get client data from localStorage
      const clientData = JSON.parse(localStorage.getItem('Clientuser'));

      // Prepare purchase data
      const purchaseData = {
        client: clientData._id,
        ClientfirstName: clientData.firstName,
        ClientlastName: clientData.lastName,
        Clientphone: clientData.phone,
        Clientemail: clientData.email,
        property: selectedProperty._id,
        amount: formData.amount,
        proofOfPayment: proofOfPaymentResponse.data.secure_url,
        referralName: clientData.upline?.name || '',
        referralPhone: clientData.upline?.phone || '',
        referralEmail: clientData.upline?.email || '',
        propertyActualPrice: selectedProperty.amount,
        propertyName: selectedProperty.propertyName,
        paymentMethod: formData.paymentMethod,
      };

      // Send purchase data to the backend
      await axios.post('https://newportal-backend.onrender.com/client/purchases', purchaseData);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: 'Your payment proof has been sent successfully. We will get back to you shortly.',
      });

      // Close the modal
      setIsBuyModalOpen(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'There was an error processing your payment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Render loading spinner
  const renderLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
      <p className="text-gray-600 text-lg">Loading properties...</p>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <FiAlertCircle className="w-16 h-16 text-orange-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        We couldn't find any properties matching "{searchQuery}". Please try a different search term or browse all our available properties.
      </p>
      <button 
        onClick={() => {setSearchQuery(''); setSearchPerformed(false);}}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        View All Properties
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, location, type..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-2 bg-indigo-600 text-white p-1 rounded-md">
            <FiSearch className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && renderLoadingSpinner()}

      {/* Property Grid */}
      {!loading && (
        <>
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div key={property._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={property.featuredImage}
                      alt={property.propertyName}
                      className="w-full h-64 object-cover rounded-t-xl"
                    />
                   
                    <span className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm ${
                      property.propertyStatus === 'For Sale'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.propertyStatus}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{property.propertyName}</h3>
                    <p className="text-2xl font-bold text-indigo-600 mb-4">₦{property.amount.toLocaleString()}</p>

                    <div className="flex items-center text-gray-600 mb-4">
                      <FiMapPin className="w-5 h-5 mr-2" />
                      <span>{property.city}, {property.state}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-6">
                      <FiHome className="w-5 h-5 mr-2" />
                      <span>{property.bedrooms} beds | {property.bathrooms} baths | {property.landSize} sqft</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        onClick={() => handleViewClick(property)}
                      >
                        View
                      </button>
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => handleBuyNowClick(property)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            searchPerformed && renderEmptyState()
          )}
        </>
      )}

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={() => setIsViewModalOpen(false)}
        contentLabel="Property Details"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedProperty && (
          <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedProperty.propertyName}</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <img 
              src={selectedProperty.featuredImage} 
              alt={selectedProperty.propertyName} 
              className="w-full h-64 object-cover rounded-lg mb-4" 
            />
            
            {selectedProperty.galleryImages && selectedProperty.galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {selectedProperty.galleryImages.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Gallery ${idx+1}`} 
                    className="w-full h-24 object-cover rounded-lg" 
                  />
                ))}
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">About this property</h3>
              <p className="text-gray-600">{selectedProperty.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-800"><span className="font-semibold">Price:</span> ₦{selectedProperty.amount.toLocaleString()}</p>
                <p className="text-gray-800"><span className="font-semibold">Location:</span> {selectedProperty.city}, {selectedProperty.state}</p>
                <p className="text-gray-800"><span className="font-semibold">Type:</span> {selectedProperty.propertyType}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-800"><span className="font-semibold">Bedrooms:</span> {selectedProperty.bedrooms}</p>
                <p className="text-gray-800"><span className="font-semibold">Bathrooms:</span> {selectedProperty.bathrooms}</p>
                <p className="text-gray-800"><span className="font-semibold">Land Size:</span> {selectedProperty.landSize} sqft</p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleBuyNowClick(selectedProperty);
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Buy Now Modal */}
      <Modal
        isOpen={isBuyModalOpen}
        onRequestClose={() => setIsBuyModalOpen(false)}
        contentLabel="Buy Now"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Buy Property</h2>
            <button
              onClick={() => setIsBuyModalOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Property Name</label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Amount (₦)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Installment">Installment</option>
                <option value="FullPayment">Full Payment</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">Proof of Payment</label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  name="proofOfPayment"
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">Upload receipt or payment confirmation</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors mr-2"
                onClick={() => setIsBuyModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    Processing...
                  </>
                ) : (
                  'Submit Payment'
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Products;