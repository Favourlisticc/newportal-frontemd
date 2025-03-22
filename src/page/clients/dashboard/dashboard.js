import React, { useState, useEffect, useRef } from 'react';
import { FiDollarSign, FiHome } from 'react-icons/fi';
import { TailSpin } from 'react-loader-spinner';
import { FaUsers, FaThumbsUp, FaCopy, FaFile, FaStar, FaMoneyBillWave, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import RemindersTable from './unsettled-sales.js'; // Import the RemindersTable component

const Home = () => {
  const [stats, setStats] = useState({ totalPurchases: 0, totalProperties: 0 });
  const [loading, setLoading] = useState(true);
  const [referralInfo, setReferralInfo] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(false);
  const [approvedPurchases, setApprovedPurchases] = useState([]);
  const [loadingApprovedPurchases, setLoadingApprovedPurchases] = useState(true);
  const testimonialsContainerRef = useRef(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [startX, setStartX] = useState(null); // For touch swipe functionality

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientData = JSON.parse(localStorage.getItem('Clientuser'));
        const clientId = clientData._id;

        // Fetch client stats
        const statsResponse = await fetch(`https://newportal-backend.onrender.com/client/purchases/stats/${clientId}`);
        const statsData = await statsResponse.json();
        setStats(statsData);

        console.log(statsData);

        // Fetch referral info
        setReferralInfo({
          name: clientData.upline?.name || 'N/A',
          phone: clientData.upline?.phone || 'N/A',
          email: clientData.upline?.email || 'N/A'
        });

        // Fetch approved purchases
        const purchasesResponse = await fetch(
          `https://newportal-backend.onrender.com/client/purchases?_id=${clientId}&status=confirmed`
        );
        const purchasesData = await purchasesResponse.json();
        setApprovedPurchases(purchasesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setLoadingApprovedPurchases(false);
      }
    };

    fetchData();
  }, []);

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoadingTestimonials(true);
      try {
        const response = await fetch(`https://newportal-backend.onrender.com/realtor/testimonials`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTestimonials(data.testimonials);
      } catch (error) {
        console.log('Error fetching testimonials:', error);
        toast.error('Failed to fetch testimonials');
      } finally {
        setIsLoadingTestimonials(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null) return;

    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (diff > 50) {
      // Swipe left
      setCurrentTestimonialIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setStartX(null);
    } else if (diff < -50) {
      // Swipe right
      setCurrentTestimonialIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setStartX(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Reminders Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Reminders</h2>
        <div className="overflow-x-auto">
          <RemindersTable />
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white p-3 md:p-6 rounded-lg shadow-md mb-6 md:mb-8 relative">
        <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
        <div className="relative">
          {/* Loading State for Testimonials */}
          {isLoadingTestimonials ? (
            <div className="flex justify-center items-center h-32">
              <FaSpinner className="animate-spin text-2xl text-[#002657]" />
            </div>
          ) : testimonials.length > 0 ? (
            <div
              className="w-full overflow-hidden px-8"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {/* Mobile and Desktop View (Single Card) */}
              <AnimatePresence>
                <motion.div
                  key={testimonials[currentTestimonialIndex]._id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full p-4 border border-gray-200 rounded-lg"
                >
                  <h3 className="font-semibold">{testimonials[currentTestimonialIndex].title}</h3>
                  <p className="text-gray-700">{testimonials[currentTestimonialIndex].content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {testimonials[currentTestimonialIndex].realtorName}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-center text-gray-500">No testimonials available.</p>
          )}
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center mt-4">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 mx-1 rounded-full ${
                currentTestimonialIndex === index ? 'bg-[#002657]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-4 rounded-lg mr-4">
              <FiDollarSign className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-lg text-gray-500">Total Purchases</p>
              {loading ? (
                <TailSpin color="#6366f1" height={32} width={32} />
              ) : (
                <p className="text-3xl font-bold">₦{stats.totalPurchases?.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center">
            <div className="bg-green-100 p-4 rounded-lg mr-4">
              <FiHome className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg text-gray-500">Properties Owned</p>
              {loading ? (
                <TailSpin color="#22c55e" height={32} width={32} />
              ) : (
                <p className="text-3xl font-bold">{stats.totalProperties}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approved Transactions Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-8">
        <h2 className="text-xl font-semibold mb-4 p-6">Transactions</h2>
        {loadingApprovedPurchases ? (
          <div className="flex justify-center p-8">
            <TailSpin color="#6366f1" height={40} width={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Purchase Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvedPurchases.map((purchase) => (
                  <tr key={purchase._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src="https://via.placeholder.com/80"
                          alt="Property"
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <span className="font-medium">{purchase.propertyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₦{purchase.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Referral Info Section */}
      {referralInfo && (
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8 mt-40">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">You were referred by:</h3>
          <div className="space-y-2">
            <p className="text-gray-900 text-lg">{referralInfo.name}</p>
            <p className="text-gray-600 text-md">{referralInfo.phone}</p>
            <p className="text-gray-600 text-md">{referralInfo.email}</p>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
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

export default Home;