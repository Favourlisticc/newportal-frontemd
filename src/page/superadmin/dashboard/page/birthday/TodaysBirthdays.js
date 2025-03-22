import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Gift, Clock, User, Phone, Mail, Calendar, PartyPopper, MessageCircle } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

const TodaysBirthdays = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://newportal-backend.onrender.com/admin/todays-birthdays');
        setBirthdays(response.data);
      } catch (error) {
        toast.error("Failed to load birthdays");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNigeriaDateTime = (date) => {
    return {
      date: date.toLocaleDateString('en-NG', {
        timeZone: 'Africa/Lagos',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-NG', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
  };

  const { date, time } = formatNigeriaDateTime(currentTime);

  const handleMessageClick = (user) => {
    setSelectedUser(user);
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const response = await axios.post('https://newportal-backend.onrender.com/admin/send-birthday-email', {
        email: selectedUser.email,
        message: message
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: `Your birthday message has been sent to ${selectedUser.firstName}.`,
          confirmButtonColor: '#002657',
        });
        setIsMessageModalOpen(false);
        setMessage("");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Error sending message");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white max-sm:w-screen max-sm:p-3 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Gift size={32} className="text-[#002657]" />
            <h2 className="text-3xl font-bold text-[#002657]">
              Today's Celebrants
            </h2>
          </div>
          <div className="flex items-center space-x-2 bg-[#E5B30F] p-3 rounded-lg">
            <Clock className="text-white" />
            <div className="text-white text-sm">
              <div>Nigeria Time</div>
              <div className="font-medium">{date}</div>
              <div className="font-medium">{time}</div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Show</span>
              <input
                type="number"
                className="border rounded px-3 py-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-[#002657]"
                defaultValue="10"
              />
              <span className="text-gray-600">entries</span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <FontAwesomeIcon 
                icon={faSpinner} 
                className="text-[#002657] text-4xl animate-spin"
              />
            </div>
          ) : birthdays.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <PartyPopper className="w-24 h-24 mb-4 text-[#E5B30F]" />
              <p className="text-[#002657] text-lg font-medium">
                No birthdays to celebrate today
              </p>
              <p className="text-gray-500 mt-2">
                Check back tomorrow for new celebrants!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#002657] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center space-x-2">
                        <User size={18} />
                        <span>Username</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center space-x-2">
                        <User size={18} />
                        <span>Full Name</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center space-x-2">
                        <Mail size={18} />
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center space-x-2">
                        <Phone size={18} />
                        <span>Phone</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center space-x-2">
                        <Calendar size={18} />
                        <span>Date of Birth</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {birthdays.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone}</td>
                      <td className="px-6 py-4">
                        {new Date(user.dob).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleMessageClick(user)}
                          className="flex items-center space-x-2 bg-[#E5B30F] text-white px-4 py-2 rounded-lg hover:bg-[#002657] transition-colors"
                        >
                          <MessageCircle size={18} />
                          <span>Message</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#002657] mb-4">
              Send Birthday Message to {selectedUser?.firstName}
            </h3>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002657]"
              rows="5"
              placeholder="Type your birthday message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-[#E5B30F] text-white px-4 py-2 rounded-lg hover:bg-[#002657] transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysBirthdays;