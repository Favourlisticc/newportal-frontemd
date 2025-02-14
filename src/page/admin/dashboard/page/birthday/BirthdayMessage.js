// Updated Frontend Component
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, Gift } from "lucide-react";

export default function BirthdayMessage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3005/admin/birthday-message");
        setCurrentMessage(response.data);
        if (response.data) setMessage(response.data.message);
      } catch (error) {
        toast.error("Failed to load birthday message");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3005/admin/birthday-message", { message });
      setCurrentMessage(response.data);
      toast.success("Birthday message updated successfully! 🎉");
    } catch (error) {
      toast.error("Failed to update message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center space-x-3">
          <Gift className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Birthday Wishes</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <>
            {currentMessage && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h3 className="text-sm font-semibold text-purple-800 mb-2">
                  Current Message:
                </h3>
                <p className="text-purple-700 whitespace-pre-wrap">
                  {currentMessage.message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentMessage ? "Update Message" : "Create New Message"}
                </label>
                <textarea
                  className="w-full h-48 border-2 border-gray-200 p-4 rounded-xl 
                    focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                    transition-all duration-300 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heartfelt birthday message here..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white 
                  py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50
                  transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : currentMessage ? (
                  "Update Message"
                ) : (
                  "Save Message"
                )}
              </button>
            </form>
          </>
        )}
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
}