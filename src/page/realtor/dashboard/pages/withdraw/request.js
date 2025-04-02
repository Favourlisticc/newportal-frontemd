import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

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

const WithdrawalPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const storedRealtorData = localStorage.getItem("realtorData");
    const parsedData = JSON.parse(storedRealtorData);
    setBalance(parsedData?.balance || 0);
  }, []);

  const formatNumberWithCommas = (value) => {
    return Number(value.replace(/,/g, "")).toLocaleString();
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount.replace(/,/g, ""));
  
    if (numericAmount < 4000) {
      toast.error("Minimum withdrawal is ₦4,000");
      return;
    }
  
    if (numericAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }
  
    setLoading(true);
    try {
      const storedRealtorData = localStorage.getItem("realtorData");
      const parsedData = JSON.parse(storedRealtorData);
  
      const response = await axios.post("https://newportal-backend.onrender.com/realtor/withdrawal", {
        userId: parsedData._id,
        amount: numericAmount,
        username: parsedData.username,
        firstName: parsedData.firstName,
        lastName: parsedData.lastName,
        email: parsedData.email,
        phone: parsedData.phone,
      });
  
      // Log the activity
      await logActivity(
        parsedData._id,
        'Realtor',
        'withdrawal_request',
        'Realtor requested withdrawal',
        {
          amount: numericAmount
        }
      );
  
      toast.success("Withdrawal request submitted successfully!");
      setAmount("");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Withdraw Funds</h2>
        <div className="mb-6">
          <p className="text-lg font-semibold">
            Available Balance: ₦{balance.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleWithdrawal} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Withdrawal Amount (₦)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (!isNaN(value)) {
                  setAmount(formatNumberWithCommas(value));
                }
              }}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
          >
            {loading ? (
              <TailSpin color="#fff" height={24} width={24} />
            ) : (
              "Request Withdrawal"
            )}
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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

export default WithdrawalPage;