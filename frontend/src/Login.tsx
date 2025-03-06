import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Card } from "react-bootstrap";
import Spline from '@splinetool/react-spline';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); 
  const navigate = useNavigate();

  //checks if all fields are filled
  useEffect(() => {
    if (email.trim() !== "" && password.trim() !== "" && role !== "") {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, password, role]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem("userRole", role);

    switch (role.toLowerCase()) {
      case "admin":
        navigate("/Admin-Dashboard");
        break;
      case "manager":
        navigate("/Manager-Dashboard");
        break;
      case "employee":
        navigate("/Employee-Dashboard");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="login-container-spline">
      <div className="spline-background">
        <Spline scene="https://prod.spline.design/7G7o2OJeUqDNm4PM/scene.splinecode" />
      </div>
      <div className="login-container">
        <Card style={{ width: "22rem" }} className="p-4 shadow">
          <h3 className="Header-Text">Login</h3>
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {/* Role selection */}
            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Select Role</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </Form.Select>
            </Form.Group>
            <button 
              type="submit" 
              className="btn w-100 mb-2" 
              disabled={!isFormValid}
            >
              Login as {role ? role.charAt(0).toUpperCase() + role.slice(1) : ""}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => navigate("/")} 
            >
              Back
            </button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;