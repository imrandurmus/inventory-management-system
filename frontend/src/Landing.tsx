import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Landing.css";
import Spline from '@splinetool/react-spline';
//import { Carousel} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Landing = () => {
  return (
  <div className="landing-page">
      <div className="header">
        <div className="header-image">
          <Link to="/">
          <img src="/Draft_logo.png" alt="Clickable image redirects back to landing page. Logo of the website, a pink outline of a box" />
          </Link>
        </div>

        <div className="top-right-options">
          <Row>
            <Col>
            <div className="header-buttons">
              <Link to="/aboutus">
              <Button variant=""> About us</Button>
              </Link> 
              {/* <Link to="/Features">
              <Button variant="">Features</Button>
              </Link>*/}
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
        {/*2 main-section bc i couldnt get it to look the way i wanted to lol */}
      <div className="main-section">
        <div className="Splice_1">
        <Spline scene="/Spline_2.spline" />
        </div>
      </div>  

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
              <Link to="/SignUpForm">
                <Button variant="" className="me-3">Sign Up - It's Free</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    
    
{/* main section */}


{/*features section */}
<div className="features-section">
  <div className="scroll-container">
    <div className="scroll-images">
      <div className="image-wrapper">
        <img src="/Features_3.png" alt="Increase Sales" />
        <h3>Increase Sales</h3>
        <p>Track. Manage. Optimize.</p>
      </div>
      <div className="image-wrapper">
      <img src="/Features_2.png" alt="Increase Sales" />
      <h3>Manage Orders</h3>
        <p>Handle online and offline orders in one place.</p>
      </div>
      <div className="image-wrapper">
      <img src="/Features_1.png" alt="Increase Sales" />
      <h3>Track Inventory</h3>
        <p>Track items with batch and serial number tracking.</p>
      </div>
      <div className="image-wrapper">
      <img src="/Features_3.png" alt="Increase Sales" />
      <h3>Increase Sales</h3>
        <p>Track. Manage. Optimize.</p>
      </div>
      <div className="image-wrapper">
      <img src="/Features_2.png" alt="Increase Sales" />
      <h3>Manage Orders</h3>
        <p>Handle online and offline orders in one place.</p>
      </div>
      <div className="image-wrapper">
      <img src="/Features_4.png" alt="Increase Sales" />
      <h3>Manage Remotely</h3>
        <p>Monitor inventory levels in real-time and ensure stock availability is always up to date.</p>
      </div>
    </div>
  </div>
</div>
{/* features section */}


{/*example pictures */}
   <div className="Example-Images-Section">     
    <Container className="Example-Images">
        <img src="/src/assets/example_1.png" alt="image of an example inventory account" />
          <h1>Inventory Tracking</h1>
        <img src="/src/assets/example_2.png" alt="image of an example inventory account" />
          <h1>Manage Your Team</h1>
        <img src="/src/assets/example_3.png" alt="image of an example inventory account" />
          <h1>Stock Alerts & Notifications</h1>
    </Container>
   </div>
{/*example pictures */}




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
