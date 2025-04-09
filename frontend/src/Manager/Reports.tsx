import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import { Line, Pie } from 'react-chartjs-2'; // For charting
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '../DashComponents/Header';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ** Mock Data Constants **

// Sales Data for the report (mock data)
const mockSalesData = [
  { date: '2025-01-01', sales: 500 },
  { date: '2025-01-02', sales: 600 },
  { date: '2025-01-03', sales: 450 },
  { date: '2025-01-04', sales: 700 },
  { date: '2025-01-05', sales: 800 },
];

// Inventory Data for the report (mock data)
const mockInventoryData = [
  { product: 'Product A', quantity: 50, price: 20 },
  { product: 'Product B', quantity: 30, price: 30 },
  { product: 'Product C', quantity: 10, price: 40 },
  { product: 'Product D', quantity: 5, price: 60 },
];

// ** Data Generation Functions **

// Function to generate sales chart data (line chart)
const generateSalesChartData = () => {
  const dates = mockSalesData.map(item => item.date);
  const sales = mockSalesData.map(item => item.sales);

  return {
    labels: dates,
    datasets: [
      {
        label: 'Sales Over Time',
        data: sales,
        borderColor: '#4e73df',
        backgroundColor: 'rgba(78, 115, 223, 0.2)',
        fill: true,
      },
    ],
  };
};

// Function to generate inventory chart data (pie chart)
const generateInventoryChartData = () => {
  const labels = mockInventoryData.map(item => item.product);
  const quantities = mockInventoryData.map(item => item.quantity);

  return {
    labels,
    datasets: [
      {
        data: quantities,
        backgroundColor: ['#ff6f61', '#ffb6b9', '#4e73df', '#36b9cc'],
        hoverBackgroundColor: ['#ff6f61', '#ffb6b9', '#4e73df', '#36b9cc'],
      },
    ],
  };
};

// ** Reports Component **
const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('this_month'); // e.g., 'this_week', 'this_month', 'custom'
  const [salesReport, setSalesReport] = useState(mockSalesData);
  const [inventoryReport, setInventoryReport] = useState(mockInventoryData);

  // Function to handle CSV download (for now just a log)
  const handleDownloadCSV = (reportType: string) => {
    console.log(`Downloading ${reportType} report as CSV`);
  };

  return (
    <>
    <Header />
    <div className="Items-background">
      <Container>
        <h2 className="my-4">Reports</h2>

        {/* Filters */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Control
              as="select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="custom">Custom Date Range</option>
            </Form.Control>
          </Col>
          <Col md={3}>
            <Button onClick={() => handleDownloadCSV('sales')} variant="primary">
              Download Sales Report (CSV)
            </Button>
          </Col>
          <Col md={3}>
            <Button onClick={() => handleDownloadCSV('inventory')} variant="secondary">
              Download Inventory Report (CSV)
            </Button>
          </Col>
        </Row>

        {/* Sales Report Chart */}
        <Row>
          <Col md={6}>
            <h4>Sales Report</h4>
            <Line data={generateSalesChartData()} options={{ responsive: true, plugins: { title: { display: true, text: 'Sales Trends' } } }} />
          </Col>
        </Row>

        {/* Inventory Report Table */}
        <Row className="mt-4">
          <Col>
            <h4>Inventory Report</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {inventoryReport.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Inventory Levels Pie Chart */}
        <Row className="mt-4">
          <Col md={6}>
            <h4>Inventory Levels</h4>
            <Pie data={generateInventoryChartData()} options={{ responsive: true }} />
          </Col>
        </Row>
      </Container>
    </div>
    </>
  );
};

export default Reports;
