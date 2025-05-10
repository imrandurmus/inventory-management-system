import { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import axios from "axios";

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
      await axios.post("http://localhost:8080/auth/forgot-password", {
        email,
      });
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
      setEmail("");

      // Optional: close the modal after a delay
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to send reset email. Please try again."
      );
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
