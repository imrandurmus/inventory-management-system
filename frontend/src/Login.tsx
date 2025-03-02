import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Card } from "react-bootstrap";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // Default role selection
  const navigate = useNavigate(); // Hook for navigation
  
/*
oussema pls add your dashboard routing 

  Commented this part so we use it when we need user authentication, 
  we dont need that rn so i made the login button just direct to the main menu of an account
  
  If u want to Login just fill in the email and pass part and click login

  --needed for backend-- do not delete
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Logging in with:", email, password);
  };
*/

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Save selected role in localStorage
    localStorage.setItem("userRole", role);

    // Navigate to the dashboard
    navigate("/dashboard");
  };

  return (
    <Container fluid className="login-container">
      <Card style={{ width: "22rem" }} className="p-4 shadow">
        <h3 className="text-center mb-3">Login</h3>
        <Form onSubmit={handleSubmit}>
          {/* email field (not required for now, just for UI) */}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* password field (not required for now, just for UI) */}
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          {/*role selection dropdown bc we want to see specific roles rn and havent connected a backend :< */}
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Select Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </Form.Select>
          </Form.Group>

          {/* login button */}
          <button type="submit" className="btn btn-outline-primary w-100 mb-2">
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>

          {/* back button */}
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

export default Login;