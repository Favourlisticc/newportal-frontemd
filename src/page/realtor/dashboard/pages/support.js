import React from 'react';
import { FaWhatsapp, FaEnvelope, FaPhone, FaLinkedin, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SupportPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-md m-4"
    >
      <h2 className="text-2xl font-semibold mb-6">Support</h2>
      <div className="space-y-4">
        {/* WhatsApp */}
        <a
          href="https://wa.me/2348113875325"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-green-500 transition-colors duration-200"
        >
          <FaWhatsapp className="text-green-500 mr-2" />
          <span>WhatsApp:  +234 811 387 5325</span>
        </a>

        {/* Email */}
        <a
          href=" realtorrelations@baayrealty.com"
          className="flex items-center hover:text-blue-500 transition-colors duration-200"
        >
          <FaEnvelope className="text-blue-500 mr-2" />
          <span>Email:  realtorrelations@baayrealty.com</span>
        </a>

        {/* Phone */}
        <a
          href="tel:+234 811 387 5325"
          className="flex items-center hover:text-purple-500 transition-colors duration-200"
        >
          <FaPhone className="text-purple-500 mr-2" />
          <span>Call: +234 811 387 5325</span>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/baayrealty"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-blue-700 transition-colors duration-200"
        >
          <FaLinkedin className="text-blue-700 mr-2" />
          <span>LinkedIn: @baayrealty</span>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/baayrealty"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-pink-500 transition-colors duration-200"
        >
          <FaInstagram className="text-pink-500 mr-2" />
          <span>Instagram: @baayrealty</span>
        </a>

        {/* Twitter */}
        <a
          href="https://twitter.com/baayrealty"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-blue-400 transition-colors duration-200"
        >
          <FaTwitter className="text-blue-400 mr-2" />
          <span>Twitter: @baayrealty</span>
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/baayrealty"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-blue-600 transition-colors duration-200"
        >
          <FaFacebook className="text-blue-600 mr-2" />
          <span>Facebook: @baayrealty</span>
        </a>
      </div>
    </motion.div>
  );
};

export default SupportPage;