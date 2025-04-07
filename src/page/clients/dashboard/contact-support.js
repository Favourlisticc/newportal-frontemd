import React, { useState, useEffect, useRef } from 'react';
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
  faPaperPlane,
  faUserCircle,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';

const ContactSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const messagesEndRef = useRef(null);

  // Safe date formatter
  const safeFormatDate = (dateString, formatStr) => {
    try {
      if (!dateString) return 'No date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, formatStr);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Fetch user data from localStorage
  const storedRealtorData = localStorage.getItem("Clientuser");
  const parsedData = JSON.parse(storedRealtorData);
  const userid = parsedData?._id;

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
  }, [userid]);

  // Scroll to bottom of messages when they update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket, tickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`https://newportal-backend.onrender.com/client/support`, {
        user: parsedData?._id,
        firstName: parsedData?.firstName,
        lastName: parsedData?.lastName,
        username: parsedData?.username,
        phone: parsedData?.phone,
        email: parsedData?.email,
        subject,
        message
      });
      setTickets([response.data, ...tickets]);
      setIsOpen(false);
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (ticketId) => {
    if (!newMessage.trim()) return;
    
    // Create temporary message with pending state
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isSending: true
    };

    // Optimistically update the UI
    setTickets(tickets.map(t => 
      t._id === ticketId ? { 
        ...t, 
        messages: [...(t.messages || []), tempMessage],
        status: 'open'
      } : t
    ));
    
    setNewMessage('');
    setIsReplying(true);

    try {
      const response = await axios.post(`https://newportal-backend.onrender.com/realtor/support/${ticketId}/messages`, {
        sender: 'user',
        content: newMessage
      });

      // Replace temporary message with server response
      setTickets(tickets.map(t => 
        t._id === ticketId ? { 
          ...t, 
          messages: t.messages.map(m => 
            m._id === tempMessage._id ? response.data : m
          ),
          status: 'open'
        } : t
      ));
    } catch (error) {
      console.error('Error sending reply:', error);
      // Rollback on error
      setTickets(tickets.map(t => 
        t._id === ticketId ? { 
          ...t, 
          messages: t.messages.filter(m => m._id !== tempMessage._id)
        } : t
      ));
      // Optionally restore the message to input field
      setNewMessage(newMessage);
    } finally {
      setIsReplying(false);
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
    <div className="container p-6 max-sm:p-0 max-w-4xl mx-auto">
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Send Message
                </>
              )}
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
                      {safeFormatDate(ticket.createdAt, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <FontAwesomeIcon
                  icon={selectedTicket === ticket._id ? faCaretUp : faCaretDown}
                  className="text-gray-500"
                />
              </div>

              {selectedTicket === ticket._id && (
                <div className="pl-4 pr-4 pb-4">
                  {/* Chat container */}
                  <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                    {/* Initial ticket message */}
                    <div className="flex justify-start mb-4">
                      <div className="flex max-w-xs md:max-w-md lg:max-w-lg">
                        <div className="flex-shrink-0 pt-1">
                          <FontAwesomeIcon 
                            icon={faUserCircle} 
                            className="text-2xl text-gray-400"
                          />
                        </div>
                        <div className="mx-2 text-left">
                          <div className="inline-block px-4 py-2 bg-white text-gray-800 shadow rounded-lg rounded-tl-none">
                            <p>{ticket.message}</p>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {safeFormatDate(ticket.createdAt, 'MMM dd HH:mm')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* All replies */}
                    {ticket.messages?.map((msg, idx) => (
                      <div 
                        key={msg._id || idx}
                        className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-shrink-0 pt-1">
                            <FontAwesomeIcon 
                              icon={msg.sender === 'user' ? faUserCircle : faHeadset} 
                              className={`text-2xl ${msg.sender === 'user' ? 'text-gray-400' : 'text-teal-500'}`}
                            />
                          </div>
                          <div className={`mx-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <div 
                              className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' 
                                ? 'bg-teal-600 text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 shadow rounded-tl-none'} ${msg.isSending ? 'opacity-70' : ''}`}
                            >
                              <p>{msg.content}</p>
                              {msg.isSending && (
                                <div className="flex justify-end mt-1">
                                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {msg.isSending ? 'Sending...' : safeFormatDate(msg.timestamp, 'MMM dd HH:mm')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply input */}
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleReply(ticket._id)}
                    />
                    <button
                      onClick={() => handleReply(ticket._id)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                      disabled={isReplying}
                    >
                      {isReplying ? (
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={faPaperPlane} />
                      )}
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