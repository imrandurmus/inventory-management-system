import { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, Alert } from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";
import './CSS/Contact.css';
import WBGHeader from "./WBGHeader";
import { useTranslation } from "react-i18next";
import emailjs from "emailjs-com";

const ContactUs = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      await emailjs.send(
        "service_ks75oi7",           // Your EmailJS service ID
        "template_wsyhs23",          // Your EmailJS template ID
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          subject: formData.subject,
          "company size": formData.companySize, // Match template variable exactly
          question: formData.question,
        },
        "N3hFfiQI42MB-8bQs"           // Your public API key
      );
  
      setShowSuccess(true); // Show success alert
      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        subject: "",
        companySize: "",
        question: "",
      });
  
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Failed to send email. Please try again.");
    }
  };
  
  

  return (
    <div className="contact-page">
      <WBGHeader />

      <Container className="contact-container">
        <Row>
          <Col md={8} className="form-section">
            <Typography variant="h4" fontWeight="bold" gutterBottom className="form-title">
              {t("contact.heading")}
            </Typography>
            {showSuccess && (
              <Alert severity="success" className="success-message">
                {t("contact.successMessage")}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label={t("contact.name")}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label={t("contact.phone")}
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
                  label={t("contact.email")}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label={t("contact.company")}
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
                  label={t("contact.subject")}
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  variant="outlined"
                >
                  <MenuItem value="Request custom development">{t("contact.optionQuestion")}</MenuItem>
                  <MenuItem value="Support request">{t("contact.optionSupport")}</MenuItem>
                </TextField>
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  select
                  label={t("contact.companySize")}
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  required
                  variant="outlined"
                >
                  <MenuItem value="1-10">{t("contact.size1")}</MenuItem>
                  <MenuItem value="11-50">{t("contact.size2")}</MenuItem>
                  <MenuItem value="51-200">{t("contact.size3")}</MenuItem>
                  <MenuItem value="201+">{t("contact.size4")}</MenuItem>
                </TextField>
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label={t("contact.question")}
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
                {t("contact.privacy1")}{" "}
                <a href="/privacy-policy" className="privacy-link">
                  {t("contact.privacyLink")}
                </a>{" "}
                {t("contact.privacy2")}
              </Typography>
              <Button type="submit" variant="contained" className="submit-button">
                {t("contact.submit")}
              </Button>
            </form>
          </Col>

          <Col md={4} className="direct-contact-section">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {t("contact.contactUs")}
            </Typography>
            <Box className="contact-option">
              <Typography variant="body1" fontWeight="bold">
                {t("contact.call")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                +90 551 148 76 50
              </Typography>
            </Box>
            <Box className="contact-option">
              <Typography variant="body1" fontWeight="bold">
                {t("contact.expert")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("contact.assess")}
              </Typography>
            </Box>
            <Box className="contact-option">
              <Typography variant="body1" fontWeight="bold">
                {t("contact.help")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("contact.developerHelp")}
              </Typography>
            </Box>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
