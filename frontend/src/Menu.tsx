import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import "./CSS/Menu.css";

const Menu = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <Container fluid className="menu-container">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <Card className="shadow p-4">
            <h2 className="mb-4">Inventory Management System</h2>
            <h4>Welcome to the Admin Menu</h4>

            <Row className="mt-5">
              <Col sm={12} md={6}>
                <Button
                  variant="outline-primary"
                  className="menu-button"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
              </Col>
              <Col sm={12} md={6}>
                <Button
                  variant="outline-primary"
                  className="menu-button"
                  onClick={() => navigate("/products")}
                >
                  Products
                </Button>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col sm={12} md={6}>
                <Button
                  variant="outline-primary"
                  className="menu-button"
                  onClick={() => navigate("/categories")}
                >
                  Categories
                </Button>
              </Col>
              <Col sm={12} md={6}>
                <Button
                  variant="outline-primary"
                  className="menu-button"
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </Button>
              </Col>
            </Row>

            <Row className="mt-5">
              <Col sm={12}>
                <Button
                  variant="outline-secondary"
                  className="menu-button"
                  onClick={() => navigate("/")}
                >
                  Logout
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Menu;

