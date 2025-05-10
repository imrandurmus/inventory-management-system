import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import './CSS/Landing.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBox, FaFolderOpen, FaTools, FaStar } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import HHeader from "./HHeader";

const Landing = () => {
  const { t } = useTranslation();
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
                {t('landing.main_heading')}
              </h1>
              <p className="landing-main-subheading">
                {t('landing.subheading')}
              </p>
              <div className="landing-main-buttons">
                <Link to="/signup">
                  <Button className='landing-get-started-btn'>{t('landing.get_started')}</Button>
                </Link>
                <Link to="/LearnMore">
                  <Button
                    variant="outline-secondary"
                    className="landing-learn-more-btn"
                  >
                    {t('landing.LM')}
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
        {t('landing.features-heading')}
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
              <h4 className="landing-feature-heading">{t('landing.feature1_title')}</h4>
              <p className="landing-feature-text">
              {t('landing.landing-feature-text')}
              </p>
              <Link to="/LearnMore" className="feature-link">
                {t('landing.LM')} <span className="arrow">→</span>
              </Link>
            </div>
          </Col>

          {/* Feature 2 */}
          <Col md={12} className="mb-4">
            <div className="landing-feature-item">
              <div className="feature-icon">
                <FaFolderOpen /> {/* Using FaFolderOpen icon */}
              </div>
              <h4 className="landing-feature-heading">{t('landing.landing-feature-heading')}</h4>
              <p className="landing-feature-text">
              {t('landing.landing-feature-text2')}
              </p>
              <Link to="/LearnMore" className="feature-link">
              {t('landing.LM')} <span className="arrow">→</span>
              </Link>
            </div>
          </Col>

          {/* Feature 3 */}
          <Col md={12} className="mb-4">
            <div className="landing-feature-item">
              <div className="feature-icon">
                <FaTools /> {/* Using FaTools icon */}
              </div>
              <h4 className="landing-feature-heading">{t('landing.landing-feature-heading3')}</h4>
              <p className="landing-feature-text">
              {t('landing.landing-feature-text3')}
              </p>
              <Link to="/SignUp" className="feature-link">
              {t('landing.GS')} <span className="arrow">→</span>
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
        <h2 className="Features-Title"> {t('landing.Features-Title')}</h2>
        <p className="Features-description">
        {t('landing.Features-description')}
        </p>
        <Row className="mt-4">
          <Col md={6}>
            <h4 className="feature-subheading">{t('landing.CS')}</h4>
            <p>{t('landing.feature-subheading')}</p>
          </Col>
          <Col md={6}>
            <h4 className="feature-subheading">{t('landing.RTI')}</h4>
            <p>{t('landing.feature-subheading2')}</p>
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
          {t('landing.testimonial-textt')}
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
        <h2  className="values-text">{t('landing.Core-Values')}</h2>
        <p>
        {t('landing.valuestext')}
        </p>
        <p> {t('landing.valuestext1')}
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
        <p>{t('landing.footer-company')}</p>
      </Col>

      {/* Middle Column - Quick Links */}
      <Col md={4} className="footer-links">
        <h5>{t('landing.QL')}</h5>
        <ul>
          <li><Link to="/aboutus">{t('landing.AU')}</Link></li>
          <li><Link to="/contact">{t('landing.CU')}</Link></li>
          <li><Link to="/privacy-policy">{t('landing.PP')}</Link></li>
        </ul>
      </Col>

      {/* Right Column - Social Media */}
      <Col md={4} className="footer-social">
        <h5>{t('landing.QL')}</h5>
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
