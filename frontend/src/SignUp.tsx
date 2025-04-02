import { useEffect, useState } from "react";
import { TextField, Checkbox, Button, FormControlLabel, Typography, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import "./SignUp.css";
import { signInWithGoogle } from "./firebaseConfig"; // Import Google Sign-In function
import ForgotPassword from "./ForgotPassword"; // Import ForgotPassword component
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; // Firebase authentication
import { Link } from "react-router-dom";
import WBGHeader from "./WBGHeader";
import { auth } from "./firebaseConfig"; // Import your Firebase auth instance

const SignUp = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
  const [fullName, setFullName] = useState(""); // For sign-up form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState(false); // State to control modal visibility
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password || (!isLogin && !fullName)) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      if (isLogin) {
        // Login with email and password
        await signInWithEmailAndPassword(auth, email, password);
        setErrorMessage("");
        console.log("Logged in with:", { email, password });
        // Handle successful login here, e.g., redirect to a dashboard
      } else {
        // Sign up with email and password
        await createUserWithEmailAndPassword(auth, email, password);
        setErrorMessage("");
        console.log("Signed up with:", { fullName, email, password });
        // Handle successful sign-up here, e.g., redirect to a dashboard
      }
    } catch (error) {
      setErrorMessage(isLogin ? "Invalid email or password. Please try again." : "Failed to create account. Please try again.");
    }
  };

  const handleForgotPasswordOpen = () => {
    setOpenForgotPassword(true);
  };

  const handleForgotPasswordClose = () => {
    setOpenForgotPassword(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <WBGHeader />
      <Box display="flex" minHeight="100vh" className="login-container">
        {/* Left Column: Promotional Content */}
        <Box flex={1} p={5} className="promo-section">
          <Typography variant="h3" fontWeight="bold" gutterBottom className="promo-title">
            Never lose track of an item again.
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={4} className="promo-subtitle">
            Simple, fast, and powerful inventory software for businesses and teams to stay organized.
          </Typography>

          

          {/* testimonial part */}
          <Box className="testimonial">
            <Box className="stars">★★★★★</Box>
            <Typography variant="body2" fontStyle="italic" mb={1}>
              "Simple to input inventory. Simple to use. Simple to customize. My team adopted very quickly."
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              Olivia C.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              CEO
            </Typography>
          </Box>

          {/* trusted companies section */}
          <Typography variant="body2" mt={4} mb={2} className="trusted-text">
            Join businesses both small and large that trust us to track and manage their inventory!
          </Typography>
        </Box>

        {/* Right Column: Login/Sign-Up Form */}
        <Box flex={1} p={5} display="flex" justifyContent="center" alignItems="center">
          <Box className="form-container">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {isLogin ? "Login" : "Create an Account"}
            </Typography>
            <Divider sx={{ my: 2 }}>or</Divider>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
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
              )}
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
              {isLogin && (
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
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="submit-buttonn"
                sx={{ mt: 2 }}
              >
                {isLogin ? "Sign in" : "Create account"}
              </Button>
              
              <Button className="google-buttonn" variant="outlined" fullWidth startIcon={<GoogleIcon />} sx={{ mt: 1 }} onClick={signInWithGoogle}>
                Sign up with Google
              </Button>
              <Typography textAlign="center" mt={2}>
                {isLogin ? "Already have an account?" : "Don't have an account?"}{" "}
                <span onClick={toggleForm} className="toggle-link">
                  {isLogin ? "Sign up" : "Login"}
                </span>
              </Typography>
              {!isLogin && (
                <Typography textAlign="center" mt={2} variant="body2" color="textSecondary">
                  By clicking on 'Create account' you agree to SIMple's{" "}
                  <Link to="/privacy-policy" className="terms-link">
                    Privacy Policy
                  </Link>
                </Typography>
              )}
            </form>
          </Box>
        </Box>
      </Box>

      {/* Forgot Password Modal */}
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

export default SignUp; 