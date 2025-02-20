import { useState } from "react";
import { Form, Container, Card } from "react-bootstrap";

const Login = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//TODO: backend connect this shit pls
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Logging in with:", email, password);
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" 
    /* fixed the issue with alignment, 
    took years off my life */
    style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/src/assets/stock_img1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <Card style={{ width: "22rem" }} className="p-4 shadow">
        <h3 className="text-center mb-3">Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
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
            Login
          </button>
          <button type="button" className="btn btn-outline-secondary w-100" onClick={onBack}>
            Back
          </button>
        </Form>
      </Card> 
    </Container>
  );
};

export default Login;
// if u see this say hi in the gc hehe