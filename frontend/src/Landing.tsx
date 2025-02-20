//import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Landing.css";
const Landing = ({ onSignIn }: { onSignIn: () => void }) => {

//const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <Container className="text-center">
          <Row>
            <Col md={8} className="mx-auto">
              <h1 className="hero-title">SIMple</h1>
              <h2>Inventory Management for Growing Businesses</h2>
              <p className="hero-subtitle">
                Increase your sales and keep track of every unit with our powerful stock management, order fulfillment, and inventory control software.
              </p>
              <div className="hero-buttons">
                <Button variant="primary" className="me-3">Sign Up - It's Free</Button>
                <Button variant="outline-primary" onClick={onSignIn} className="w-1" >Sign In</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="features-section text-center">
        <Row>
          <Col md={4}>
            <h3>Increase Sales</h3>
            <p>Track. Manage. Optimize.</p>
          </Col>
          <Col md={4}>
            <h3>Manage Orders</h3>
            <p>Handle online and offline orders in one place.</p>
          </Col>
          <Col md={4}>
            <h3>Track Inventory</h3>
            <p>Track items with batch and serial number tracking.</p>
          </Col>
        </Row>
      </Container>

      <div className="cta-section">
        <Container className="text-center">
            <h1>Effortless Inventory, Maximum Control.</h1>
          <h2>Run a More Efficient Business</h2>
        </Container>
      </div>

      <div className="footer">
        <Container className="text-center">
          <p>© 2025 SIMple. All Rights Reserved.</p>
        </Container>
      </div>
    </div>
  );
};

export default Landing;
