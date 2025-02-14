import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ReferralChart = ({ username }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch(`https://newportal-backend.onrender.com/consult/referrals/${username}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.dashboardData;

                console.log(data)
                
                const dates = data.map(entry => new Date(entry.date).toLocaleDateString());
                const consultantCounts = data.map(entry => entry.consultantCount);
                const clientCounts = data.map(entry => entry.clientCount);

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Consultants Referred',
                            data: consultantCounts,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                        },
                        {
                            label: 'Clients Referred',
                            data: clientCounts,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: true,
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchChartData();
    }, [username]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Referral Performance</h2>
            <Line data={chartData} />
        </div>
    );
};

export default ReferralChart;
