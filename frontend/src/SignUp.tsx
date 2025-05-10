import { useEffect, useState } from "react";
import { TextField, Button, Typography, Box, Divider, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import WBGHeader from "./WBGHeader";
import { useTranslation } from "react-i18next";  // Import useTranslation
import "./CSS/SignUp.css";

const BASE_URL = "http://localhost:8080"; // Your backend URL

const SignUp = () => {
  const { t } = useTranslation();  // Use translation hook
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
      setErrorMessage(t("signUp.errors.requiredFields"));
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
        throw new Error(errorText || t("signUp.errors.signupFailed"));
      }

      setErrorMessage("");
      console.log("Signed up successfully:", formData);
      navigate("/login");
    } catch (error: any) {
      setErrorMessage(error.message || t("signUp.errors.signupFailed"));
    }
  };

  return (
    <div className="signup-page">
      <WBGHeader />
      <Box display="flex" minHeight="100vh" className="signup-container">
        {/* Left Promo Section */}
        <Box flex={1} p={5} className="promo-section">
          <Typography variant="h3" fontWeight="bold" gutterBottom className="promo-title">
            {t("signUp.promoTitle")}
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={4} className="promo-subtitle">
            {t("signUp.promoSubtitle")}
          </Typography>
          <Box className="testimonial">
            <Box className="stars">★★★★★</Box>
            <Typography variant="body2" fontStyle="italic" mb={1}>
              {t("signUp.testimonial.quote")}
            </Typography>
            <Typography variant="body2" fontWeight="bold">{t("signUp.testimonial.name")}</Typography>
            <Typography variant="body2" color="textSecondary">{t("signUp.testimonial.title")}</Typography>
          </Box>
          <Typography variant="body2" mt={4} mb={2} className="trusted-text">
            {t("signUp.trustedText")}
          </Typography>
        </Box>

        {/* Right Form Section */}
        <Box flex={1} p={5} display="flex" justifyContent="center" alignItems="center">
          <Box className="form-container" width="100%" maxWidth="600px">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {t("signUp.createAccount")}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t("signUp.firstName")}
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
                    label={t("signUp.lastName")}
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
                    label={t("signUp.email")}
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
                    label={t("signUp.password")}
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
                {t("signUp.createAccountButton")}
              </Button>

              <Typography textAlign="center" mt={2} variant="body2" color="textSecondary">
                {t("signUp.termsText")}
                <Link to="/privacy-policy" className="terms-link">
                  {t("signUp.termsLinkText")}
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
