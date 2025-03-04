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
                const response = await fetch(`https://newportal-backend.onrender.com/realtor/referrals/${username}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json(); // Parse JSON response
                console.log('Fetched data:', data); // Log data for debugging

                const dates = data.map(entry => new Date(entry.date).toLocaleDateString());
                const realtorCounts = data.map(entry => entry.realtorCount);
                const clientCounts = data.map(entry => entry.clientCount);
                const balances = data.map(entry => entry.balance);
                const fundings = data.map(entry => entry.funding);
                const directCommissions = data.map(entry => entry.directCommission);
                const indirectCommissions = data.map(entry => entry.indirectCommission);

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Realtor Referred',
                            data: realtorCounts,
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
                        },
                        {
                            label: 'Balance',
                            data: balances,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            fill: true,
                        },
                        {
                            label: 'Funding',
                            data: fundings,
                            borderColor: 'rgba(255, 206, 86, 1)',
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            fill: true,
                        },
                        {
                            label: 'Direct Commission',
                            data: directCommissions,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            fill: true,
                        },
                        {
                            label: 'Indirect Commission',
                            data: indirectCommissions,
                            borderColor: 'rgba(255, 159, 64, 1)',
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Referral Performance Over Time',
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Referral Performance</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default ReferralChart;