import { Link } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import './CSS/HHeader.css';

const HHeader = () => {
  return (
    <div className="header">
      <div className="header-image">
        <Link to="/"
            onClick={(e) => {
              e.preventDefault(); // Prevents React Router from handling navigation
              window.location.href = "/"; // Forces a full refresh
            }}>
            <img
              src="/logo.png"
              alt="Clickable image redirects back to landing page. Logo of the website"
            />
        </Link>
      </div>
      <div className="top-right-options">
        <Row>
          <Col>
            <div className="header-buttons">
              <Link to="/aboutus">
                <Button variant="">About us</Button>
              </Link>
              <Link to="/Contact">
                <Button variant="">Contact</Button>
              </Link>
              <Link to="/Login">
                <Button variant="">Login</Button>
              </Link>
              <Link to="/SignUp">
                <Button variant="danger">Try Now</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HHeader;
