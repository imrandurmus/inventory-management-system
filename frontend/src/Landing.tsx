import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
  <div className="landing-page">
      
      {/* Background video not sure if ill keep so commented for now
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/watermarked_preview.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
       Background Video */}
    <div className="header">
        <div className="header-image">
          <Link to="/">
          <img src="/logo.jpg" alt="Clickable image redirects back to landing page. Logo of the website, a pink outline of a box" />
          </Link>
        </div>

        <div className="top-right-options">
          <Row>
            <Col>
            <div className="header-buttons">
              <Link to="/AboutUs">
              <Button variant=""> About us</Button>
              </Link> 
              <Link to="/Features">
              <Button variant="">Features</Button>
              </Link>
              <Link to="/Login">
              <Button variant="">Login</Button>
              </Link>
            </div>
            </Col>
          </Row>
        </div>

    </div>

{/* main section */}
      <div className="main-section">
        <Row>
            <div> <h1 className="main-title">SIMple</h1>
              <div className="main-subtitle">
              <h2></h2>
              <p>
                Inventory Management for Growing Businesses <br />
                Increase your sales and keep track of every unit with our powerful stock management, order fulfillment, and inventory control software.
              </p>
              </div>
            </div>

          <Col md={8} className="mx-auto text-center">
            <div className="main-buttons">
              <Link to="/Signup">
                <Button variant="" className="me-3">Sign Up - It's Free</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    <Container>
      <div className="main-image">
        <img src="/src/assets/stock_dash.png" alt="Warehouse image" />
      </div>
    </Container>
    
{/* main section */}


{/*features section */}
    <Container className="features-section">
             <h2 className="features-title">Run a More Efficient Business</h2>
            <Row>
              <Col md={4} className="feature-card">
                <img src="/square-outline.jpg" alt="image idk yet" />
                <h3>Increase Sales</h3>
                <p>Track. Manage. Optimize.</p>
              </Col>
              <Col md={4} className="feature-card">
                <img src="/square-outline.jpg" alt="s" />
                <h3>Manage Orders</h3>
                <p>Handle online and offline orders in one place.</p>
              </Col>
              <Col md={4} className="feature-card">
                <img src="/square-outline.jpg" alt="s" />
                <h3>Track Inventory</h3>
                <p>Track items with batch and serial number tracking.</p>
              </Col>
            </Row>
    </Container>
{/* features section */}


{/*example pictures */}
    <Container className="Example-Images">
        <img src="/src/assets/example_1.png" alt="image of an example inventory account" />
        <img src="/src/assets/example_2.png" alt="image of an example inventory account" />
        <img src="/src/assets/example_3.png" alt="image of an example inventory account" />
    </Container>




{/*cta-section*/}
      <div className="cta-section">
        <Container className="cta-text-center">
          <p>Effortless Inventory, Maximum Control. <br />
            Run a More Efficient Business</p>
        </Container>
      </div>
{/*cta-section*/}

      <div className="footer">
        <p>© 2025 SIMple. All Rights Reserved.</p>
      </div>
  </div>
  );
};

export default Landing;
