import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import './CSS/AboutUs.css';
import HHeader from "./HHeader";

const AboutUs = () => {
  const { t } = useTranslation(); // Hook to fetch translations

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
          <h2 className="mission-title">{t("aboutUs.missionTitle")}</h2>
          <p>
            {t("aboutUs.missionDescription")}
          </p>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>{t("aboutUs.meetOurTeam")}</h2>
        </div>
      </div>

      <div className="mission-compartments">
        <div className="compartment-wrapper">
          <div className="compartmentt"></div>
          <h3>{t("aboutUs.teamMembers.jihad.name")} <br /> {t("aboutUs.teamMembers.jihad.role")}</h3>
        </div>

        <div className="compartment-wrapper">
          <div className="compartmentt"></div>
          <h3>{t("aboutUs.teamMembers.afagh.name")} <br /> {t("aboutUs.teamMembers.afagh.role")}</h3>
        </div>

        <div className="compartment-wrapper">
          <div className="compartmentt"></div>
          <h3>{t("aboutUs.teamMembers.imran.name")} <br /> {t("aboutUs.teamMembers.imran.role")}</h3>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-section">
        <Container>
          <h2 className="timeline-title">{t("aboutUs.timelineTitle")}</h2>
          <p className="timeline-description">
            {t("aboutUs.timelineDescription")}
          </p>
          <div className="timeline">
            {/* Timeline Item 2013 */}
            <div className="timeline-item">
              <div className="timeline-year">2013</div>
              <div className="timeline-dot"></div>
              <div className="timeline-details">
                <p>{t("aboutUs.timeline.2013")}</p>
              </div>
            </div>

            {/* Timeline Item 2015 */}
            <div className="timeline-item">
              <div className="timeline-year">2015</div>
              <div className="timeline-dot"></div>
              <div className="timeline-details">
                <p>{t("aboutUs.timeline.2015")}</p>
              </div>
            </div>

            {/* Timeline Item 2018 */}
            <div className="timeline-item">
              <div className="timeline-year">2018</div>
              <div className="timeline-dot"></div>
              <div className="timeline-details">
                <p>{t("aboutUs.timeline.2018")}</p>
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
                <p>{t("aboutUs.ctaText")}</p>
                <Link to="/SignUp">
                  <Button variant="primary" className="landing-get-started-btn">
                    {t("aboutUs.ctaButtonText")}
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
