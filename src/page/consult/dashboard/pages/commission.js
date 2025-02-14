import React, { useState, useEffect } from "react";

const CommissionPage = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const consultantData = JSON.parse(localStorage.getItem('consultData'));
  const consultantId = consultantData?._id;

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const response = await fetch(`https://newportal-backend.onrender.com/consult/view-commission?consultantId=${consultantId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('consultJwt')}`
          }
        });
        const data = await response.json();
        setCommissions(data);
      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (consultantId) {
      fetchCommissions();
    }
  }, [consultantId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#002657' }}>My Commissions</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#E5B305' }}></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-sm font-semibold text-left border border-gray-200" style={{ backgroundColor: '#002657', color: 'white' }}>No</th>
                <th className="p-3 text-sm font-semibold text-left border border-gray-200" style={{ backgroundColor: '#002657', color: 'white' }}>Type</th>
                <th className="p-3 text-sm font-semibold text-left border border-gray-200" style={{ backgroundColor: '#002657', color: 'white' }}>Amount</th>
                <th className="p-3 text-sm font-semibold text-left border border-gray-200" style={{ backgroundColor: '#002657', color: 'white' }}>Client Name</th>
                <th className="p-3 text-sm font-semibold text-left border border-gray-200" style={{ backgroundColor: '#002657', color: 'white' }}>Client Phone</th>
                <th className="p-3 text-sm font-semibold text-left border border-gray-200" style={{ backgroundColor: '#002657', color: 'white' }}>Property Name</th>
                <th className="p-3 text-sm font-semibold text-left border border-gray-200" style={{ backgroundColor: '#002657', color: 'white' }}>Amount Paid</th>
                <th className="p-3 text-sm font-semibold text-left border border-gray-200" style={{ backgroundColor: '#002657', color: 'white' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((commission, index) => (
                <tr key={commission._id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm border border-gray-200">{index + 1}</td>
                  <td className="p-3 text-sm border border-gray-200 capitalize">{commission.type}</td>
                  <td className="p-3 text-sm border border-gray-200 font-medium" style={{ color: '#E5B305' }}>
                    ₦{commission.amount.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm border border-gray-200">
                    {commission.clientDetails.firstName} {commission.clientDetails.lastName}
                  </td>
                  <td className="p-3 text-sm border border-gray-200">{commission.clientDetails.phone}</td>
                  <td className="p-3 text-sm border border-gray-200">{commission.propertyDetails.propertyName}</td>
                  <td className="p-3 text-sm border border-gray-200">
                    ₦{commission.propertyDetails.amountPaid.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm border border-gray-200">{formatDate(commission.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {commissions.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No commissions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommissionPage;