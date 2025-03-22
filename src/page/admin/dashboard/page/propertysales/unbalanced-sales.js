import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'; // Import SweetAlert

const IncompletePurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isViewRemindersModalOpen, setIsViewRemindersModalOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [reminderLoading, setReminderLoading] = useState(true);
  const [fromDate, setFromDate] = useState(null); // For date filtering
  const [toDate, setToDate] = useState(null); // For date filtering
  const [isAddingReminder, setIsAddingReminder] = useState(false); // Loading state for adding reminder

  // Fetch incomplete purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('https://newportal-backend.onrender.com/admin/purchases/incomplete');
        setPurchases(response.data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  // Format amounts with commas
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount).replace('NGN', '₦');
  };

  // Handle search and date filtering
  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.Clientemail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.ClientfirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.ClientlastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.Clientphone.toLowerCase().includes(searchQuery.toLowerCase());

    const purchaseDate = new Date(purchase.createdAt);
    const matchesFromDate = fromDate ? purchaseDate >= new Date(fromDate) : true;
    const matchesToDate = toDate ? purchaseDate <= new Date(toDate) : true;

    return matchesSearch && matchesFromDate && matchesToDate;
  });

  // Handle adding a reminder
  const handleAddReminder = async (purchaseId, amountRemaining, nextPaymentDate, scheduledDate) => {
    setIsAddingReminder(true); // Start loading
    try {
      await axios.post('https://newportal-backend.onrender.com/admin/reminders', {
        purchaseId,
        propertyName: selectedPurchase.propertyName,
        propertyActualPrice: selectedPurchase.propertyActualPrice,
        amountRemaining,
        nextPaymentDate,
        scheduledDate,
        Clientemail: selectedPurchase.Clientemail,
      });
      // Show SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Reminder added successfully!',
        confirmButtonColor: '#6366f1', // Indigo color
      });
      setIsReminderModalOpen(false);
    } catch (error) {
      toast.error('Error adding reminder. Please try again.');
    } finally {
      setIsAddingReminder(false); // Stop loading
    }
  };

  // Fetch reminders for a purchase
  const fetchReminders = async (purchaseId) => {
    setReminderLoading(true);
    try {
      const response = await axios.get(`https://newportal-backend.onrender.com/admin/reminders/${purchaseId}`);
      setReminders(response.data?.reminders || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setReminderLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-sm:w-screen">
      <h1 className="text-2xl font-bold mb-6">Incomplete Purchases</h1>

      {/* Search Bar and Date Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by property name, client name, phone, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiCalendar className="absolute left-3 top-3 text-gray-400" />
            <input
              type="date"
              placeholder="From Date"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <FiCalendar className="absolute left-3 top-3 text-gray-400" />
            <input
              type="date"
              placeholder="To Date"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FiAlertCircle className="text-6xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No results found.</p>
          <p className="text-gray-500">Try adjusting your search or date filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Property Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Client Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Client Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Client Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount Paid</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actual Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">{purchase.propertyName}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{purchase.ClientfirstName} {purchase.ClientlastName}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{purchase.Clientphone}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{purchase.Clientemail}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{formatAmount(purchase.amount)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{formatAmount(purchase.propertyActualPrice)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-800"
                        onClick={() => {
                          setSelectedPurchase(purchase);
                          setIsReminderModalOpen(true);
                        }}
                      >
                        Add Reminder
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => {
                          setSelectedPurchase(purchase);
                          fetchReminders(purchase._id);
                          setIsViewRemindersModalOpen(true);
                        }}
                      >
                        View Reminders
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reminder Modal */}
      {isReminderModalOpen && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Reminder</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amountRemaining = e.target.amountRemaining.value;
                const nextPaymentDate = e.target.nextPaymentDate.value;
                const scheduledDate = e.target.scheduledDate.value;
                handleAddReminder(selectedPurchase._id, amountRemaining, nextPaymentDate, scheduledDate);
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Amount Remaining</label>
                <input
                  type="number"
                  name="amountRemaining"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Next Payment Date</label>
                <input
                  type="date"
                  name="nextPaymentDate"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Scheduled Date</label>
                <input
                  type="date"
                  name="scheduledDate"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(false)}
                  className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingReminder}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isAddingReminder ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Reminders Modal */}
      {isViewRemindersModalOpen && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Reminders</h2>
            {reminderLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : reminders.length === 0 ? (
              <p className="text-gray-600">No reminders found.</p>
            ) : (
              <div className="space-y-4">
                {reminders.map((reminder, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <p><strong>Amount Remaining:</strong> {formatAmount(reminder.amountRemaining)}</p>
                    <p><strong>Next Payment Date:</strong> {new Date(reminder.nextPaymentDate).toLocaleDateString()}</p>
                    <p><strong>Scheduled Date:</strong> {new Date(reminder.scheduledDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsViewRemindersModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncompletePurchasesPage;