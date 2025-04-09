import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  MenuItem,
  Grid,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import "./CSS/SignUp.css";
import { signInWithGoogle } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import WBGHeader from "./WBGHeader";
import { auth } from "./firebaseConfig";

const SignUp = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    companyName: "",
    phoneNumber: "",
    country: "",
    language: "",
    companySize: "",
    interest: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { email, password, fullName } = formData;
    if (!email || !password || !fullName) {
      setErrorMessage("All required fields must be filled.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setErrorMessage("");
      console.log("Signed up with:", formData);
    } catch (error) {
      setErrorMessage("Failed to create account. Please try again.");
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
                    label="Full Name"
                    fullWidth
                    variant="outlined"
                    value={formData.fullName}
                    onChange={handleChange("fullName")}
                    required
                    error={!!errorMessage}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company Name"
                    fullWidth
                    variant="outlined"
                    value={formData.companyName}
                    onChange={handleChange("companyName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Work Email"
                    fullWidth
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange("email")}
                    required
                    error={!!errorMessage}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    type="tel"
                    variant="outlined"
                    value={formData.phoneNumber}
                    onChange={handleChange("phoneNumber")}
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
                <Link to="/User-Dashboard" className="submit-buttonn">
                  Create account
                </Link>
              </Button>

              <Button
                className="google-buttonn"
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{ mt: 1 }}
                onClick={signInWithGoogle}
              >
                Sign up with Google
              </Button>

              <Typography textAlign="center" mt={2} variant="body2" color="textSecondary">
                By clicking on 'Create account' you agree to Simple's{" "}
                <Link to="/privacy-policy" className="terms-link">
                  Privacy Policy
                </Link>
              </Typography>
            </form>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default SignUp;
