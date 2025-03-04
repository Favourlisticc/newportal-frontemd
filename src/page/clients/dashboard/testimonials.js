import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AddTestimonials = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const realtorData = JSON.parse(localStorage.getItem("realtorData"));
      if (!realtorData) {
        toast.error("Realtor data not found. Please log in again.");
        return;
      }

      const testimonialData = {
        ...data,
        realtorId: realtorData._id,
        realtorName: realtorData.firstName + " " + realtorData.lastName,
        realtorEmail: realtorData.email,
      };

      const response = await fetch('https://newportal-backend.onrender.com/realtor/testimonials/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit testimonial');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your testimonial has been submitted for review.',
      });
      reset();
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6">Add Testimonials</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Testimonial Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Testimonial Content</label>
          <textarea
            {...register("content", { required: "Content is required" })}
            className="w-full p-2 border rounded-lg"
            rows="5"
          />
          {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#002657] text-white p-2 rounded-lg flex items-center justify-center"
        >
          {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null}
          {isSubmitting ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
      <ToastContainer />
    </motion.div>
  );
};

export default AddTestimonials;