import { Container, Row, Col } from "react-bootstrap";
import WBGHeader from "./WBGHeader";
import { useEffect } from "react";
import "./CSS/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);
  return (
    <div className="privacy-policy-page">
      {/* Header Section */}
      <WBGHeader />

      {/* Main Content */}
      <Container className="privacy-policy-container">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h1 className="privacy-policy-title">Privacy Policy</h1>
            <p className="last-updated">Last Updated: January 3, 2022</p>

            <section className="policy-section">
              <h2>1. Introduction</h2>
              <p>
                Welcome to SIMple ("we," "us," or "our"). We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our inventory management platform and services.
              </p>
            </section>

            <section className="policy-section">
              <h2>2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li>
                  <strong>Personal Information:</strong> This includes your name, email address, phone number, and billing information when you sign up for our services.
                </li>
                <li>
                  <strong>Usage Data:</strong> We collect information about how you interact with our platform, such as IP address, browser type, pages visited, and time spent on our site.
                </li>
                <li>
                  <strong>Inventory Data:</strong> Information you input into our platform, such as stock details, product descriptions, and transaction history.
                </li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li>To provide, maintain, and improve our services.</li>
                <li>To process transactions and send you related information, such as confirmations and invoices.</li>
                <li>To communicate with you, including responding to your inquiries and providing customer support.</li>
                <li>To send you updates, marketing communications, and promotional offers (you can opt out at any time).</li>
                <li>To monitor and analyze usage patterns to enhance user experience.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>4. How We Share Your Information</h2>
              <p>We do not sell or rent your personal information to third parties. We may share your information in the following cases:</p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> We may share your information with third-party service providers who assist us in operating our platform (e.g., payment processors, hosting providers).
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights, safety, or property.
                </li>
                <li>
                  <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                </li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>5. Your Rights and Choices</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li>
                  <strong>Access and Update:</strong> You can access and update your personal information through your account settings.
                </li>
                <li>
                  <strong>Opt-Out:</strong> You can opt out of receiving marketing emails by clicking the "unsubscribe" link in our emails.
                </li>
                <li>
                  <strong>Delete:</strong> You can request the deletion of your personal information by contacting us (subject to certain legal obligations).
                </li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>6. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="policy-section">
              <h2>7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can manage your cookie preferences through your browser settings.
              </p>
            </section>

            <section className="policy-section">
              <h2>8. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the updated policy on this page with a new "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="policy-section">
              <h2>9. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p>
                Email: <a href="mailto:support@simpleinventory.com">support@simpleinventory.com</a>
                <br />
                Address: 425 Inventory Lane, NYC City, BC 58392
              </p>
            </section>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;