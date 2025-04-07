import { useEffect, useState } from "react";
import { TextField, Button, Typography, Box, Divider } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import './CSS/SignUp.css';
import { signInWithGoogle } from "./firebaseConfig"; // Import Google Sign-In function
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase authentication
import { Link } from "react-router-dom";
import WBGHeader from "./WBGHeader";
import { auth } from "./firebaseConfig"; // Import your Firebase auth instance

const SignUp = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);

  const [fullName, setFullName] = useState(""); // For sign-up form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password || !fullName) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      // Sign up with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      setErrorMessage("");
      console.log("Signed up with:", { fullName, email, password });
      // Handle successful sign-up here, e.g., redirect to a dashboard
    } catch (error) {
      setErrorMessage("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <WBGHeader />
      <Box display="flex" minHeight="100vh" className="signup-container">
        {/* Left Column: Promotional Content */}
        <Box flex={1} p={5} className="promo-section">
          <Typography variant="h3" fontWeight="bold" gutterBottom className="promo-title">
            Never lose track of an item again.
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={4} className="promo-subtitle">
            Simple, fast, and powerful inventory software for businesses and teams to stay organized.
          </Typography>

          {/* Testimonial part */}
          <Box className="testimonial">
            <Box className="stars">★★★★★</Box>
            <Typography variant="body2" fontStyle="italic" mb={1}>
              "Simple to input inventory. Simple to use. Easy to customize. My team adopted very quickly."
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              Dwight S.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Assistant to the Manager
            </Typography>
          </Box>

          {/* Trusted companies section */}
          <Typography variant="body2" mt={4} mb={2} className="trusted-text">
            Join businesses both small and large that trust us to track and manage their inventory!
          </Typography>
        </Box>

        {/* Right Column: Sign-Up Form */}
        <Box flex={1} p={5} display="flex" justifyContent="center" alignItems="center">
          <Box className="form-container">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Create an Account
            </Typography>
            <Divider sx={{ my: 2 }} />
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                type="text"
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                error={!!errorMessage}
                helperText={errorMessage && "Please enter your full name."}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Work Email"
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
                label="Create Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={!!errorMessage}
                helperText={errorMessage && "Please enter a valid password."}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="submit-buttonn"
                sx={{ mt: 2 }}
              >
                <Link to="/User-Dashboard" className="submit-buttonn">
                Create account
                </Link>
              </Button>
              
              <Button className="google-buttonn" variant="outlined" fullWidth startIcon={<GoogleIcon />} sx={{ mt: 1 }} onClick={signInWithGoogle}>
                Sign up with Google
              </Button>
              <Typography textAlign="center" mt={2} variant="body2" color="textSecondary">
                By clicking on 'Create account' you agree to SIMple's{" "}
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
