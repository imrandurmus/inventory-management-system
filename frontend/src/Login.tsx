import { useEffect, useState } from "react";
import { TextField, Checkbox, Button, FormControlLabel, Typography, Paper, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./CSS/Login.css";
import ForgotPassword from "./ForgotPassword";
import { Link } from "react-router-dom";
import WBGHeader from "./WBGHeader";
import { useTranslation } from "react-i18next"; // Import i18n

interface JwtPayload {
  sub: string; // Email
  role: string; // "MANAGER" or "REGULAR"
}

const Login = () => {
  const { t } = useTranslation(); // useTranslation hook to access the translate function

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage(t("Both fields are required."));
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
        throw new Error(errorData.error || t("Invalid email or password. Please try again."));
      }

      const data = await response.json();
      const { token } = data;

      localStorage.setItem("token", token);

      // Decode JWT to get role
      const decoded: JwtPayload = jwtDecode(token);
      const role = decoded.role;
      const fullName = await fetchFullName(token);

      // Store role in the same storage as token
      localStorage.setItem("role", role);

      setErrorMessage("");
      console.log("Logged in with:", { email: decoded.sub, role, fullName, token });

      // Redirect based on role
      if (role === "MANAGER") {
        navigate("/User-Dashboard");
      } else {
        navigate("/Regular-Dashboard");
      }
    } catch (error: any) {
      setErrorMessage(error.message || t("Invalid email or password. Please try again."));
      console.error("Login error:", error.message);
    } finally {
      setLoading(false);
    }
  };

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
      return ""; // Fallback if endpoint isn't implemented
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
              {t("login.Welcome Back!")}
            </Typography>
            <Typography>{t("login.Log in to your account.")}</Typography>
            <form onSubmit={handleSubmit} className="LoginSumbitButton">
              <TextField
                fullWidth
                margin="normal"
                label={t("login.Email")}
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={!!errorMessage}
                helperText={errorMessage && t("login.Please enter a valid email.")}
              />
              <TextField
                fullWidth
                margin="normal"
                label={t("login.Password")}
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={!!errorMessage}
                helperText={errorMessage && t("login.Please enter a valid password.")}
              />
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  } 
                  label={t("login.Remember me")} 
                />
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={handleForgotPasswordOpen}
                  className="forgot-password"
                >
                  {t("login.Forgot your password?")}
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
                {loading ? t("login.Signing in...") : t("login.Sign in")}
              </Button>
              <Typography textAlign="center" mt={2}>
                {t("login.Don't have an account?")} <Link to="/signup" className="sign-up">{t("login.Sign up")}</Link>
              </Typography>
            </form>
          </Paper>
        </Box>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog open={openForgotPassword} onClose={handleForgotPasswordClose}>
        <DialogTitle>{t("login.Forgot Password")}</DialogTitle>
        <DialogContent>
          <ForgotPassword onClose={handleForgotPasswordClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordClose} color="primary">
            {t("login.Close")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
