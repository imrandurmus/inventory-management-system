import { useState } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Ensure this is correctly set up
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
    }
  };
                                        //TODO: set a link to send in case of pass reset, which means the user sees a new page for pass reset
  return (
    <div className="forgot-password-container">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
        </Typography>
        <Typography variant="body1">Enter your email to receive a reset link.</Typography>
        
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="success">{message}</Typography>}

        <Button fullWidth variant="contained" color="primary" onClick={handleResetPassword} sx={{ mt: 2 }}>
          Send Reset Link
        </Button>
    </div>
  );
};

export default ForgotPassword;


{/**
  import { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig"; //have to set up correctlyy

const ForgotPassword = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      setMessage("");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
      setEmail("");

      // optionally cloeses modal after a delay
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
      setMessage("");
    }
  };

  return (
    <Box className="forgot-password-container" p={3} textAlign="center">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body1" mb={2}>
        Enter your email to receive a reset link.
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
      />

      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <Button 
        fullWidth 
        variant="contained" 
        color="primary" 
        onClick={handleResetPassword} 
        sx={{ mt: 2 }}
      >
        Send Reset Link
      </Button>
    </Box>
  );
};

export default ForgotPassword;
 */}