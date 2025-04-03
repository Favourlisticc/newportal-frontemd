// TestimonialsManagement.jsx
import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// LoadingSpinner component included in the same file
const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  const colorClasses = {
    white: 'text-white',
    blue: 'text-blue-600',
    gray: 'text-gray-600'
  };
  
  return (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
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
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const TestimonialsManagement = () => {
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [acceptedTestimonials, setAcceptedTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const [pendingRes, acceptedRes] = await Promise.all([
        axios.get('https://newportal-backend.onrender.com/admin/testimonial/pending'),
        axios.get('https://newportal-backend.onrender.com/admin/testimonial/accepted')
      ]);
      
      setPendingTestimonials(pendingRes.data);
      setAcceptedTestimonials(acceptedRes.data);
    } catch (error) {
      toast.error('Failed to fetch testimonials');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (testimonial) => {
    setActionInProgress(testimonial._id);
    try {
      await axios.post('http://localhost:3005/admin/testimonial/accept', { testimonialId: testimonial._id });
      toast.success('Testimonial accepted successfully');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to accept testimonial');
      console.error(error);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (testimonialId) => {
    setActionInProgress(testimonialId);
    try {
      await axios.delete(`http://localhost:3005/admin/testimonial/pending/${testimonialId}`);
      toast.success('Testimonial rejected successfully');
      setPendingTestimonials(prevTestimonials => 
        prevTestimonials.filter(t => t._id !== testimonialId)
      );
    } catch (error) {
      toast.error('Failed to reject testimonial');
      console.error(error);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (testimonialId) => {
    setActionInProgress(testimonialId);
    try {
      await axios.delete(`https://newportal-backend.onrender.com/admin/testimonial/accepted/${testimonialId}`);
      toast.success('Testimonial deleted successfully');
      setAcceptedTestimonials(prevTestimonials => 
        prevTestimonials.filter(t => t._id !== testimonialId)
      );
    } catch (error) {
      toast.error('Failed to delete testimonial');
      console.error(error);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 max-sm:w-screen max-sm:p-3">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Testimonials Management</h1>
      
      <div className="w-full">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-blue-900/5 rounded-xl mb-6">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5 text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                )
              }
            >
              Pending Testimonials
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5 text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                )
              }
            >
              Accepted Testimonials
            </Tab>
          </Tab.List>
          <Tab.Panels>
            {/* Pending Testimonials */}
            <Tab.Panel className="rounded-xl bg-white p-3">
              {loading ? (
                <div className="flex justify-center my-10">
                  <LoadingSpinner size="large" />
                </div>
              ) : pendingTestimonials.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No pending testimonials found.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTestimonials.map((testimonial) => (
                    <div key={testimonial._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex max-sm:flex-col justify-between items-start max-sm:items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{testimonial.title}</h3>
                          <p className="text-gray-600 text-sm">
                            By: {testimonial.realtorName} ({testimonial.realtorEmail})
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            Submitted: {new Date(testimonial.dateSubmitted).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 max-sm:mt-4">
                          <button
                            onClick={() => handleAccept(testimonial)}
                            disabled={actionInProgress === testimonial._id}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300 flex items-center"
                          >
                            {actionInProgress === testimonial._id ? (
                              <>
                                <LoadingSpinner size="small" color="white" />
                                <span className="ml-2">Processing...</span>
                              </>
                            ) : (
                              'Accept'
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(testimonial._id)}
                            disabled={actionInProgress === testimonial._id}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 flex items-center"
                          >
                            {actionInProgress === testimonial._id ? (
                              <>
                                <LoadingSpinner size="small" color="white" />
                                <span className="ml-2">Processing...</span>
                              </>
                            ) : (
                              'Reject'
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-gray-700">{testimonial.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>

            {/* Accepted Testimonials */}
            <Tab.Panel className="rounded-xl bg-white p-3">
              {loading ? (
                <div className="flex justify-center my-10">
                  <LoadingSpinner size="large" />
                </div>
              ) : acceptedTestimonials.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No accepted testimonials found.
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedTestimonials.map((testimonial) => (
                    <div key={testimonial._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{testimonial.title}</h3>
                          <p className="text-gray-600 text-sm">
                            By: {testimonial.realtorName} ({testimonial.realtorEmail})
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            Submitted: {new Date(testimonial.dateSubmitted).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(testimonial._id)}
                          disabled={actionInProgress === testimonial._id}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 flex items-center"
                        >
                          {actionInProgress === testimonial._id ? (
                            <>
                              <LoadingSpinner size="small" color="white" />
                              <span className="ml-2">Deleting...</span>
                            </>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                      <div className="mt-3">
                        <p className="text-gray-700">{testimonial.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default TestimonialsManagement;