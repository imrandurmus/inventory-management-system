import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import "./CSS/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import WBGHeader from "./WBGHeader";

const BASE_URL = "http://localhost:8080"; // Your backend URL

const SignUp = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { firstName, lastName, email, password } = formData;

    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("All required fields must be filled.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Signup failed.");
      }

      setErrorMessage("");
      console.log("Signed up successfully:", formData);
      navigate("/login");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <WBGHeader />
      <Box display="flex" minHeight="100vh" className="signup-container">
        {/* Left Promo Section */}
        <Box flex={1} p={5} className="promo-section">
          <Typography variant="h3" fontWeight="bold" gutterBottom className="promo-title">
            Never lose track of an item again.
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={4} className="promo-subtitle">
            Simple, fast, and powerful inventory software for businesses and teams to stay organized.
          </Typography>
          <Box className="testimonial">
            <Box className="stars">★★★★★</Box>
            <Typography variant="body2" fontStyle="italic" mb={1}>
              "Simple to input inventory. Simple to use. Easy to customize. My team adopted very quickly."
            </Typography>
            <Typography variant="body2" fontWeight="bold">Dwight S.</Typography>
            <Typography variant="body2" color="textSecondary">Assistant to the Manager</Typography>
          </Box>
          <Typography variant="body2" mt={4} mb={2} className="trusted-text">
            Join businesses both small and large that trust us to track and manage their inventory!
          </Typography>
        </Box>

        {/* Right Form Section */}
        <Box flex={1} p={5} display="flex" justifyContent="center" alignItems="center">
          <Box className="form-container" width="100%" maxWidth="600px">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Create an Account
            </Typography>
            <Divider sx={{ my: 2 }} />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    value={formData.firstName}
                    onChange={handleChange("firstName")}
                    required
                    error={!!errorMessage}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    value={formData.lastName}
                    onChange={handleChange("lastName")}
                    required
                    error={!!errorMessage}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    fullWidth
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange("email")}
                    required
                    error={!!errorMessage}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    fullWidth
                    type="password"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange("password")}
                    required
                    error={!!errorMessage}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="submit-buttonn"
                sx={{ mt: 3 }}
              >
                Create Account
              </Button>

              <Typography textAlign="center" mt={2} variant="body2" color="textSecondary">
                By clicking on 'Create account' you agree to Simple's{" "}
                <Link to="/privacy-policy" className="terms-link">
                  Privacy Policy
                </Link>
              </Typography>
              {errorMessage && (
                <Typography color="error" mt={2}>
                  {errorMessage}
                </Typography>
              )}
            </form>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default SignUp;
