import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header";
import { People, ShoppingCart, Notifications, Inventory } from "@mui/icons-material"; // MUI icons
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; // Import Recharts components
import "../CSS/Dashboard.css";

const Dashboard: React.FC = () => {

  // Mock data for the stats (replace with actual data from your API)
  const stats = {
    ToBePacked: {
      value: "221",
      icon: <Inventory />,
      text: "Qty",
    },
    OnRoute: {
      value: "2350",
      icon: <People />,
      text: "Packages",
    },
    sales: {
      value: "+1,234",
      icon: <ShoppingCart />,
      text: "Qty",
    },
    ToBeShipped: {
      value: "573",
      icon: <Notifications />,
      text: "Packages",
    },
  };

  //pie chart data
  const pieChartData1 = [
    { name: 'To Be Packed', value: 221 },
    { name: 'On Route', value: 2350 },
    { name: 'Sales', value: 1234 },
    { name: 'To Be Shipped', value: 573 },
  ];
  const pieChartData2 = [
    { name: 'Low Stock', value: 201 },
    { name: 'In Stock', value: 250 },
    { name: 'Out of Stock', value: 14 },
  ];

  //colors for the chart slices
  const COLORS = ['#6A0DAD', '#9B30FF', '#800080', '#9932CC'];

  // Mock data for Top Selling Items
  const topSellingItems = [
    { name: "Item A", quantity: 234 },
    { name: "Item B", quantity: 182 },
    { name: "Item C", quantity: 150 },
    { name: "Item D", quantity: 130 },
  ];

  return (
  <>
  <Header />
    <div className="dashboard-background">
      <Container className="dashboardContainer">
        

        {/* stats section */}
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
                  <p className="statt-change">{stat.change}</p>
                  <div className="Bottom-stats-text">{stat.text}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <Row>
          {/* 1st pie chart */}
          <Col md={4}>
            <div className="pie-chart-section">
              <h2>Statistics</h2>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </Col>

          {/* 2nd p chart */}
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </Col>

          {/* top selling items section */}
          <Col md={4}>
            <div className="top-selling-items">
              <h2>Top Selling Items</h2>
              <ul className="top-selling-list">
                {topSellingItems.map((item, index) => (
                  <li key={index} className="top-selling-item">
                    <span>{item.name}</span> <span>{item.quantity} sold</span>
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
