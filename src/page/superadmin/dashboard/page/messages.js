import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner, FaReply, FaUser, FaUserShield, FaSort } from "react-icons/fa";

const ViewMessages = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality
  const [sortOrder, setSortOrder] = useState("desc"); // For sorting by date

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
    setReplyLoading(ticketId);
    try {
      await axios.post(`https://newportal-backend.onrender.com/admin/ticket/${ticketId}/reply`, {
        content: replyContent,
      });
      toast.success("Reply sent successfully");
      fetchTickets(); // Refresh the list
      setSelectedTicket(null);
      setReplyContent("");
    } catch (err) {
      toast.error("Failed to send reply");
    } finally {
      setReplyLoading(null);
    }
  };

  // Filter tickets based on search query (username, email, or phone number)
  const filteredTickets = tickets.filter((ticket) => {
    const query = searchQuery.toLowerCase();
    return (
      ticket.username?.toLowerCase().includes(query) ||
      ticket.email?.toLowerCase().includes(query) ||
      ticket.phone?.toLowerCase().includes(query)
    );
  });

  // Sort tickets by date
  const sortedTickets = filteredTickets.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen max-sm:w-screen max-sm:p-3">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-[#002657]">View Messages History</h2>

        {/* Search and Sort Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by username, email, or phone..."
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded-md text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <FaSpinner className="animate-spin text-4xl text-[#002657]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#002657] text-white">
                  <th className="border border-gray-300 px-4 py-2">No</th>
                  <th className="border border-gray-300 px-4 py-2">First Name</th>
                  <th className="border border-gray-300 px-4 py-2">Last Name</th>
                  <th className="border border-gray-300 px-4 py-2">Username</th>
                  <th className="border border-gray-300 px-4 py-2">User Type</th>
                  <th className="border border-gray-300 px-4 py-2">Phone Number</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Subject</th>
                  <th className="border border-gray-300 px-4 py-2">Messages</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTickets.map((ticket, index) => (
                  <tr key={ticket._id} className="text-sm text-gray-700 hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{ticket.firstName || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{ticket.lastName}</td>
                    <td className="border border-gray-300 px-4 py-2">{ticket.username || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{ticket?.messages.sender}</td>
                    <td className="border border-gray-300 px-4 py-2">{ticket.phone || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{ticket.email || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{ticket.subject}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="space-y-2">
                        {ticket.messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded ${
                              msg.sender === "admin"
                                ? "bg-[#E5B30F] text-white self-end text-right"
                                : "bg-gray-200 self-start text-left"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {msg.sender === "admin" ? (
                                <FaUserShield className="text-sm" />
                              ) : (
                                <FaUser className="text-sm" />
                              )}
                              <span>{msg.content}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          ticket.status === "open"
                            ? "bg-green-100 text-green-800"
                            : ticket.status === "closed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        className="bg-[#002657] text-white px-3 py-1 rounded flex items-center justify-center gap-2"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <FaReply /> Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-[#002657] mb-4">Reply to Ticket</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows="4"
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setSelectedTicket(null)}
              >
                Cancel
              </button>
              <button
                className="bg-[#002657] text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={() => handleReply(selectedTicket._id)}
                disabled={replyLoading === selectedTicket._id}
              >
                {replyLoading === selectedTicket._id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Send Reply"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMessages;