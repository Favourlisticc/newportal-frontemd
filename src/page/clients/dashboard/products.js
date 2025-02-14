// pages/Products.jsx
import { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiHome, FiHeart, FiDollarSign, FiGrid } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyName: '',
    amount: '',
    proofOfPayment: null,
    paymentMethod: '',
  });

  // Fetch properties from the backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://newportal-backend.onrender.com/client/properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={property.featuredImage}
                alt={property.propertyName}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
                <FiHeart className="w-6 h-6 text-gray-600" />
              </button>
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
              <p className="text-2xl font-bold text-indigo-600 mb-4">₦{property.amount}</p>

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

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={() => setIsViewModalOpen(false)}
        contentLabel="Property Details"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedProperty && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProperty.propertyName}</h2>
            <img src={selectedProperty.featuredImage} alt={selectedProperty.propertyName} className="w-full h-64 object-cover mb-4" />
            <p className="text-gray-600 mb-4">{selectedProperty.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">Price: ₦{selectedProperty.amount}</p>
                <p className="text-gray-600">Location: {selectedProperty.city}, {selectedProperty.state}</p>
                <p className="text-gray-600">Type: {selectedProperty.propertyType}</p>
              </div>
              <div>
                <p className="text-gray-600">Bedrooms: {selectedProperty.bedrooms}</p>
                <p className="text-gray-600">Bathrooms: {selectedProperty.bathrooms}</p>
                <p className="text-gray-600">Land Size: {selectedProperty.landSize} sqft</p>
              </div>
            </div>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
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
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-4">Buy Now</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Property Name</label>
            <input
              type="text"
              name="propertyName"
              value={formData.propertyName}
              readOnly
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Proof of Payment</label>
            <input
              type="file"
              name="proofOfPayment"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Installment">Installment</option>
              <option value="FullPayment">Full Payment</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Products;