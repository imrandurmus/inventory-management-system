import { useEffect, useState } from "react";
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import "./CSS/Login.css";
import ForgotPassword from "./ForgotPassword";
import { Link } from "react-router-dom";
import WBGHeader from "./WBGHeader";

interface JwtPayload {
  sub: string; // Email
  role: string; // "MANAGER" or "REGULAR"
}

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Both fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      const { token } = data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Decode JWT to get role
      const decoded: JwtPayload = jwtDecode(token);
      const role = decoded.role;
      const fullName = await fetchFullName(token); // Optional: Fetch fullName if needed

      setErrorMessage("");
      console.log("Logged in with:", { email: decoded.sub, role, fullName });

      // Redirect based on role
      if (role === "MANAGER") {
        navigate("/manager/users"); // Adjusted to match earlier context
      } else {
        navigate("/regular/dashboard"); // Adjusted for consistency
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Invalid email or password. Please try again.");
      console.error("Login error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Fetch fullName from a /me endpoint
  const fetchFullName = async (token: string): Promise<string> => {
    try {
      const response = await fetch("http://localhost:8080/employees/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user details");
      const data = await response.json();
      return `${data.firstName} ${data.lastName}`;
    } catch (error) {
      console.error("Error fetching fullName:", error);
      return ""; // Fallback if endpoint isn’t implemented
    }
  };

  const handleForgotPasswordOpen = () => {
    setOpenForgotPassword(true);
  };

  const handleForgotPasswordClose = () => {
    setOpenForgotPassword(false);
  };

  return (
    <div className="login-container">
      <WBGHeader />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Box flex={1} p={5}>
          <Paper elevation={3} className="login-form">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography>Log in to your account.</Typography>
            <form onSubmit={handleSubmit} className="LoginSumbitButton">
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={!!errorMessage}
                helperText={errorMessage && "Please enter a valid email."}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={!!errorMessage}
                helperText={errorMessage && "Please enter a valid password."}
              />
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <FormControlLabel control={<Checkbox />} label="Remember me" />
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={handleForgotPasswordOpen}
                  className="forgot-password"
                >
                  Forgot your password?
                </Typography>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="purple-button"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Typography textAlign="center" mt={2}>
                Don't have an account? <Link to="/signup" className="sign-up">Sign up</Link>
              </Typography>
            </form>
          </Paper>
        </Box>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog open={openForgotPassword} onClose={handleForgotPasswordClose}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <ForgotPassword onClose={handleForgotPasswordClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;