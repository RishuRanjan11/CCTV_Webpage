import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminStyles.css';
import axios from '../../lib/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    firstTimeBuyers: 0,
    totalOrders: 0,
    totalSales: 0,
    orderStatusCounts: {
      pending: 0,
      shipped: 0,
      delivered: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [chartView, setChartView] = useState('month'); // 'day', 'month', 'year'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/admin/dashboard', {
          params: {
            ...dateRange, // For cards
            groupBy: chartView, // For chart
            year: selectedYear,
            month: selectedMonth,
          },
        });
        const data = response.data;

        setStats({
          users: data.totalUsers || 0,
          products: data.totalProducts || 0,
          firstTimeBuyers: data.firstTimeBuyers || 0,
          totalOrders: data.totalOrders || 0,
          totalSales: data.totalSales || 0,
          orderStatusCounts: data.orderStatusCounts || { pending: 0, shipped: 0, delivered: 0 },
        });

        // Process data for the chart
        let labels = [];
        if (data.salesData) {
          if (chartView === 'year') {
            labels = data.salesData.map((d) => d._id);
          } else if (chartView === 'month') {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            labels = data.salesData.map((d) => monthNames[d._id - 1]);
          } else { // day
            labels = data.salesData.map((d) => d._id);
          }
        }

        const salesValues = data.salesData.map(d => d.totalSales);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Sales',
              data: salesValues,
              borderColor: '#f0a500',
              backgroundColor: 'rgba(240, 165, 0, 0.2)',
            },
          ],
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [dateRange, chartView, selectedYear, selectedMonth]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const resetDateFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Over Time',
      },
    },
  };

  return (
    <AdminLayout>
      <main className="admin-main">
        <div className="admin-page">
          <h2>Admin Dashboard</h2>

          <div className="admin-filters">
            <label>
              Start Date:
              <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} className="filter-input" />
            </label>
            <label>
              End Date:
              <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} className="filter-input" />
            </label>
            <button onClick={resetDateFilter} className="filter-reset-btn">
              Reset Dates
            </button>
          </div>

          {loading ? (
            <p>Loading stats...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="admin-cards">
              <div className="admin-card">
                <h3>Total Users</h3>
                <p>{stats.users}</p>
              </div>
              <div className="admin-card">
                <h3>First-Time Buyers</h3>
                <p>{stats.firstTimeBuyers}</p>
              </div>
              <div className="admin-card">
                <h3>Total Products</h3>
                <p>{stats.products}</p>
              </div>
              <div className="admin-card">
                <h3>Total Orders</h3>
                <p>{stats.totalOrders}</p>
              </div>
              <div className="admin-card">
                <h3>Pending Orders</h3>
                <p>{stats.orderStatusCounts.pending}</p>
              </div>
              <div className="admin-card">
                <h3>Shipped Orders</h3>
                <p>{stats.orderStatusCounts.shipped}</p>
              </div>
              <div className="admin-card">
                <h3>Delivered Orders</h3>
                <p>{stats.orderStatusCounts.delivered}</p>
              </div>
              <div className="admin-card">
                <h3>Total Sales</h3>
                <p>₹{stats.totalSales.toFixed(2)}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="admin-chart-container">
              <div className="admin-chart-filters">
                <label>
                  Group By:
                  <select value={chartView} onChange={(e) => setChartView(e.target.value)} className="filter-select">
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </label>
                {(chartView === 'day' || chartView === 'month') && (
                  <label>
                    Year:
                    <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="filter-input" />
                  </label>
                )}
                {chartView === 'day' && (
                  <label>
                    Month:
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="filter-select">
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              <Bar options={chartOptions} data={chartData} />
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;
