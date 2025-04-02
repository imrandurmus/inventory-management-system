import { useEffect, useState } from "react";
import { TextField, Checkbox, Button, FormControlLabel, Typography, Paper, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import "./Login.css";
import { signInWithGoogle } from "./firebaseConfig"; // Import Google Sign-In function
import ForgotPassword from "./ForgotPassword"; // Import ForgotPassword component
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase authentication
import { Link } from "react-router-dom";
import WBGHeader from "./WBGHeader";

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    try {
      // Assuming firebase for email/password login
      await signInWithEmailAndPassword(auth, email, password); //auth object here
      setErrorMessage(""); // Clear error if login is successful
      console.log("Logged in with:", { email, password });
      // Handle successful login here, e.g., redirect to a dashboard
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
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
        <Box flex={1} p={5} >
          <Paper elevation={3} className="login-form">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography>
            Log in to your account.
            </Typography>
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
                helperText={errorMessage && "Please enter a valid email."} // the error message
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Make the field required
                error={!!errorMessage} // Show error if there's an error message
                helperText={errorMessage && "Please enter a valid password."} // Error message
              />
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <FormControlLabel control={<Checkbox />} label="Remember me" />
                <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }} onClick={handleForgotPasswordOpen} className="forgot-password">
                  Forgot your password?
                </Typography>
              </Box>
              <Button type="submit" fullWidth variant="contained" className="purple-button" sx={{ mt: 2 }}>
                Sign in
              </Button>
              <Typography textAlign="center" mt={2}>
                Don't have an account? <Link to="/signup" className="sign-up">Sign up</Link>
              </Typography>
              <Divider sx={{ my: 2 }}>or</Divider>
              {/* the google button */}
              <Button className="google-button" variant="outlined" fullWidth startIcon={<GoogleIcon />}  sx={{ mb: 1 }} onClick={signInWithGoogle}>
                Sign in with Google
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>

      {/* forgot password part */}
      <Dialog open={openForgotPassword} onClose={handleForgotPasswordClose}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <ForgotPassword onClose={handleForgotPasswordClose} /> {/* Pass function to close the modal */}
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

const Feature = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <Box display="flex" alignItems="center" mb={3}>
    <Typography variant="h5" sx={{ marginRight: 2 }}>{icon}</Typography>
    <Box>
      <Typography variant="h6" fontWeight="bold">{title}</Typography>
      <Typography variant="body2">{description}</Typography>
    </Box>
  </Box>
);

export default Login;