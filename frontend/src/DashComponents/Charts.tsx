import React, { FC } from 'react';
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import { Container } from 'react-bootstrap';
import "../CSS/Charts.css";

const Charts: FC = () => {
  // Data for the line chart (mocked)
  const trafficData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Visits',
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        borderWidth: 2, // Thicker lines for visibility
        data: [50, 60, 40, 70, 30, 90, 50],
      },
      {
        label: 'Unique',
        borderColor: '#36a2eb',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: true,
        borderWidth: 2, // Thicker lines for visibility
        data: [40, 50, 30, 60, 20, 80, 40],
      },
    ],
  };

  // Options for the line chart
  const chartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#333', // Darker color for visibility
          font: {
            size: 14, // Larger font size
          },
        },
      },
      y: {
        grid: {
          color: '#e5e5e5',
        },
        ticks: {
          color: '#333', // Darker color for visibility
          stepSize: 50,
          beginAtZero: true,
          font: {
            size: 14, // Larger font size
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smooth curves
      },
      point: {
        radius: 4, // Visible points
        hitRadius: 10,
      },
    },
  };

  return (
  
    <div className="dashboard-container">
      {/* Top Row: Key Metrics Cards */}
    <Container className="Card-container"> 
      <CRow className="ROW">
        <CCol xs={12} md={3}>
          <CCard className="metric-card" style={{ backgroundColor: '#6b48ff' }}>
            <CCardBody>
              <h5 className="metric-title">Users</h5>
              <div className="metric-value">
                26K <span className="metric-change negative">(-12.4% ↓)</span>
              </div>
              <div className="metric-graph">
                <div className="small-graph"></div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={3}>
          <CCard className="metric-card" style={{ backgroundColor: '#00c4ff' }}>
            <CCardBody>
              <h5 className="metric-title">Income</h5>
              <div className="metric-value">
                $6,200 <span className="metric-change positive">(40.9% ↑)</span>
              </div>
              <div className="metric-graph">
                <div className="small-graph"></div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={3}>
          <CCard className="metric-card" style={{ backgroundColor: '#ffaa00' }}>
            <CCardBody>
              <h5 className="metric-title">Conversion Rate</h5>
              <div className="metric-value">
                2.49% <span className="metric-change positive">(84.7% ↑)</span>
              </div>
              <div className="metric-graph">
                <div className="small-graph"></div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={3}>
          <CCard className="metric-card" style={{ backgroundColor: '#ff4d4f' }}>
            <CCardBody>
              <h5 className="metric-title">Sessions</h5>
              <div className="metric-value">
                44K <span className="metric-change negative">(-23.6% ↓)</span>
              </div>
              <div className="metric-graph">
                <div className="small-graph"></div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </Container>
    </div>
  );
};

export default Charts;