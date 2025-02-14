import React, { useEffect, useState } from 'react';

const RemindersTable = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = JSON.parse(localStorage.getItem('Clientuser'));
        const clientEmail = data.email; // Assuming the email is stored in the 'email' field

        console.log(data);

        const response = await fetch(`https://newportal-backend.onrender.com/client/reminders?email=${clientEmail}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setReminders(result);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-xl">No Payment Reminders</p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Your Reminders</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property Actual Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Remaining
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Next Payment Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reminders.map((reminder, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reminder.propertyName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${reminder.propertyActualPrice}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${reminder.reminders[0].amountRemaining}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(reminder.reminders[0].nextPaymentDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RemindersTable;