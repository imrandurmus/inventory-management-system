import { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, Alert } from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";
import "./Contact.css"; // CSS file for styling
import WBGHeader from "./WBGHeader";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    subject: "",
    companySize: "",
    question: "",
  });
  const [showSuccess, setShowSuccess] = useState(false); // For success message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission (replace with actual API call)
    try {
      // Example: Simulate API call
      // const response = await fetch("/api/contact", { method: "POST", body: formData });
      // if (response.ok) {
      setShowSuccess(true); // Show success message
      // Reset form fields
      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        subject: "",
        companySize: "",
        question: "",
      });
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
      // } else {
      //   alert("Failed to submit request. Please try again.");
      // }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="contact-page">
      {/* Header Section */}
      <WBGHeader />

      {/* Main Content */}
      <Container className="contact-container">
        <Row>
          {/* Left Column: Contact Form */}
          <Col md={8} className="form-section">
            <Typography variant="h4" fontWeight="bold" gutterBottom className="form-title">
              Looking for something?
            </Typography>
            {showSuccess && (
              <Alert severity="success" className="success-message">
                Your request has been submitted successfully!
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography mr={1}>+90</Typography>,
                  }}
                />
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  select
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  variant="outlined"
                >
                  <MenuItem value="Request custom development">Question</MenuItem>
                  <MenuItem value="Support request">Support request</MenuItem>
                </TextField>
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  select
                  label="Your company size"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  required
                  variant="outlined"
                >
                  <MenuItem value="1-10">1-10 employees</MenuItem>
                  <MenuItem value="11-50">11-50 employees</MenuItem>
                  <MenuItem value="51-200">51-200 employees</MenuItem>
                  <MenuItem value="201+">201+ employees</MenuItem>
                </TextField>
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Box>
              <Typography variant="body2" color="textSecondary" mb={2}>
                We will handle your personal data as described in our{" "}
                <a href="/privacy-policy" className="privacy-link">
                  Privacy Policy
                </a>
                , to answer your question and provide information about our products and services.
              </Typography>
              <Button type="submit" variant="contained" className="submit-button">
                Submit
              </Button>
            </form>
          </Col>

          {/* Right Column:  Contacts */}
          <Col md={4} className="direct-contact-section">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Box className="contact-option">
              <Typography variant="body1" fontWeight="bold">
                Call or Schedule a video conference
              </Typography>
              <Typography variant="body2" color="textSecondary">
                +90 551 148 76 50
              </Typography>
            </Box>
            <Box className="contact-option">
              <Typography variant="body1" fontWeight="bold">Meet an expert</Typography>
              <Typography variant="body2" color="textSecondary">
                Assess your inventory needs.
              </Typography>
            </Box>
            <Box className="contact-option">
              <Typography variant="body1" fontWeight="bold">Request Help</Typography>
              <Typography variant="body2" color="textSecondary">
                Need help? Get in touch with developers.
              </Typography>
            </Box>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;