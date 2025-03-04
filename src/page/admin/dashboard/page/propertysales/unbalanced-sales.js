import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IncompletePurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isViewRemindersModalOpen, setIsViewRemindersModalOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [reminderLoading, setReminderLoading] = useState(true);

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

  // Handle search
  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.Clientemail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a reminder
  const handleAddReminder = async (purchaseId, amountRemaining, nextPaymentDate,) => {
    try {
      await axios.post('https://newportal-backend.onrender.com/admin/reminders', {
        purchaseId,
        propertyName: selectedPurchase.propertyName,
        propertyActualPrice: selectedPurchase.propertyActualPrice,
        amountRemaining,
        nextPaymentDate,
        Clientemail: selectedPurchase.Clientemail
      });
      toast.success('Reminder added successfully!');
      setIsReminderModalOpen(false);
    } catch (error) {
      toast.error('Error adding reminder. Please try again.');
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Incomplete Purchases</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by property name or client email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Property Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Client Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount Paid</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actual Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td className="px-6 py-4">{purchase.propertyName}</td>
                  <td className="px-6 py-4">{purchase.Clientemail}</td>
                  <td className="px-6 py-4">₦{purchase.amount}</td>
                  <td className="px-6 py-4">₦{purchase.propertyActualPrice}</td>
                  <td className="px-6 py-4">
                    <button
                      className="text-indigo-600 hover:text-indigo-800 mr-4"
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
                handleAddReminder(selectedPurchase._id, amountRemaining, nextPaymentDate);
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save
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
                    <p><strong>Amount Remaining:</strong> ₦{reminder.amountRemaining}</p>
                    <p><strong>Next Payment Date:</strong> {new Date(reminder.nextPaymentDate).toLocaleDateString()}</p>
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