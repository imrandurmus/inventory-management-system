import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header";
import {
  People,
  ShoppingCart,
  Notifications,
  Inventory,
} from "@mui/icons-material"; // MUI icons
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import Recharts components
import "../CSS/Dashboard.css";
import { getDashboardMetrics, DashboardMetrics } from "../../services/api";

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="dashboard-background">
          <Container className="dashboardContainer">
            <div className="loading-message">Loading dashboard data...</div>
          </Container>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="dashboard-background">
          <Container className="dashboardContainer">
            <div className="error-message">{error}</div>
          </Container>
        </div>
      </>
    );
  }

  if (!metrics) {
    return null;
  }

  const stats = {
    TotalInventory: {
      value: metrics.totalInventory.toString(),
      icon: <Inventory />,
      text: "Qty",
    },
    ProductTypes: {
      value: metrics.productTypes.toString(),
      icon: <People />,
      text: "Types",
    },
    sales: {
      value: `+${metrics.totalSales}`,
      icon: <ShoppingCart />,
      text: "Qty",
    },
    TotalInventoryValue: {
      value: `$${metrics.totalInventoryValue.toFixed(2)}`,
      icon: <Notifications />,
      text: "Value",
    },
  };

  // Convert product type distribution to pie chart data
  const pieChartData1 = Object.entries(metrics.productTypeDistribution).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Convert stock count distribution to pie chart data
  const pieChartData2 = Object.entries(metrics.stockCountDistribution).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Colors for the chart slices
  const COLORS = ["#6A0DAD", "#9B30FF", "#800080", "#4B0082", "#8A2BE2"];

  return (
    <>
      <Header />
      <div className="dashboard-background">
        <Container className="dashboardContainer">
          {/* Stats section */}
          <div className="Summary">
            <h1 className="Summary-title">Summary</h1>
            <Row>
              {Object.entries(stats).map(([key, stat], index) => (
                <Col xs={12} md={6} lg={3} key={index} className="mb-4">
                  <div className="statt-card">
                    <div className="statt-header">
                      <span className="statt-icon">{stat.icon}</span>
                      <span className="statt-label">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </span>
                    </div>
                    <h3 className="statt-value">{stat.value}</h3>
                    <div className="Bottom-stats-text">{stat.text}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          <Row>
            {/* 1st pie chart - Product Types */}
            <Col md={4}>
              <div className="pie-chart-section">
                <h2>Product Types</h2>
                <PieChart width={400} height={400}>
                  <Pie
                    data={pieChartData1}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                  >
                    {pieChartData1.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </Col>

            {/* 2nd pie chart - Stock Distribution */}
            <Col md={4}>
              <div className="pie-chart-section">
                <h2>Stock Count</h2>
                <PieChart width={400} height={400}>
                  <Pie
                    data={pieChartData2}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                  >
                    {pieChartData2.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </Col>

            {/* Top selling items section */}
            <Col md={4}>
              <div className="top-selling-items">
                <h2>Top Selling Items</h2>
                <ul className="top-selling-list">
                  {metrics.topSellingItems.map((item, index) => (
                    <li key={index} className="top-selling-item">
                      <span>{item.itemName}</span>{" "}
                      <span>{item.soldCount} sold</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
