// frontend/ContactSupport.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCommentDots, 
  faEnvelopeOpen, 
  faEnvelope,
  faCheckCircle,
  faSpinner,
  faCaretDown,
  faCaretUp,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

const ContactSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // Fetch user data from localStorage
  const storedRealtorData = localStorage.getItem("realtorData");
  const parsedData = JSON.parse(storedRealtorData);
  const userid = parsedData?._id;

  console.log(parsedData)

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://newportal-backend.onrender.com/realtor/support/my-tickets/${userid}`);
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
      setIsLoading(false);
    };
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://newportal-backend.onrender.com/realtor/support`, {
        user: parsedData?._id,
        subject,
        message
      });
      setTickets([response.data, ...tickets]);
      setIsOpen(false);
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleReply = async (ticketId) => {
    if (!newMessage.trim()) return;
    try {
      const response = await axios.post(`https://newportal-backend.onrender.com/realtor/support/${ticketId}/messages`, {
        content: newMessage
      });
      setTickets(tickets.map(t => 
        t._id === ticketId ? response.data : t
      ));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'closed': return faCheckCircle;
      case 'open': return faEnvelopeOpen;
      default: return faEnvelope;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'closed': return 'text-green-500';
      case 'open': return 'text-blue-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <div className="container p-6 max-sm:p-0 max-w-4xl">
      <div className="bg-white shadow-xl rounded-lg p-6 mb-6 transition-all">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-4 rounded-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faCommentDots} className="text-teal-500" />
            Contact Support
          </h2>
          <FontAwesomeIcon 
            icon={isOpen ? faCaretUp : faCaretDown} 
            className="text-gray-600 text-xl"
          />
        </div>

        {isOpen && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="What's your issue about?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Describe your issue in detail..."
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              Send Message
            </button>
          </form>
        )}
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faEnvelopeOpen} className="text-blue-500" />
          Support History
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="text-teal-500 text-4xl animate-spin"
            />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No support requests found
          </div>
        ) : (
          tickets.map((ticket) => (
            <div 
              key={ticket._id}
              className="border-b last:border-0 border-gray-100 mb-4"
            >
              <div 
                className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer rounded-lg"
                onClick={() => setSelectedTicket(selectedTicket === ticket._id ? null : ticket._id)}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon 
                    icon={getStatusIcon(ticket.status)} 
                    className={`text-xl ${getStatusColor(ticket.status)}`}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{ticket.subject}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <FontAwesomeIcon
                  icon={selectedTicket === ticket._id ? faCaretUp : faCaretDown}
                  className="text-gray-500"
                />
              </div>

              {selectedTicket === ticket._id && (
                <div className="pl-12 pr-4 pb-4 space-y-4">
                  <div className="space-y-4">
                    {ticket.messages.map((msg, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-gray-50 ml-4' 
                            : 'bg-teal-50 mr-4'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">
                            {msg.sender === 'user' ? 'You' : 'Support Team'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(msg.timestamp), 'MMM dd HH:mm')}
                          </span>
                        </div>
                        <p className="text-gray-700">{msg.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleReply(ticket._id)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactSupport;