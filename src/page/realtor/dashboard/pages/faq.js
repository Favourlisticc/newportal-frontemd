import React, { useState, useEffect } from "react";

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('https://newportal-backend.onrender.com/realtor/faqs');
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFAQs();
  }, []);

  const toggleAnswer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 m-4">
      <div className="w-full lg:w-3/4 mx-auto p-6 max-sm:p-0">
        <h1 className="text-2xl font-bold mb-6">All FAQ</h1>
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => ( 
            <div
              key={faq._id} // Assuming your FAQ model has an _id field
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
              onClick={() => toggleAnswer(index)}
            >
              <h2 className="font-semibold text-gray-800">
                {index + 1}) {faq.question}
              </h2>
              {expandedIndex === index && (
                <p className="mt-2 text-gray-600">
                  {faq.answer || "No answer available"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}