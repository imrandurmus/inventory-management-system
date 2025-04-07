import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./CSS/AboutUs.css";
import HHeader from "./HHeader";
import { useEffect } from "react";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);
  return (
    <div className="about-page" style={{ overflowX: "hidden", display: "flex", flexDirection: "column", alignItems: "center", width: "100vw", minHeight: "auto" }}>
      {/* Header Section - Same as Landing Page */}
       <HHeader /> 
      
      {/* Main Content */}
      <div className="about-container">
        {/* Mission Section */}
        <div className="mission-section">
          <h2 className="mission-title">Our Mission</h2>
          <p>
            SIMple strives to simplify inventory management for growing businesses, <br />
            helping them optimize their stock, reduce waste, and boost sales through an
            easy-to-use platform.
          </p>
        </div>

        

{/* Team Section */}
<div className="team-section">
          <h2>Meet Our Team</h2>
         </div>
      </div>
      <div className="mission-compartments">
        <div className="compartment-wrapper">
          <div className="compartmentt"></div>
          <h3>Jihad <br/> Documentation</h3>
        </div>
       
        <div className="compartment-wrapper">
          <div className="compartmentt"></div>
          <h3>Afagh<br/>Frontend Lead</h3>
        </div>
        <div className="compartment-wrapper">
          <div className="compartmentt"></div>
          <h3>Imran<br/>Backend Lead</h3>
        </div>
      </div>

{/* Timeline Section */}
<div className="timeline-section">
  <Container>
    <h2 className="timeline-title">Our Journey Through Time and Innovation</h2>
    <p className="timeline-description">
      Since our inception, we have been committed to revolutionizing inventory management. Our milestones reflect our growth and dedication to excellence.
    </p>
    <div className="timeline">
      {/* Existing Timeline Item (2013) */}
      <div className="timeline-item">
        <div className="timeline-year">2013</div>
        <div className="timeline-dot"></div>
        <div className="timeline-details">
          <p>
            We launched the first inventory management software, setting a new standard in the industry. This marked the beginning of our journey.
          </p>
        </div>
      </div>
{/* Existing Timeline Item (2015) */}
      <div className="timeline-item">
        <div className="timeline-year">2015</div>
        <div className="timeline-dot"></div>
        <div className="timeline-details">
          <p>
          With a strategic vision for growth, the company is dedicating substantial resources to broadening its investor network and securing the necessary capital for future development.
          </p>
        </div>
      </div>
      
      {/* New Timeline Item (2018) */}
      <div className="timeline-item">
        <div className="timeline-year">2018</div>
        <div className="timeline-dot"></div>
        <div className="timeline-details">
          <p>
            Expanded our software to support multi-channel inventory management, helping businesses scale efficiently.
          </p>
        </div>
      </div>
    </div>
  </Container>
</div>

{/* Call to Action */}
    <div className="cta-section" style={{ padding: "10px 0" }}>
      <Container fluid className="text-center">
        <Row className="backgroundcta">
          <Col md={8} className="cta-content">
            <div className="cta-box">
              <p>Join and take control of your inventory today!</p>
              <Link to="/SignUp">
                  <Button variant="primary" className="landing-get-started-btn">
                    Get Started
                  </Button>
                </Link>
            </div>
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
