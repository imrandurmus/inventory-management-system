import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-page" style={{ overflowX: "hidden", display: "flex", flexDirection: "column", alignItems: "center", width: "100vw", minHeight: "auto" }}>
      {/* Header Section - Same as Landing Page */}
      <div className="header" style={{ width: "100%" }}>
        <div className="header-image">
          <Link to="/">
            <img src="/logo_png.png" alt="Clickable image redirects back to landing page. Logo of the website, a pink outline of a box" />
          </Link>
        </div>
        <div className="top-right-options">
          <Row>
            <Col>
              <div className="header-buttons">
                <Link to="/aboutus">
                  <Button variant="">About Us</Button>
                </Link>
                <Link to="/features">
                  <Button variant="">Features</Button>
                </Link>
                <Link to="/login">
                  <Button variant="">Login</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="about-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">About SIMple</h1>
          <p className="hero-subtitle">Empowering Businesses with Seamless Inventory Management</p>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <h2 className="mission-title">Our Mission</h2>
          <p>
            At SIMple, we strive to simplify inventory management for growing businesses,
            helping them optimize their stock, reduce waste, and boost sales through an
            easy-to-use platform.
          </p>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-container">
            <div className="team-member">
              <img src="/imran.png" alt="Imran" />
              <h3>Imran</h3>
              <p>Group Leader & Backend Lead</p>
            </div>
            <div className="team-member">
              <img src="/Afagh.png" alt="Afagh" />
              <h3>Afagh</h3>
              <p>Front-End Lead</p>
            </div>
            <div className="team-member">
              <img src="/team_member_3.png" alt="Oussema" />
              <h3>Oussema</h3>
              <p>Testing Lead</p>
            </div>
            <div className="team-member">
              <img src="/team_member_3.png" alt="Jihad" />
              <h3>Jihad</h3>
              <p>Documentation Lead</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section" style={{ padding: "10px 0" }}>
        <Container fluid className="text-center">
          <Row className="backgroundcta">
            <Col md={8} className="cta-content">
              <div className="cta-box">
                <p>Join SIMple and take control of your inventory today!</p>
              </div>
              <Link to="/signup">
                <Button variant=""className="main-signup-button">Get Started</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>© 2025 SIMple. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default AboutUs;
