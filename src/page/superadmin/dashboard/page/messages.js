import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner, FaReply, FaUser, FaUserShield, FaSort, FaSearch, FaFilter, FaTimes, FaCheck, FaClock } from "react-icons/fa";

const ViewMessages = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get("https://newportal-backend.onrender.com/admin/ticket");
      setTickets(data);
    } catch (err) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    setReplyLoading(ticketId);
    try {
      await axios.post(`https://newportal-backend.onrender.com/admin/ticket/${ticketId}/reply`, {
        content: replyContent,
      });
      toast.success("Reply sent successfully");
      fetchTickets();
      setReplyContent("");
    } catch (err) {
      toast.error("Failed to send reply");
    } finally {
      setReplyLoading(null);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await axios.patch(`https://newportal-backend.onrender.com/admin/ticket/${ticketId}/status`, {
        status: newStatus,
      });
      toast.success(`Ticket marked as ${newStatus}`);
      fetchTickets();
    } catch (err) {
      toast.error("Failed to update ticket status");
    }
  };

  // Filter tickets based on search query and status
  const filteredTickets = tickets.filter((ticket) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      ticket.username?.toLowerCase().includes(query) ||
      ticket.email?.toLowerCase().includes(query) ||
      ticket.phone?.toLowerCase().includes(query) ||
      ticket.subject?.toLowerCase().includes(query);
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort tickets by date
  const sortedTickets = filteredTickets.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen max-sm:w-screen max-sm:p-3">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-semibold mb-6 text-[#002657]">Customer Support Messages</h2>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              className="w-full pl-10 p-3 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="p-3 border border-gray-300 rounded-md bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              className="p-3 border border-gray-300 rounded-md bg-white"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <FaSpinner className="animate-spin text-4xl text-[#002657]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTickets.length > 0 ? (
              sortedTickets.map((ticket) => (
                <div 
                  key={ticket._id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Ticket Header */}
                  <div className="bg-[#002657] text-white p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium truncate">{ticket.subject}</h3>
                      <p className="text-xs opacity-80">{formatDate(ticket.createdAt)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "open" ? "bg-green-100 text-green-800" : 
                      ticket.status === "closed" ? "bg-red-100 text-red-800" : 
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  
                  {/* User Info */}
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#002657] text-white rounded-full flex items-center justify-center">
                        {ticket.firstName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-medium">{ticket.firstName} {ticket.lastName}</p>
                        <p className="text-xs text-gray-600">{ticket.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview of latest messages */}
                  <div className="p-4 h-24 overflow-hidden">
                    {ticket.messages.slice(-1).map((msg, i) => (
                      <div key={i} className="mb-2">
                        <span className={`text-xs font-medium ${
                          msg.sender === "admin" ? "text-[#E5B30F]" : "text-[#002657]"
                        }`}>
                          {msg.sender === "admin" ? "Admin" : "User"}:
                        </span>
                        <p className="text-gray-700 text-sm break-words line-clamp-2">
                          {msg.content}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="p-4 border-t bg-gray-50 flex justify-between">
                  
                    <button
                      className="bg-[#002657] text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <FaReply size={14} />
                      Reply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center h-32 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No tickets found</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b flex justify-between items-center bg-[#002657] text-white rounded-t-lg">
              <div>
                <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
                <p className="text-sm opacity-90">
                  Ticket #{selectedTicket._id.substring(selectedTicket._id.length - 6)}
                </p>
              </div>
              
              <button 
                className="text-white hover:bg-[#003a7a] p-2 rounded-full"
                onClick={() => setSelectedTicket(null)}
              >
                <FaTimes />
              </button>
            </div>
            
            {/* User Info */}
            <div className="p-4 bg-gray-50 border-b flex gap-4 items-center">
              <div className="w-12 h-12 bg-[#002657] text-white rounded-full flex items-center justify-center text-lg font-bold">
                {selectedTicket.firstName?.charAt(0) || "U"}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{selectedTicket.firstName} {selectedTicket.lastName}</h4>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{selectedTicket.email}</span>
                  <span>•</span>
                  <span>{selectedTicket.phone}</span>
                </div>
              </div>
              
              <div>
                <span className={`px-3 py-1 rounded-full font-medium ${
                  selectedTicket.status === "open" ? "bg-green-100 text-green-800" : 
                  selectedTicket.status === "closed" ? "bg-red-100 text-red-800" : 
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {selectedTicket.status}
                </span>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4 max-w-3xl mx-auto">
                {selectedTicket.messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                      msg.sender === "admin" 
                        ? "bg-[#002657] text-white rounded-tr-none" 
                        : "bg-white rounded-tl-none"
                    }`}>
                      <div className="flex items-start gap-2">
                        {msg.sender !== "admin" && (
                          <div className="bg-[#E5B30F] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <FaUser />
                          </div>
                        )}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">
                              {msg.sender === "admin" ? "Admin" : selectedTicket.firstName}
                            </span>
                            <span className="text-xs opacity-70 ml-2">
                              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <p className="break-words">{msg.content}</p>
                        </div>
                        {msg.sender === "admin" && (
                          <div className="bg-[#E5B30F] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <FaUserShield />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reply Form */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <textarea
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002657]"
                  rows="3"
                  placeholder="Type your reply here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                ></textarea>
                
                <button
                  className="bg-[#002657] text-white px-6 py-2 rounded-lg flex items-center gap-2 self-end hover:bg-[#003a7a] transition-colors"
                  onClick={() => handleReply(selectedTicket._id)}
                  disabled={replyLoading === selectedTicket._id || !replyContent.trim()}
                >
                  {replyLoading === selectedTicket._id ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaReply />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMessages;