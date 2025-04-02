import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar, File, DollarSign, Loader2 } from "lucide-react";

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

const FundNowPage = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!file) newErrors.file = "Proof of payment is required";
    if (!paymentDate) newErrors.paymentDate = "Payment date is required";
    if (!amount || amount <= 0) newErrors.amount = "Valid amount is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   // Fetch user data from localStorage
   const storedRealtorData = localStorage.getItem("realtorData");
   const parsedData = JSON.parse(storedRealtorData);

   console.log("localstorage", parsedData)
   const username = parsedData?.username; 

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    
    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "giweexpv");
  
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dwpoik1jm/image/upload",
        formData
      );
  
      // Submit funding data to backend
      const response = await axios.post("https://newportal-backend.onrender.com/realtor/upload-fund", {
        userid: parsedData._id,
        username: parsedData.username,
        firstName: parsedData.firstName,
        lastName: parsedData.lastName,
        email: parsedData.email,
        phone: parsedData.phone,
        amount,
        paymentDate,
        proofImage: cloudinaryResponse.data.secure_url
      });
  
      // Log the activity
      await logActivity(
        parsedData._id,
        'Realtor',
        'fund_upload',
        'Realtor uploaded funding proof',
        {
          amount: amount,
          paymentDate: paymentDate
        }
      );
  
      toast.success("Funding request submitted successfully!");
      // Reset form
      setFile(null);
      setPaymentDate("");
      setAmount("");
    } catch (error) {
      console.error(error);
      toast.error("Error submitting funding request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-10 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2 text-green-600">🧾</span> Upload Proof of Payment
        </h1>

        <div className="bg-gray-50 p-4 border rounded-lg mb-6">
          {/* ... (keep existing bank details) */}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 text-left">Proof of Payment</label>
            <div className="flex items-center">
              <File className="text-gray-500 mr-2" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
            {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-left ">Date of Payment</label>
            <div className="flex items-center">
              <Calendar className="text-gray-500 mr-2" />
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
            {errors.paymentDate && <p className="text-red-500 text-sm">{errors.paymentDate}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-left">Amount To Fund</label>
            <div className="flex items-center">
              <DollarSign className="text-gray-500 mr-2" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                placeholder="Enter amount"
              />
            </div>
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Fund Now"
            )}
          </button>
        </form>
      </div>

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

export default FundNowPage;