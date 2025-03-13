import React, { useState, useEffect, useRef } from 'react';
import { FiDollarSign, FiHome } from 'react-icons/fi';
import { TailSpin } from 'react-loader-spinner';
import { FaUsers, FaThumbsUp, FaCopy, FaFile, FaStar, FaMoneyBillWave, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion'; // For animations

const Home = () => {
  const [stats, setStats] = useState({ totalPurchases: 0, totalProperties: 0 });
  const [loading, setLoading] = useState(true);
  const [referralInfo, setReferralInfo] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(false);
  const testimonialsContainerRef = useRef(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

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

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
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

  // Scroll testimonials left
  const scrollLeft = () => {
    if (testimonials.length === 0) return;

    setCurrentTestimonialIndex(prev =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Scroll testimonials right
  const scrollRight = () => {
    if (testimonials.length === 0) return;

    setCurrentTestimonialIndex(prev =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white p-3 md:p-6 rounded-lg shadow-md mb-6 md:mb-8 relative">
        <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#002657] text-white p-2 rounded-full z-10"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft />
          </button>

          {/* Mobile and Desktop Testimonials */}
          <div className="w-full overflow-hidden px-8">
            {/* Mobile View (Single Card) */}
            <div className="block md:hidden">
              {testimonials.length > 0 && (
                <motion.div
                  key={testimonials[currentTestimonialIndex]._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full p-4 border border-gray-200 rounded-lg"
                >
                  <h3 className="font-semibold">{testimonials[currentTestimonialIndex].title}</h3>
                  <p className="text-gray-700">{testimonials[currentTestimonialIndex].content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    - {testimonials[currentTestimonialIndex].realtorName} ({testimonials[currentTestimonialIndex].realtorEmail})
                  </p>
                </motion.div>
              )}
            </div>

            {/* Desktop View (Scrollable) */}
            <div
              ref={testimonialsContainerRef}
              className="hidden md:flex overflow-x-auto space-x-4 p-4 scrollbar-hide"
            >
              <AnimatePresence>
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial._id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 w-72 p-4 border border-gray-200 rounded-lg"
                  >
                    <h3 className="font-semibold">{testimonial.title}</h3>
                    <p className="text-gray-700">{testimonial.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      - {testimonial.realtorName} ({testimonial.realtorEmail})
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#002657] text-white p-2 rounded-full z-10"
            aria-label="Next testimonial"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Pagination Indicators for Mobile */}
        <div className="flex justify-center mt-4 md:hidden">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 mx-1 rounded-full ${currentTestimonialIndex === index ? 'bg-[#002657]' : 'bg-gray-300'}`}
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

      {/* Referral Info Section */}
      {referralInfo && (
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
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