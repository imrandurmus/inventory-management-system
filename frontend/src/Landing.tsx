import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Landing.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBox, FaFolderOpen, FaTools, FaStar } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import HHeader from "./HHeader";
const Landing = () => {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [animateStats, setAnimateStats] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimateStats(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Header Section */}
       <HHeader /> 

      {/* Main Section */}
      <div className="landing-main-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="landing-main-heading">
                Streamline Your Inventory Management Effortlessly
              </h1>
              <p className="landing-main-subheading">
              Transform your inventory processes with our intuitive and simple software, saving you time and reducing errors. Experience 
                seamless tracking and management, empowering your business to thrive.
                effortlessly.
              </p>
              <div className="landing-main-buttons">
                <Link to="/signup">
                  <Button variant="primary" className="landing-get-started-btn">
                    Get Started
                  </Button>
                </Link>
                <Link to="/LearnMore">
                  <Button
                    variant="outline-secondary"
                    className="landing-learn-more-btn"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </Col>
            <Col md={6} className="text-center">
        <div className="landing-decorative-graphic">
          <img
            className="landing-graphic-image"
          />
        </div>
      </Col>
          
          </Row>
        </Container>
      </div>


{/* Features Section */}
<div className="landing-features-section">
  <Container>
    <Row className="align-items-center">
      {/* Left Column: Large Heading */}
      <Col md={6}>
        <h2 className="features-heading">
          Experience Real-Time Tracking for Effortless Inventory Management and Control
        </h2>
      </Col>

      {/* Right Column: Feature Items */}
      <Col md={6}>
        <Row>
          {/* Feature 1 */}
          <Col md={12} className="mb-4">
            <div className="landing-feature-item">
              <div className="feature-icon">
                <FaBox /> {/* Using FaBox icon from react-icons */}
              </div>
              <h4 className="landing-feature-heading">Generate Automatic Reports to Streamline Your Inventory Insights Instantly</h4>
              <p className="landing-feature-text">
                Stay informed with up-to-the-minute data on your inventory status.
              </p>
              <Link to="/LearnMore" className="feature-link">
                Learn More <span className="arrow">→</span>
              </Link>
            </div>
          </Col>

          {/* Feature 2 */}
          <Col md={12} className="mb-4">
            <div className="landing-feature-item">
              <div className="feature-icon">
                <FaFolderOpen /> {/* Using FaFolderOpen icon */}
              </div>
              <h4 className="landing-feature-heading">Multi-Channel Support for Seamless Integration Across All Your Sales Platforms</h4>
              <p className="landing-feature-text">
                Connect effortlessly with various sales channels to enhance your operations.
              </p>
              <Link to="/LearnMore" className="feature-link">
                Learn More <span className="arrow">→</span>
              </Link>
            </div>
          </Col>

          {/* Feature 3 */}
          <Col md={12} className="mb-4">
            <div className="landing-feature-item">
              <div className="feature-icon">
                <FaTools /> {/* Using FaTools icon */}
              </div>
              <h4 className="landing-feature-heading">Optimize Your Workflow with Our Comprehensive Inventory Management Solutions</h4>
              <p className="landing-feature-text">
                Transform your inventory management process with our innovative software features.
              </p>
              <Link to="/SignUp" className="feature-link">
                Get Started <span className="arrow">→</span>
              </Link>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  </Container>
</div>




 






{/* Features Section */}

<div className="landing-Features-section" ref={statsRef}>
  <Container>
    <Row className="align-items-center">
      {/* Left Column: Text Content */}
      <Col md={6} className="Features-text">
        <h2 className="Features-Title">Unlock Efficiency and Growth with Our Advanced Inventory Management Software</h2>
        <p className="Features-description">
          Our software streamlines inventory processes, reducing errors and saving time. Experience improved accuracy and enhanced decision-making for your business.
        </p>
        <Row className="mt-4">
          <Col md={6}>
            <h4 className="feature-subheading">Cost Savings</h4>
            <p>Minimize excess inventory and cut costs with precise stock management.</p>
          </Col>
          <Col md={6}>
            <h4 className="feature-subheading">Real-Time Insights</h4>
            <p>Make informed decisions with up-to-date data at your fingertips.</p>
          </Col>
        </Row>
        <div className="mt-5">
          <div className="star-rating">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <p className="testimonial-textt">
            "This software has transformed our inventory management process. We've seen a significant reduction in errors and improved efficiency across the board."
          </p>
          <div className="testimonial-author">
            <div>
              <p className="author-name">Jane Doe</p>
              <p className="author-title">Operations Manager, ABC Corp</p>
            </div>
          </div>
        </div>
      </Col>

      {/* Right Column: Image */}
      <Col md={6} className="Features-image">
        <img src="/happyCoworkers.jpg" alt="Team working" />
      </Col>
    </Row>
  </Container>
</div>





 {/* Core Values Section */}

 <div className="landing-values-section" ref={statsRef}>
  <Container className="values">
    <Row>
      <Col>
        <h2  className="values-text">Our Core Values</h2>
        <p>
          We believe in delivering simple, powerful, and reliable inventory
          management solutions. Our mission is to help businesses thrive by making
          their inventory processes efficient and stress-free.
        </p>
        <p>
          With years of experience and a passionate team, we are dedicated to
          providing top-notch tools for businesses of all sizes.
        </p>
      </Col>
    </Row>
  </Container>
</div>




     {/* Footer Section */}
<div className="landing-footer">
  <Container>
    <Row>
      {/* Left Column - Company Info */}
      <Col md={4} className="footer-company">
        <h5>SIMple Inventory</h5>
        <p>Streamline your business with our modern inventory management solution.</p>
      </Col>

      {/* Middle Column - Quick Links */}
      <Col md={4} className="footer-links">
        <h5>Quick Links</h5>
        <ul>
          <li><Link to="/aboutus">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
        </ul>
      </Col>

      {/* Right Column - Social Media */}
      <Col md={4} className="footer-social">
        <h5>Follow Us</h5>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={20} />
          </a>
        </div>
      </Col>
    </Row>

    <hr />

    {/* Bottom Footer - Copyright */}
    <Row>
      <Col className="text-center">
        <p>© 2025 SIMple Inventory. All Rights Reserved.</p>
      </Col>
    </Row>
  </Container>
</div>




    </div>
  );
};

export default Landing;
