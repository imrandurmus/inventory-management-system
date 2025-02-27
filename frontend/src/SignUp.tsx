import { useState } from "react";
import { /*Link,*/ useNavigate } from "react-router-dom";
import { Form, Container, Card } from "react-bootstrap";
import React from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  /*
  Same as Login --------- do not delete
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Logging in with:", email, password);
  };
*/
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/menu"); // Redirect to Menu.tsx
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/src/assets/stock_img2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card style={{ width: "65rem" }} className="p-4 shadow">
        <h3 className="text-center mb-3">Sign up</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <button type="submit" className="btn btn-outline-primary w-100 mb-2">
            Sign Up!
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/")} // Navigates back to Landing page
          >
            Back
          </button>
        </Form>
      </Card>
    </Container>
  );
};

export default SignUp; // Default export
