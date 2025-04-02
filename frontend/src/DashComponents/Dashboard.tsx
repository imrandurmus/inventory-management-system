import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Charts from './Charts'; 
import Header from './Header';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <Container className='DashboardContainer'>
      <Header />
      <Row className="mt-5"> {/* Adds margin-top */}
        <Charts />
      </Row>
    </Container>
  );
};

export default Dashboard;
