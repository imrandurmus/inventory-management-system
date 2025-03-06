import React, { useState } from "react";
import "./DashboardPage.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState("today");

  const pieData = {
    labels: ["Active Items", "Inactive Items"],
    datasets: [
      {
        data: [70, 30], // Example percentage of active/inactive items
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-row">
        {/* Sales Activity Box */}
        <div className="dashboard-box sales-activity">
          <h3>Sales Activity</h3>
          <div className="box-container">
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">TO BE PACKED</span>
            </div>
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">TO BE SHIPPED</span>
            </div>
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">TO BE DELIVERED</span>
            </div>
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">TO BE INVOICED</span>
            </div>
          </div>
        </div>

        {/* Inventory Summary Box */}
        <div className="dashboard-box inventory-summary">
          <h3>Inventory Summary</h3>
          <div className="box-container">
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">Quantity In Hand</span>
            </div>
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">Quantity To Be Received</span>
            </div>
          </div>
        </div>

        {/* Item Details Box */}
        <div className="dashboard-box item-details">
          <h3>Item Details</h3>
          <div className="box-container">
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">Low Stock Items</span>
            </div>
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">All Item Groups</span>
            </div>
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">All Items</span>
            </div>
            <div className="pie-chart-container">
              <Pie data={pieData} />
            </div>
          </div>
        </div>

        {/* Purchase Order Box */}
        <div className="dashboard-box purchase-order">
          <h3>Purchase Order</h3>
          <div className="dropdown-container">
            <label htmlFor="filter">Filter by:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_year">Last Year</option>
            </select>
          </div>
          <div className="box-container">
            <div className="sub-box">
              <span className="counter">0</span>
              <span className="label">Quantity Ordered</span>
            </div>
            <div className="sub-box">
              <span className="counter">0 TRY</span>
              <span className="label">Total Cost</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
