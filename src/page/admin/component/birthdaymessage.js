import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Modal = ({ user, onClose }) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const response = await axios.post("https://newportal-backend.onrender.com/admin/send-email", {
        email: user.email,
        message,
      });

      if (response.data.success) {
        toast.success("Message sent successfully!");
        onClose();
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("An error occurred while sending the message");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Send Message to {user.email}</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#002657]"
          rows="5"
          placeholder="Type your message here..."
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="bg-[#002657] text-white px-4 py-2 rounded-lg hover:bg-[#001A42] transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;